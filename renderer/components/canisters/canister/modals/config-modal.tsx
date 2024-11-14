import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { SettingsIcon } from "lucide-react";

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
  [key: string]: string | boolean | undefined;
}

interface CanisterType {
  name: string;
  [key: string]: any;
}

export default function ConfigModal({
  canister,
  projectPath,
}: {
  canister: CanisterType;
  projectPath: string;
}) {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [canisterStatus, setCanisterStatus] =
    useState<CanisterStatusType | null>(null);

  function parseCliOutput(output: string): CanisterStatusType {
    const result: CanisterStatusType = {};
    const parts = output.replace(/\s+/g, " ").trim().split(" ");
    let currentKey = "";
    let currentValue = "";
    parts.forEach((part) => {
      if (part.endsWith(":")) {
        if (currentKey && currentValue) {
          result[currentKey] = currentValue.trim();
        }
        currentKey = part.slice(0, -1);
        currentValue = "";
      } else {
        currentValue += part + " ";
      }
    });
    if (currentKey && currentValue) {
      result[currentKey] = currentValue.trim();
    }
    return result;
  }

  async function checkCanisterStatus() {
    try {
      const statusResult = await window.awesomeApi.runDfxCommand(
        "canister",
        "status",
        [canister.name],
        [],
        projectPath
      );
      const parsedResult = parseCliOutput(statusResult);
      const identityResult = await window.awesomeApi.runDfxCommand(
        "identity",
        "get-principal"
      );
      const controllersString = parsedResult.Controllers;
      if (controllersString) {
        const controllersArray = controllersString.split(" ");
        controllersArray.pop();
        const controllers = controllersArray.join(" ");
        setCanisterStatus({
          ...parsedResult,
          isActiveIdentityController: controllers.includes(identityResult),
        });
      } else {
        console.error("Controllers not found in canister status");
      }
    } catch (error) {
      console.error("Error invoking remote method:", error);
    }
  }

  const handleOpenChange = (open: boolean) => {
    setShowConfigModal(open);
    if (open) {
      checkCanisterStatus();
    }
  };

  return (
    <Dialog open={showConfigModal} onOpenChange={handleOpenChange}>
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
        <ScrollArea className="overflow-y-auto">
          <div>
            <ReactJson
              src={canister}
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
            <Link
              href={{
                pathname: `/projects/${encodeURIComponent(projectPath)}`,
                query: { tab: "dfx" },
              }}
            >
              <Button className="w-full mt-4">Edit Canister Config</Button>
            </Link>
          </div>
          <ScrollBar />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
