import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { FileBoxIcon, AlertCircle } from "lucide-react";
import { useToast } from "@components/ui/use-toast";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";

interface OutputModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  latestCommand: string;
  runnedCommand: string;
  commandOutput: string;
  commandError: string;
}

export default function OutputModal({
  isOpen,
  onOpenChange,
  latestCommand,
  runnedCommand,
  commandOutput,
  commandError,
}: OutputModalProps) {
  const { toast, dismiss} = useToast();
  const [accordionValue, setAccordionValue] = useState<string>("status");

  useEffect(() => {
    if (commandOutput && !commandError) {
      const { id } = toast({
        title: "Command Executed Successfully",
        description: (
          <div>
            <pre className="bg-gray-100 text-black p-1 px-2 rounded-md mt-1">
              {runnedCommand}
            </pre>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                onOpenChange(true);
                dismiss(id);
              }}
              className="mt-2"
            >
              View Output
            </Button>
          </div>
        ),
        variant: "default",
        className: "border-green-500",
        duration: 2000,
      });
    } else if (commandError) {
      const { id } =toast({
        title: "Command Execution Failed",
        description: (
          <div>
            <pre className="bg-gray-100 text-black p-1 px-2 rounded-md mt-1">
              {runnedCommand}
            </pre>
            <Button
              variant="default"
              onClick={() => {
                onOpenChange(true);
                dismiss(id);
              }}
              className="mt-2"
            >
              View Output
            </Button>
          </div>
        ),
        variant: "default",
        className: "border-red-500",
        duration: 2000,

      });
    }
  }, [commandOutput, commandError, runnedCommand, onOpenChange]);

  useEffect(() => {
    if (commandOutput || commandError) {
      setAccordionValue("output");
    } else {
      setAccordionValue("status");
    }
  }, [commandOutput, commandError]);

  const renderOutput = () => {
    if (commandOutput) {
      return (
        <div className="bg-gray-900 text-white p-4 rounded-md -mt-1">
          <ScrollArea className="h-[calc(80vh-106px)]">
            <pre className="font-mono text-sm whitespace-pre-wrap overflow-x-auto">
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
                      } else if (part.trim() === "") {
                        return <br key={partIndex} />;
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
    } else if (commandError) {
      return (
        <div className="bg-red-100 text-red-500 p-4 rounded-md -mt-1">
          <ScrollArea className="h-[calc(80vh-106px)]">
            <pre className="font-mono text-sm whitespace-pre-wrap overflow-x-auto">
              {commandError.split("\n").map((line, index) => (
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
                      } else if (part.trim() === "") {
                        return <br key={partIndex} />;
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileBoxIcon className="w-5 h-5 mr-2" />
          View Output
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[calc(70vw-106px)]">
        <DialogHeader>
          <DialogTitle>Command Output</DialogTitle>
          <DialogDescription className="pt-2">
            <pre className="bg-white text-black shadow-lg border border-black p-2 pl-3 rounded-md">
              {runnedCommand}
            </pre>
          </DialogDescription>
        </DialogHeader>
        {renderOutput()}
      </DialogContent>
    </Dialog>
  );
}
