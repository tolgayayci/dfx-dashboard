import useCanister from "renderer/hooks/useCanister";
import { useState, useEffect } from "react";
import Link from "next/link";

import CliCommandSelector from "@components/canisters/command-selector";
import CanisterStatusConfig from "@components/canisters/canister-status-config";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";

import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function CanisterDetail({
  projectPath,
  canisterName,
}: {
  projectPath: string;
  canisterName: string;
}) {
  const [showDialog, setShowDialog] = useState(false);
  const [commandOutput, setCommandOutput] = useState();
  const [commandError, setCommandError] = useState();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { canisterData, isLoading, error } = useCanister(
    projectPath,
    canisterName
  );

  if (isLoading && !canisterData) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>There was an error: {error.message}</div>;
  }

  const handleRemoveClick = async () => {
    try {
      await window.awesomeApi
        .runDfxCommand("canister", "stop", [canisterName], [], projectPath)
        .then(async () => {
          await removeCanister();
        })
        .catch((err) => {
          let errorMessage = "Failed to stop canister: ";
          if (err.message) {
            errorMessage += err.message;
          } else {
            // Stringify the error object or parts of it
            errorMessage += JSON.stringify(err, null, 2); // Pretty print the error
          }
          setErrorMessage(errorMessage);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const removeCanister = async () => {
    try {
      await window.awesomeApi
        .runDfxCommand("canister", "delete", [canisterName], [], projectPath)
        .then((data) => {
          setSuccessMessage("Canister deleted successfully:" + data);
        })
        .catch((err) => {
          let errorMessage = "Failed to delete canister: ";
          if (err.message) {
            errorMessage += err.message;
          } else {
            // Stringify the error object or parts of it
            errorMessage += JSON.stringify(err, null, 2); // Pretty print the error
          }
          setErrorMessage(errorMessage);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const resetStatus = () => {
    setShowDialog(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  if (canisterData && canisterData.name) {
    return (
      <>
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between space-y-2 mb-4">
            <h2 className="font-bold">{canisterName}</h2>
            <div className="space-x-2">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDialog(true)}
              >
                Remove Canister
              </Button>
              <Link href={`/projects/${encodeURIComponent(projectPath)}`}>
                <Button>View Project</Button>
              </Link>
            </div>
          </div>
          <Separator className="w-full mb-4 -mx-4" />
          <div className="flex flex-row w-full">
            <div className="w-3/5 pr-4">
              <CliCommandSelector
                canister={canisterData}
                path={projectPath}
                setCommandError={setCommandError}
                setCommandOutput={setCommandOutput}
              />
            </div>

            <div className="w-2/5">
              <CanisterStatusConfig
                canister={canisterData}
                projectPath={projectPath}
                commandError={commandError}
                commandOutput={commandOutput}
              />
            </div>
          </div>
          {showDialog && (
            <Dialog open={showDialog} onOpenChange={() => resetStatus()}>
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
