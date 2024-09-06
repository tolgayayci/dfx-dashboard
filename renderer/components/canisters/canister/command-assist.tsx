import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { ScrollArea } from "@components/ui/scroll-area";
import { Label } from "@components/ui/label";

interface CommandAssistProps {
  selectedCommand: string;
  canisterName: string;
  customPath: string;
  methodName?: string;
}

interface OutputItem {
  type: "stdout" | "stderr";
  content: string;
}

export default function CommandAssist({
  selectedCommand,
  canisterName,
  customPath,
  methodName: initialMethodName,
}: CommandAssistProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [output, setOutput] = useState<OutputItem[]>([]);
  const [inputRequired, setInputRequired] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [prompt, setPrompt] = useState("");
  const [methodName, setMethodName] = useState(initialMethodName || "");

  const handleRunCommand = useCallback(async () => {
    setOutput([]);
    setInputRequired(false);
    setInputValue("");
    setPrompt("");

    try {
      await window.awesomeApi.runAssistedCommand(
        selectedCommand,
        canisterName,
        customPath,
        methodName
      );
    } catch (error) {
      console.error("Error running assisted command:", error);
      setOutput((prev) => [
        ...prev,
        { type: "stderr", content: `Error: ${error.message}` },
      ]);
    }
  }, [selectedCommand, canisterName, customPath, methodName]);

  useEffect(() => {
    const handleOutput = (data: OutputItem) => {
      setOutput((prev) => [...prev, data]);
    };

    const handleInputRequired = (data: { prompt: string }) => {
      setInputRequired(true);
      setPrompt(data.prompt);
    };

    window.awesomeApi.onAssistedCommandOutput(handleOutput);
    window.awesomeApi.onAssistedCommandInputRequired(handleInputRequired);

    return () => {
      window.awesomeApi.offAssistedCommandOutput(handleOutput);
      window.awesomeApi.offAssistedCommandInputRequired(handleInputRequired);
    };
  }, []);

  const handleSendInput = async () => {
    if (inputValue) {
      await window.awesomeApi.sendAssistedCommandInput(inputValue);
      setInputRequired(false);
      setInputValue("");
      setPrompt("");
    }
  };

  const buttonText = `Assist ${selectedCommand}`;

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>{buttonText}</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Command Assist: {selectedCommand}</DialogTitle>
          </DialogHeader>
          {(selectedCommand === "call" || selectedCommand === "sign") && (
            <div className="mb-4">
              <Label htmlFor="methodName">Method Name</Label>
              <Input
                id="methodName"
                value={methodName}
                onChange={(e) => setMethodName(e.target.value)}
                placeholder="Enter method name"
              />
            </div>
          )}
          <Button onClick={handleRunCommand}>Run Command</Button>
          <ScrollArea className="h-[300px] w-full mt-4">
            {output.map((item, index) => (
              <div
                key={index}
                className={item.type === "stderr" ? "text-red-500" : ""}
              >
                {item.content}
              </div>
            ))}
          </ScrollArea>
          {inputRequired && (
            <div className="mt-4">
              <p>{prompt}</p>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter your response"
              />
              <Button onClick={handleSendInput} className="mt-2">Send</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
