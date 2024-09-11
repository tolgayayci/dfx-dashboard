import React, { useState, useCallback, useEffect, useRef, useLayoutEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { Label } from "@components/ui/label";
import { RefreshCw, Copy, X } from "lucide-react";
import { useToast } from "@components/ui/use-toast";

interface CommandAssistProps {
  selectedCommand: string;
  canisterName: string;
  customPath: string;
  methodName?: string;
}

export default function CommandAssist({
  selectedCommand,
  canisterName,
  customPath,
  methodName: initialMethodName,
}: CommandAssistProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [commandOutput, setCommandOutput] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const [methodName, setMethodName] = useState(initialMethodName || "");
  const [isMethodNameEntered, setIsMethodNameEntered] = useState(
    !!initialMethodName
  );
  const [isInputRequired, setIsInputRequired] = useState(false);
  const [inputLabel, setInputLabel] = useState("");
  const { toast } = useToast();
  const outputRef = useRef<HTMLPreElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleRunCommand = useCallback(async () => {
    setCommandOutput("");
    setInputValue("");
    setIsInputRequired(false);

    try {
      const output = await window.awesomeApi.runAssistedCommand(
        selectedCommand,
        canisterName,
        customPath,
        methodName
      );
      setCommandOutput(output);
    } catch (error) {
      console.error("Error running assisted command:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setCommandOutput(`Error: ${errorMessage}`);
    }
  }, [selectedCommand, canisterName, customPath, methodName]);

  useEffect(() => {
    const handleOutput = (data: {
      type: "stdout" | "stderr";
      content: string;
    }) => {
      const cleanContent = cleanOutputContent(data.content);
      if (cleanContent) {
        setCommandOutput((prev) => prev + cleanContent + "\n");
      }
    };

    const handleInputRequired = (data: { prompt: string }) => {
      const formattedPrompt = data.prompt
        .replace(/\[\d+m/g, "")
        .replace(/\u001b\[\d+m/g, "")
        .replace(/\?/g, "")
        .replace(/\[38;5;8m›/, "")
        .trim()
        .replace(/^\s+/, "")
        .replace(/\s*\(type :e to use editor\)/i, "");
      setInputLabel(formattedPrompt);
      setIsInputRequired(true);
    };

    window.awesomeApi.onAssistedCommandOutput(handleOutput);
    window.awesomeApi.onAssistedCommandInputRequired(handleInputRequired);

    return () => {
      window.awesomeApi.offAssistedCommandOutput(handleOutput);
      window.awesomeApi.offAssistedCommandInputRequired(handleInputRequired);
    };
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [commandOutput]);

  useLayoutEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [commandOutput]);

  const cleanOutputContent = (content: string) => {
    return content
      .replace(/\[\d+m/g, "")
      .replace(/\u001b\[\d+m/g, "")
      .replace(/^WARN:.*$/gm, "")
      .replace(/^bash-3\.2\$.*$/gm, "")
      .trim();
  };

  const handleSendInput = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    await window.awesomeApi.sendAssistedCommandInput(inputValue);
    setInputValue("");
    setIsInputRequired(false);
  };

  const handleMethodNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (methodName.trim() === "") return;
    setIsMethodNameEntered(true);
    handleRunCommand();
  };

  const handleReset = () => {
    setCommandOutput("");
    setInputValue("");
    setIsMethodNameEntered(false);
    setMethodName("");
    setIsInputRequired(false);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(commandOutput);
    toast({
      title: "Copied to clipboard",
      description: "The command output has been copied to your clipboard.",
      duration: 2000,
    });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const renderOutput = () => {
    if (commandOutput) {
      return (
        <div className="bg-gray-900 text-white p-4 rounded-md -mt-1">
          <ScrollArea ref={scrollAreaRef} className="h-[calc(60vh-50px)]">
            <pre
              className="font-mono text-sm whitespace-pre-wrap"
            >
              {commandOutput.split("\n").map((line, index) => (
                <div key={index}>
                  {line
                    .split(
                      /(\s--[\w-]+(?:\s+<[\w_]+>)?|\s-\w(?:\s+<[\w_]+>)?)/g
                    )
                    .map((part, partIndex) => {
                      if (part.trim().match(/^--[\w-]+(?:\s+<[\w_]+>)?$/)) {
                        return (
                          <span key={partIndex} className="text-blue-400">
                            {part}
                          </span>
                        );
                      } else if (part.trim().match(/^-\w(?:\s+<[\w_]+>)?$/)) {
                        return (
                          <span key={partIndex} className="text-blue-400">
                            {part}
                          </span>
                        );
                      } else {
                        return <span key={partIndex}>{part}</span>;
                      }
                    })}
                </div>
              ))}
            </pre>
            <ScrollBar />
          </ScrollArea>
        </div>
      );
    }
    return null;
  };

  const buttonText = `Assist ${selectedCommand}`;

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>{buttonText}</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="sm:max-w-[550px]"
          onInteractOutside={() => setIsOpen(false)}
        >
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Command Assist: {selectedCommand}</span>
              <div className="flex space-x-2">
                {commandOutput && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="outline" size="icon" onClick={handleReset}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div>
            {(selectedCommand === "call" || selectedCommand === "sign") &&
            !isMethodNameEntered ? (
              <form onSubmit={handleMethodNameSubmit}>
                <Label htmlFor="methodName">Method Name</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    id="methodName"
                    value={methodName}
                    onChange={(e) => setMethodName(e.target.value)}
                    placeholder="Enter method name"
                  />
                  <Button type="submit">Start</Button>
                </div>
              </form>
            ) : (
              <>
                {renderOutput()}
                {isInputRequired && (
                  <form onSubmit={handleSendInput} className="mt-4">
                    <Label htmlFor="userInput">{inputLabel}</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        id="userInput"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your input..."
                      />
                      <Button type="submit">Send</Button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
