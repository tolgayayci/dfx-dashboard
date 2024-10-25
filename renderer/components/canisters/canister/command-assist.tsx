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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@components/ui/select";
import * as path from 'path';
import { Switch } from "@components/ui/switch";
import { AnsiUp } from 'ansi_up';

interface CommandAssistProps {
  selectedCommand: string;
  canisterName: string;
  customPath: string;
  methodName?: string;
  networkPreference: string;
}

export default function CommandAssist({
  selectedCommand,
  canisterName,
  customPath,
  methodName: initialMethodName,
  networkPreference,
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
  const [availableMethods, setAvailableMethods] = useState<string[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string | undefined>(undefined);
  const [includeNetwork, setIncludeNetwork] = useState(true);
  const ansiUp = new AnsiUp();

  useEffect(() => {
    const fetchMethods = async () => {
      if (customPath && canisterName) {
        try {
          const declarationsPath = path.join(customPath, 'src', 'declarations', canisterName);
          const candidFile = path.join(declarationsPath, `${canisterName}.did`);

          if (await window.awesomeApi.checkFileExists(candidFile)) {
            const methods = await window.awesomeApi.readMethodsFromFile(candidFile);
            setAvailableMethods(methods);
          } else {
            setAvailableMethods([]);
          }
        } catch (error) {
          console.error("Error reading methods from file:", error);
          setAvailableMethods([]);
        }
      }
    };

    fetchMethods();
  }, [customPath, canisterName]);

  const handleRunCommand = useCallback(async () => {
    setCommandOutput("");
    setInputValue("");
    setIsInputRequired(false);

    try {
      const networkFlag = includeNetwork ? networkPreference : undefined;
      await window.awesomeApi.runAssistedCommand(
        selectedCommand,
        canisterName,
        customPath,
        methodName,
        networkFlag
      );
    } catch (error) {
      console.error("Error running assisted command:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setCommandOutput(`Error: ${errorMessage}`);
    }
  }, [selectedCommand, canisterName, customPath, methodName, includeNetwork, networkPreference]);

  useEffect(() => {
    const handleOutput = (data: {
      type: "stdout" | "stderr";
      content: string;
    }) => {
      setCommandOutput((prev) => prev + data.content);
    };

    const handleInputRequired = (data: { prompt: string }) => {
      const formattedPrompt = data.prompt
        .replace(/\x1B\[[0-9;]*[mK]/g, "") // Remove ANSI color codes
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

  const handleSendInput = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    await window.awesomeApi.sendAssistedCommandInput(inputValue);
    setInputValue("");
    setIsInputRequired(false);
  };

  const handleMethodNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (methodName.trim() === "" && !selectedMethod) return;
    setIsMethodNameEntered(true);
    handleRunCommand();
  };

  const handleMethodNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMethodName(e.target.value);
    setSelectedMethod(undefined);
  };

  const handleSelectChange = (value: string) => {
    setSelectedMethod(value);
    setMethodName(value);
  };

  const handleReset = () => {
    setCommandOutput("");
    setInputValue("");
    setIsMethodNameEntered(false);
    setMethodName("");
    setIsInputRequired(false);
    setSelectedMethod(undefined); // Reset the selected method
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
      const htmlOutput = ansiUp.ansi_to_html(commandOutput);
      return (
        <div className="bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-md -mt-1 font-mono shadow-md border border-[#444]">
          <ScrollArea ref={scrollAreaRef} className="h-[calc(60vh-50px)] rounded-b-md overflow-x-auto">
            <pre ref={outputRef} className="text-sm leading-relaxed whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: htmlOutput }}></pre>
            <ScrollBar />
          </ScrollArea>
        </div>
      );
    }
    return null;
  };

  const renderNetworkToggle = () => (
    <div className="flex items-center space-x-2 mt-4">
      <Switch
        id="network-toggle"
        checked={includeNetwork}
        onCheckedChange={setIncludeNetwork}
      />
      <Label htmlFor="network-toggle">Include --network ({networkPreference})</Label>
    </div>
  );

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
                <div className="flex flex-col space-y-2 mt-2">
                  <Select onValueChange={handleSelectChange} value={selectedMethod}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="methodName"
                    value={methodName}
                    onChange={handleMethodNameChange}
                    placeholder="Or enter method name"
                    className="w-full"
                  />
                  <div className="space-y-2">
                  {renderNetworkToggle()}
                  </div>
                  <Button type="submit" className="w-full mt-4">Start</Button>
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
                {renderNetworkToggle()}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
