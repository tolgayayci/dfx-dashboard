"use client";
import { useState, useEffect } from "react";
import { KillAll } from "@components/dfx/killall";

import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@components/ui/dialog";
import { Checkbox } from "@components/ui/checkbox";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@components/ui/dropdown-menu";
import { useToast } from "@components/ui/use-toast";
import { Badge } from "@components/ui/badge";

import { Loader, XIcon } from "lucide-react";
import { CaretDownIcon } from "@radix-ui/react-icons";

interface DfxStartOptions {
  background?: boolean;
  clean?: boolean;
  "enable-bitcoin"?: boolean;
  "enable-canister-http"?: boolean;
  pocketic?: boolean;
  host?: string;
  "bitcoin-node"?: string;
  "artificial-delay"?: string;
  domain?: string[];
}

const DFX_START_OPTIONS: Array<{
  name: keyof DfxStartOptions;
  description: string;
  type: "checkbox" | "input" | "multiInput";
  placeholder?: string;
  tooltip: string;
}> = [
  {
    name: "background",
    description: "Start in the background",
    type: "checkbox",
    tooltip:
      "Starts the local canister execution environment and web server processes in the background and waits for a reply before returning to the shell.",
  },
  {
    name: "clean",
    description: "Start in a clean state",
    type: "checkbox",
    tooltip:
      "Starts the local canister execution environment and web server processes in a clean state by removing checkpoints from your project cache.",
  },
  {
    name: "enable-bitcoin",
    description: "Enable Bitcoin integration",
    type: "checkbox",
    tooltip: "Enables bitcoin integration.",
  },
  {
    name: "enable-canister-http",
    description: "Enable canister HTTP requests",
    type: "checkbox",
    tooltip:
      "Enables canister HTTP requests. (deprecated: now enabled by default)",
  },
  {
    name: "pocketic",
    description: "Run PocketIC instead of replica",
    type: "checkbox",
    tooltip: "Runs PocketIC instead of the replica.",
  },
  {
    name: "host",
    description: "Specify host interface IP and port",
    type: "input",
    placeholder: "127.0.0.1:4943",
    tooltip:
      "Specifies the host interface IP address and port number to bind the frontend to.",
  },
  {
    name: "bitcoin-node",
    description: "Specify bitcoind node address",
    type: "input",
    placeholder: "host:port",
    tooltip:
      "Specifies the address of a bitcoind node. Implies --enable-bitcoin.",
  },
  {
    name: "artificial-delay",
    description: "Specify update call delay (ms)",
    type: "input",
    placeholder: "600",
    tooltip:
      "Specifies the delay that an update call should incur. Default: 600ms",
  },
  {
    name: "domain",
    description: "Specify domain(s) that can be served",
    type: "multiInput",
    placeholder: "localhost",
    tooltip:
      "A domain that can be served. Can be specified more than once. These are used for canister resolution.",
  },
];

