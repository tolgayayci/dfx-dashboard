import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { AlertCircle, ThumbsUpIcon, Loader2, InfoIcon } from "lucide-react";

const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

interface CanisterStatusType {
  Controllers?: string;
  Status?: string;
  "Memory allocation"?: string;
  "Memory size"?: string;
  Balance?: string;
  "Freezing threshold"?: string;
  "Cycles limit"?: string;
  Cycles?: string;
  "Module hash"?: string;
  isActiveIdentityController?: boolean;
  activeIdentity?: string;
  [key: string]: string | boolean | undefined;
}

export default function StatusModal({
  canister,
  projectPath,
}: {
  canister: any;
  projectPath: string;
}) {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [canisterStatus, setCanisterStatus] =
    useState<CanisterStatusType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function parseCliOutput(output: string): CanisterStatusType {
    const result: CanisterStatusType = {};
    const lines = output.split("\n");

    lines.forEach((line) => {
      const [key, ...valueParts] = line.split(":");
      if (key && valueParts.length) {
        result[key.trim()] = valueParts.join(":").trim();
      }
    });

    return result;
  }

  async function checkCanisterStatus() {
    setIsLoading(true);
    setError(null);
    try {
      const statusResult = await window.awesomeApi.runDfxCommand(
        "canister",
        "status",
        [canister.name],
        [],
        projectPath
      );

      const parsedResult = parseCliOutput(statusResult);

      const identityPrincipal = await window.awesomeApi.runDfxCommand(
        "identity",
        "get-principal"
      );

      const activeIdentity = await window.awesomeApi.runDfxCommand(
        "identity",
        "whoami"
      );

      const controllersString = parsedResult?.Controllers;
      if (!controllersString) {
        throw new Error("Controllers not found in canister status");
      }

      const controllersArray = controllersString.split(/\s+/);
      const isActiveIdentityController = controllersArray.includes(
        identityPrincipal.trim()
      );

      setCanisterStatus({
        ...parsedResult,
        isActiveIdentityController,
        activeIdentity: activeIdentity.trim(),
      });
    } catch (error) {
      console.error("Error checking canister status:", error);
      if (error.message.includes("Only controllers of canister")) {
        setError(
          "Current identity is not a controller. Please change your identity."
        );
      } else {
        setError(`Error checking canister status: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (showStatusModal) {
      checkCanisterStatus();
    }
  }, [showStatusModal, canister, projectPath]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="h-full">
          <div className="border border-gray-200 rounded-lg p-8 w-full h-full flex justify-center items-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="h-full">
          <div className="border border-red-200 bg-red-50 rounded-lg p-4 w-full h-full flex justify-center items-center">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        </div>
      );
    }

    return (
      <ScrollArea className="h-[calc(75vh-20px)] overflow-y-auto">
        <div className="space-y-4">
          <div
            className={`p-3 rounded-lg ${
              canisterStatus?.isActiveIdentityController
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            <div className="flex items-center text-sm">
              {canisterStatus?.isActiveIdentityController ? (
                <ThumbsUpIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              )}
              <p className="font-medium">
                {canisterStatus?.isActiveIdentityController
                  ? `Active Identity (${canisterStatus.activeIdentity}) is controller`
                  : "Active Identity is not controller"}
              </p>
            </div>
          </div>
          {canisterStatus && (
            <ReactJson
              src={canisterStatus}
              name={canister.name}
              collapsed={false}
              displayDataTypes={false}
              displayObjectSize={false}
              enableClipboard={false}
              style={{
                backgroundColor: "transparent",
                fontSize: "0.9rem",
              }}
            />
          )}
        </div>
        <ScrollBar />
      </ScrollArea>
    );
  };

  return (
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
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
