import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";

interface Output {
  type: string;
  content: string;
}

interface Status {
  success?: boolean;
  message: string;
}

export default function CommandAssist({
  selectedCommand,
  canisterName,
  customPath,
}: {
  selectedCommand: string;
  canisterName: string;
  customPath: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [outputs, setOutputs] = useState<Output[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);

  const handleOutput = useCallback(
    (data: { type: string; content: string; success?: boolean }) => {
      setOutputs((prev) => {
        // Deduplicate messages
        if (prev.some((output) => output.content === data.content)) {
          return prev;
        }

        // Handle stderr differently when using --always-assist
        if (data.type === "stderr") {
          // Ignore warnings
          if (data.content.toLowerCase().includes("warning")) {
            return prev;
          }
          // Treat other stderr as info
          return [...prev, { type: "info", content: data.content }];
        }

        return [...prev, { type: data.type, content: data.content }];
      });

      if (data.type === "stdout" && data.content.includes("?")) {
        setIsWaitingForInput(true);
      }
      if (data.type === "status") {
        setStatus({ success: data.success, message: data.content });
      }
    },
    []
  );

  useEffect(() => {
    if (isOpen) {
      startAssistedCommand();
      window.awesomeApi.onAssistedCommandOutput(handleOutput);
    }

    return () => {
      window.awesomeApi.offAssistedCommandOutput(handleOutput);
      if (!isOpen) {
        setOutputs([]);
        setUserInput("");
        setIsWaitingForInput(false);
        setStatus(null);
      }
    };
  }, [isOpen, handleOutput]);

  const startAssistedCommand = async () => {
    setOutputs([]);
    setStatus(null);
    try {
      const result = await window.awesomeApi.runAssistedCommand(
        selectedCommand,
        canisterName,
        customPath,
        true // Always use --always-assist
      );
      if (!result.success) {
        setStatus({
          success: false,
          message: result.error || "Failed to start command",
        });
      }
    } catch (error) {
      console.error("Error running assisted command:", error);
      setStatus({ success: false, message: "Error running command" });
    }
  };

  const handleInputSubmit = async () => {
    setIsWaitingForInput(false);
    try {
      const result = await window.awesomeApi.sendAssistedCommandInput(
        userInput
      );
      if (!result.success) {
        setStatus({
          success: false,
          message: result.error || "Failed to send input",
        });
      }
    } catch (error) {
      console.error("Error sending input:", error);
      setStatus({ success: false, message: "Error sending input" });
    }
    setUserInput("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Command Assist
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedCommand.charAt(0).toUpperCase() + selectedCommand.slice(1)}{" "}
            Assist Wizard
          </DialogTitle>
          <DialogDescription className="mt-3">
            You can use this dynamic UI to generate the params for the command
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[300px] overflow-y-auto">
          {outputs.map((output, index) => (
            <div
              key={index}
              className={`text-sm ${
                output.type === "stderr"
                  ? "text-red-500"
                  : output.type === "info"
                  ? "text-blue-500"
                  : ""
              }`}
            >
              {output.content}
            </div>
          ))}
        </div>
        {isWaitingForInput && (
          <div>
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter your response"
            />
            <Button onClick={handleInputSubmit}>Submit</Button>
          </div>
        )}
        {status && (
          <div
            className={`mt-4 p-2 ${
              status.success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status.message}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
