import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { Button } from "@components/ui/button";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";

import { AlertCircle, ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";

const ReactJson = dynamic(() => import("react-json-view"), {
  ssr: false,
});

export default function CanisterConfig({
  canister,
  projectPath,
}: {
  canister: any;
  projectPath: string;
}) {
  const [canisterStatus, setCanisterStatus] = useState<any>(null);

  function parseCliOutput(output) {
    const result = {};
    // Replace multiple spaces with a single space and then split the string into parts.
    const parts = output.replace(/\s+/g, " ").trim().split(" ");

    let currentKey = "";
    let currentValue = "";

    parts.forEach((part) => {
      if (part.endsWith(":")) {
        // If the current part ends with a colon, it's a key.
        if (currentKey && currentValue) {
          // Save the previous key-value pair.
          result[currentKey] = currentValue.trim();
        }
        // Start a new key-value pair.
        currentKey = part.slice(0, -1); // Remove the colon from the key.
        currentValue = "";
      } else {
        // Otherwise, it's part of the value.
        currentValue += part + " ";
      }
    });

    // Don't forget to add the last key-value pair.
    if (currentKey && currentValue) {
      result[currentKey] = currentValue.trim();
    }

    return result;
  }

  async function checkCanisterStatus() {
    try {
      // Fetching the status of the canister
      const statusResult = await window.awesomeApi.runDfxCommand(
        "canister",
        "status",
        [canister.name],
        [],
        projectPath
      );

      const parsedResult = parseCliOutput(statusResult);

      // Fetching the principal ID of the active identity
      const identityResult = await window.awesomeApi.runDfxCommand(
        "identity",
        "get-principal"
      );

      //@ts-ignore
      const controllersString = parsedResult?.Controllers;
      const controllersArray = controllersString.split(" ");
      controllersArray.pop(); // Remove the last word
      const controllers = controllersArray.join(" ");

      if (controllers.includes(identityResult)) {
        setCanisterStatus({
          ...parsedResult,
          isActiveIdentityController: true,
        });
      } else {
        setCanisterStatus({
          ...parsedResult,
          isActiveIdentityController: false,
        });
      }
    } catch (error) {
      console.log("Error invoking remote method:", error);
    }
  }

  useEffect(() => {
    checkCanisterStatus();
  }, []);

  return (
    <ScrollArea className=" overflow-y-auto">
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
  );
}
