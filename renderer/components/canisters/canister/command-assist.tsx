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
import { cn } from "@lib/utils";
import { Switch } from "@components/ui/switch";

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

  useEffect(() => {
    const fetchMethods = async () => {
      if (customPath && canisterName) {
        try {
          const declarationsPath = path.join(customPath, 'src', 'declarations', canisterName);
          const candidFile = path.join(declarationsPath, `${canisterName}.did`);

          console.log(`Checking for Candid file: ${candidFile}`);

          if (await window.awesomeApi.checkFileExists(candidFile)) {
            console.log("Reading methods from Candid file");
            const methods = await window.awesomeApi.readMethodsFromFile(candidFile);
            console.log("Fetched methods:", methods);
            setAvailableMethods(methods);
          } else {
            console.log("Candid file not found");
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
      .replace(/\u001b\[\d+m/g, '') // Remove ANSI color codes
      .replace(/^\? /gm, '') // Remove leading question marks
      .replace(/\[38;5;8m›/g, '') // Remove specific color code
      .replace(/\[2K|\[1A|\[1B/g, '') // Remove cursor movement codes
      .replace(/\r/g, '') // Remove carriage returns
      .replace(/\n+/g, '\n') // Replace multiple newlines with a single newline
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
      return (
        <div className="bg-black text-white p-4 rounded-md -mt-1 font-mono">
          <ScrollArea ref={scrollAreaRef} className="h-[calc(60vh-50px)]">
            <pre className="text-sm whitespace-pre-wrap">
              {commandOutput.split('\n').map((line, index) => {
                // Remove ANSI escape codes
                line = line.replace(/\x1B\[[0-9;]*[JKmsu]/g, '');

                // Handle different types of output
                if (line.startsWith('$') || line.startsWith('>')) {
                  return <span key={index} className="text-green-400">{line}</span>;
                } else if (line.includes('Error:')) {
                  return <span key={index} className="text-red-500">{line}</span>;
                } else if (line.includes('Warning:')) {
                  return <span key={index} className="text-yellow-500">{line}</span>;
                } else if (line.match(/^\s*\[.*\]\s*$/)) {
                  return <span key={index} className="text-blue-400">{line}</span>;
                } else {
                  return <span key={index}>{line}</span>;
                }
              })}
            </pre>
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
