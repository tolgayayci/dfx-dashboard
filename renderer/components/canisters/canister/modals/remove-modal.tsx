import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { AlertCircle, TrashIcon } from "lucide-react";

interface RemoveCanisterModalProps {
  canisterName: string;
  projectPath: string;
}

export default function RemoveModal({
  canisterName,
  projectPath,
}: RemoveCanisterModalProps) {
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRemoveClick = async () => {
    try {
      // First, try to stop the canister
      await window.awesomeApi.runDfxCommand(
        "canister",
        "stop",
        [canisterName],
        [],
        projectPath
      );

      await removeCanister();
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
        projectPath
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

  return (
    <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
      <DialogTrigger asChild>
        <Button type="button" variant="default">
          <TrashIcon className="w-5 h-5 mr-2" />
          Remove
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            canister!
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
          <Button variant="outline" type="button" onClick={resetStatus}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleRemoveClick}
          >
            Remove
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
