"use client";

import * as React from "react";
import { Button } from "@components/ui/button";
import { Icons } from "@components/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { useToast } from "@components/ui/use-toast";

export function KillAll() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { toast } = useToast();

  async function killAllDfx() {
    try {
      const result = await window.awesomeApi.runDfxCommand("killall");
      toast({
        title: "DFX Processes Killed",
        description: result || "All DFX processes have been terminated.",
        duration: 2000,
      });

      await window.awesomeApi.reloadApplication();
    } catch (error) {
      console.error(`Error: ${error}`);
      toast({
        title: "Error",
        description: "Failed to kill DFX processes. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setDialogOpen(false);
    }
  }

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={killAllDfx}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
