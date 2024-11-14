import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

interface DfxVersionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dfxVersions: string[];
  selectedVersion: string;
  onVersionChange: (version: string) => void;
  onConfirm: () => void;
}

export function DfxVersionDialog({
  isOpen,
  onClose,
  dfxVersions,
  selectedVersion,
  onVersionChange,
  onConfirm,
}: DfxVersionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select DFX Version</DialogTitle>
        </DialogHeader>
        <Select onValueChange={onVersionChange} value={selectedVersion}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select DFX version" />
          </SelectTrigger>
          <SelectContent>
            {dfxVersions.map((version) => (
              <SelectItem key={version} value={version}>
                {version}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