export default function CheckDfxStatus() {
  const [dfxStatus, setDfxStatus] = useState<"running" | "stopped">("stopped");
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [isKillAllModalOpen, setIsKillAllModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [commandOutput, setCommandOutput] = useState("");
  const [commandError, setCommandError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [dfxStartOptions, setDfxStartOptions] = useState<DfxStartOptions>({
    background: true,
    clean: true,
  });

  const { toast } = useToast();

  useEffect(() => {
    checkDfxStatus();
  }, []);

  const checkDfxStatus = async () => {
    setIsLoading(true);
    try {
      const output = await window.awesomeApi.runCommand("lsof -i tcp:4943");
      if (
        output.includes("dfx") ||
        output.includes("replica") ||
        output.includes("icx-proxy")
      ) {
        setDfxStatus("running");
      } else {
        setDfxStatus("stopped");
      }
    } catch (error) {
      setDfxStatus("stopped");
    }
    setIsLoading(false);
  };

  const handleDfxCommand = async (
    command: string,
    args: string[] = [],
    flags: string[] = []
  ) => {
    setIsLoading(true);
    setCommandOutput("");
    setCommandError("");
    setStatusMessage("");
    try {
      const output = await window.awesomeApi.runDfxCommand(
        command,
        null,
        args,
        flags,
        null
      );
      setCommandOutput(output);

      if (command === "start" && !output.includes("Error")) {
        const dashboardMatch = output.match(/Dashboard:\s*(http:\/\/[^\s]+)/);
        if (dashboardMatch) {
          setStatusMessage(
            `dfx ${command} executed successfully. Dashboard available at ${dashboardMatch[1]}`
          );
          setIsStartModalOpen(false);
        } else {
          setCommandError(
            "No dashboard URL found in output. Please check the command output for details."
          );
        }
        setIsStartModalOpen(false);
      } else if (command === "stop") {
        if (output.includes("Stopped")) {
          setStatusMessage("dfx stopped successfully");
          setIsStopModalOpen(false);
        } else {
          setCommandError(
            "Unexpected output received. Please check the command output for details."
          );
        }
      }
    } catch (error) {
      console.error(`Error executing dfx ${command}:`, error);
      setCommandError(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
    await checkDfxStatus();
    setIsLoading(false);
  };

  const handleStartDfx = async () => {
    setIsStartModalOpen(false);

    const flags = Object.entries(dfxStartOptions)
      .filter(
        ([key, value]) =>
          value &&
          key !== "host" &&
          key !== "bitcoin-node" &&
          key !== "artificial-delay" &&
          key !== "domain"
      )
      .map(([key]) => `--${key}`);

    if (dfxStartOptions.host) flags.push(`--host=${dfxStartOptions.host}`);
    if (dfxStartOptions["bitcoin-node"])
      flags.push(`--bitcoin-node=${dfxStartOptions["bitcoin-node"]}`);
    if (dfxStartOptions["artificial-delay"])
      flags.push(`--artificial-delay=${dfxStartOptions["artificial-delay"]}`);
    if (dfxStartOptions.domain) {
      dfxStartOptions.domain.forEach((domain) =>
        flags.push(`--domain=${domain}`)
      );
    }

    // Always add --clean and --background flags
    if (!flags.includes("--clean")) flags.push("--clean");
    if (!flags.includes("--background")) flags.push("--background");

    await handleDfxCommand("start", [], flags);
  };

  const handleStopDfx = async () => {
    try {
      setIsStopModalOpen(false);
      await handleDfxCommand("stop");
      // Check if dfx is still running
      const output = await window.awesomeApi.runCommand("lsof -i tcp:4943");
      if (
        output.includes("dfx") ||
        output.includes("replica") ||
        output.includes("icx-proxy")
      ) {
        // If dfx is still running, use the killall command
        await window.awesomeApi.runCommand("killall dfx icx-proxy");
        await checkDfxStatus();
        if (dfxStatus === "stopped") {
          setStatusMessage("dfx stopped successfully using killall");
          setIsStopModalOpen(false);
        } else {
          setCommandError("Failed to stop dfx even after using killall");
        }
      }
      setIsStopModalOpen(false);
    } catch (error) {
      console.error("Error stopping dfx:", error);
      setIsStopModalOpen(false);
    }
  };

  const isRunning = dfxStatus === "running";

  const handleStartOptionChange = (
    option: keyof DfxStartOptions,
    value: boolean | string | string[]
  ) => {
    if (option !== "background" && option !== "clean") {
      setDfxStartOptions((prev) => ({ ...prev, [option]: value }));
    }
  };

  async function killAllDfx() {
    try {
      const result = await window.awesomeApi.runDfxCommand("killall");
      toast({
        title: "DFX Processes Killed",
        description: result || "All DFX processes have been terminated.",
      });

      await window.awesomeApi.reloadApplication();
    } catch (error) {
      console.error(`Error: ${error}`);
      toast({
        title: "Error",
        description: "Failed to kill DFX processes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsKillAllModalOpen(false);
    }
  }

  return (
    <div className="flex items-center">
      <div className="grid gap-1 flex-1 items-center">
        <div className="flex items-center w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full border-t rounded-none justify-start h-14 ${
                  isRunning ? "" : "bg-red-50 text-red-600 border-red-200"
                }`}
                disabled={isLoading}
              >
                {isLoading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
                <span className="font-semibold text-sm">Dfx</span>
                {isRunning ? (
                  <Badge
                    variant="outline"
                    className="ml-4 bg-green-50 text-green-600 border-green-200 rounded-md"
                  >
                    Running
                    <CaretDownIcon className="" />
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="ml-4 bg-red-50 text-red-600 border-red-200"
                  >
                    Stopped
                    <CaretDownIcon className="" />
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() =>
                  isRunning
                    ? setIsStopModalOpen(true)
                    : setIsStartModalOpen(true)
                }
              >
                {isRunning ? "Stop" : "Start"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsKillAllModalOpen(true)}>
                <XIcon className="mr-2 h-4 w-4" />
                Kill All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={isStartModalOpen} onOpenChange={setIsStartModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Start dfx</DialogTitle>
            <DialogDescription>
              Configure and start the dfx network
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(70vh-130px)] overflow-y-auto">
            <div className="grid gap-4 mt-4">
              <div className="grid grid-cols-3 gap-4 mb-2">
                {DFX_START_OPTIONS.filter(
                  (option) => option.type === "checkbox"
                ).map((option) => (
                  <div
                    key={option.name}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={option.name}
                      checked={
                        option.name === "background" ||
                        option.name === "clean" ||
                        (dfxStartOptions[option.name] as boolean) ||
                        false
                      }
                      onCheckedChange={(checked) =>
                        handleStartOptionChange(option.name, checked)
                      }
                      disabled={
                        option.name === "background" || option.name === "clean"
                      }
                    />
                    <Label htmlFor={option.name}>--{option.name}</Label>
                  </div>
                ))}
              </div>
              {DFX_START_OPTIONS.filter(
                (option) => option.type !== "checkbox"
              ).map((option) => (
                <div key={option.name} className="space-y-2">
                  <Label htmlFor={option.name}>--{option.name}</Label>
                  {option.type === "multiInput" ? (
                    <Input
                      id={option.name}
                      placeholder={option.placeholder}
                      value={(
                        (dfxStartOptions[option.name] as string[]) || []
                      ).join(", ")}
                      onChange={(e) =>
                        handleStartOptionChange(
                          option.name,
                          e.target.value.split(", ")
                        )
                      }
                    />
                  ) : (
                    <Input
                      id={option.name}
                      placeholder={option.placeholder}
                      value={(dfxStartOptions[option.name] as string) || ""}
                      onChange={(e) =>
                        handleStartOptionChange(option.name, e.target.value)
                      }
                    />
                  )}
                </div>
              ))}
            </div>
            <ScrollBar />
          </ScrollArea>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStartModalOpen(false)}
              disabled={isLoading}
            >
              Close
            </Button>
            <Button onClick={handleStartDfx} disabled={isLoading || isRunning}>
              {isLoading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
              Start
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isStopModalOpen} onOpenChange={setIsStopModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stop</DialogTitle>
            <DialogDescription>
              Are you sure you want to stop the dfx network?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStopModalOpen(false)}
              disabled={isLoading}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={handleStopDfx}
              disabled={isLoading || !isRunning}
            >
              {isLoading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
              Stop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isKillAllModalOpen} onOpenChange={setIsKillAllModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-2">Kill All DFX Processes</DialogTitle>
            <DialogDescription>
              This forcibly kill every DFX-related process. This may impact IDE
              plugins, including from other versions of DFX. For ordinary usage
              `dfx stop` should be preferred. Are you sure you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsKillAllModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={killAllDfx}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
