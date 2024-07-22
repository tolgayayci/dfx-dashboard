import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import useCanister from "renderer/hooks/useCanister";

import CliCommandSelector from "@components/canisters/command-selector";
import CommandOutput from "@components/canisters/command-output";
import CanisterStatus from "@components/canisters/canister-status";
import CanisterConfig from "@components/canisters/canister-config";

import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import { Avatar, AvatarImage } from "@components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";
import { useToast } from "@components/ui/use-toast";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";

import {
  FileBoxIcon,
  AlertCircle,
  TrashIcon,
  InfoIcon,
  SettingsIcon,
} from "lucide-react";

export default function CanisterDetail({
  projectPath,
  canisterName,
}: {
  projectPath: string;
  canisterName: string;
}) {
  const [commandOutput, setCommandOutput] = useState();
  const [commandError, setCommandError] = useState();
  const [latestCommand, setLatestCommand] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [initialCommand, setInitialCommand] = useState("");

  const router = useRouter();

  const { toast } = useToast();

  const { canisterData } = useCanister(projectPath, canisterName);

  useEffect(() => {
    if (commandOutput && !commandError) {
      toast({
        title: "Command Executed Successfully",
        description: (
          <div>
            <pre className="bg-gray-100 text-black p-1 px-2 rounded-md mt-1">
              {latestCommand}
            </pre>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="mt-2"
            >
              View Output
            </Button>
          </div>
        ),
        variant: "default",
        className: "border-green-500",
      });
    } else if (commandError) {
      toast({
        title: "Command Execution Failed",
        description: (
          <div>
            <pre className="bg-gray-100 text-black p-1 px-2 rounded-md mt-1">
              {latestCommand}
            </pre>
            <Button
              variant="default"
              onClick={() => setIsModalOpen(true)}
              className="mt-2"
            >
              View Output
            </Button>
          </div>
        ),
        variant: "default",
        className: "border-red-500",
      });
    }
  }, [commandOutput, commandError, toast]);

  const handleRemoveClick = async () => {
    try {
      // First, try to stop the canister
      await window.awesomeApi.runDfxCommand(
        "canister",
        "stop",
        [canisterName],
        [],
        projectPath as string
      );
    } catch (err) {
      let errorMessage = "Failed to process canister: ";
      errorMessage += err.message || JSON.stringify(err, null, 2);
      setErrorMessage(errorMessage);
    }
  };

  const removeCanister = async () => {
    try {
      const data = await window.awesomeApi.runDfxCommand(
        "canister",
        "delete",
        [canisterName],
        [],
        projectPath as string
      );
      setSuccessMessage("Canister deleted successfully: " + data);
    } catch (err) {
      let errorMessage = "Failed to delete canister: ";
      errorMessage += err.message || JSON.stringify(err, null, 2);
      setErrorMessage(errorMessage);
    }
  };

  const resetStatus = () => {
    setShowRemoveDialog(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  if (canisterData) {
    return (
      <>
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between space-y-2 mb-4">
            <div className="flex items-center">
              <Avatar className="mr-4 h-10 w-10">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${canisterData.name}.png`}
                  alt={canisterData.name}
                />
              </Avatar>
              <h2 className="font-bold">{canisterData.name}</h2>
            </div>
            <div className="space-x-2 flex items-center">
              {(commandOutput || commandError) && (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
                          {latestCommand}
                        </pre>
                      </DialogDescription>
                    </DialogHeader>
                    <CommandOutput
                      commandOutput={commandOutput}
                      commandError={commandError}
                    />
                  </DialogContent>
                </Dialog>
              )}

              <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <InfoIcon className="w-5 h-5 mr-2" />
                    Status
                  </Button>
                </DialogTrigger>
                <DialogContent className="min-w-[calc(70vw-106px)]">
                  <DialogHeader>
                    <DialogTitle>Canister Status</DialogTitle>
                  </DialogHeader>
                  <CanisterStatus
                    canister={canisterData}
                    projectPath={projectPath}
                  />
                </DialogContent>
              </Dialog>
              <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <SettingsIcon className="w-5 h-5 mr-2" />
                    Config
                  </Button>
                </DialogTrigger>
                <DialogContent className="min-w-[calc(70vw-106px)]">
                  <DialogHeader>
                    <DialogTitle>Canister Configuration</DialogTitle>
                  </DialogHeader>
                  <CanisterConfig
                    canister={canisterData}
                    projectPath={projectPath}
                  />
                </DialogContent>
              </Dialog>
              <Button
                type="button"
                variant="default"
                onClick={() => setShowRemoveDialog(true)}
              >
                <TrashIcon className="w-5 h-5 mr-2" />
                Remove
              </Button>
              {/* <Link
                href={`/projects/${encodeURIComponent(projectPath as string)}`}
              >
                <Button>View Project</Button>
              </Link> */}
            </div>
          </div>
          <Separator className="w-full mb-4 -mx-4" />
          <div className="flex flex-col w-full h-screen">
            <div className="flex-grow overflow-hidden">
              <CliCommandSelector
                canister={canisterData}
                path={projectPath as string}
                initialCommand={initialCommand}
                latestCommand={latestCommand}
                setCommandError={setCommandError}
                setCommandOutput={setCommandOutput}
                setLatestCommand={setLatestCommand}
              />
            </div>
          </div>
          {showRemoveDialog && (
            <Dialog open={showRemoveDialog} onOpenChange={() => resetStatus()}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="mb-2">
                    Are you absolutely sure?
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your canister!
                    {errorMessage && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Warning</AlertTitle>
                        <ScrollArea className="max-h-[300px] overflow-y-auto">
                          <AlertDescription>{errorMessage}</AlertDescription>
                          <ScrollBar />
                        </ScrollArea>
                      </Alert>
                    )}
                    {successMessage && (
                      <Alert variant="default" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Canister Removed Successfully!</AlertTitle>
                        <ScrollArea className="max-h-[300px] overflow-y-auto">
                          <AlertDescription>{successMessage}</AlertDescription>
                          <ScrollBar />
                        </ScrollArea>
                      </Alert>
                    )}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2 mt-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => resetStatus()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleRemoveClick()}
                  >
                    Remove
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </>
    );
  } else {
    return <div>Canister not found or name is undefined.</div>;
  }
}
