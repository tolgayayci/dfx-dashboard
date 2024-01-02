"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";

import { Switch } from "@components/ui/switch";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Loader2 } from "lucide-react";

import { useToast } from "@components/ui/use-toast";
import {
  projectCreateSuccess,
  projectCreateError,
  projectImportSuccess,
  projectImportError,
} from "@lib/notifications";
import { SelectSeparator } from "@components/ui/select";

export default function CanisterModal({
  showCanisterDialog,
  setShowCanisterDialog,
  canisterData,
}) {
  const { toast } = useToast();

  const JsonDisplay = ({ jsonData, indentLevel = 0 }) => {
    // Function to render JSON key-value pairs
    const renderJson = (data, indent) => {
      if (typeof data !== "object" || data === null) {
        return <span>{JSON.stringify(data)}</span>;
      }

      return Object.keys(data).map((key) => {
        const value = data[key];
        const isObjectOrArray = typeof value === "object" && value !== null;
        return (
          <div key={key} style={{ marginLeft: `${indent * 20}px` }}>
            <strong>{key}:</strong>{" "}
            {isObjectOrArray ? null : JSON.stringify(value)}
            {isObjectOrArray && (
              <div style={{ marginLeft: "20px" }}>
                {renderJson(value, indent + 1)}
              </div>
            )}
          </div>
        );
      });
    };

    return (
      <div className="json-display">{renderJson(jsonData, indentLevel)}</div>
    );
  };

  return (
    <Dialog open={showCanisterDialog}>
      <DialogContent>
        <DialogTitle>{canisterData.name}</DialogTitle>{" "}
        <DialogDescription>
          Review the details of the canister and call the canister's methods.
        </DialogDescription>
        <SelectSeparator />
        <JsonDisplay jsonData={canisterData} />
      </DialogContent>
    </Dialog>
  );
}
