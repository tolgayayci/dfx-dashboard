import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { Button } from "@components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { AlertCircle, ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";

const ReactJson = dynamic(() => import("react-json-view"), {
  ssr: false,
});

export default function CanisterStatusConfig({
  canister,
  projectPath,
  commandOutput,
  commandError,
}: {
  canister: any;
  projectPath: string;
  commandOutput: string;
  commandError: string;
}) {
  const [canisterStatus, setCanisterStatus] = useState<any>(null);
  const [accordionValue, setAccordionValue] = useState<string>("status");

  useEffect(() => {
    checkCanisterStatus();

    // Set the accordion to open the last item if there is command output or an error
    if (commandOutput || commandError) {
      setAccordionValue("output");
    } else {
      setAccordionValue("status");
    }
  }, [commandOutput, commandError]);

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
      console.log("Parsed result:", parsedResult);

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

      // Comparing the active identity principal with the canister controllers
      if (controllers.includes(identityResult)) {
        console.log("Active Identity is controller of the canister.");
        setCanisterStatus({
          ...parsedResult,
          isActiveIdentityController: true,
        });
      } else {
        console.log("Active Identity is not controller of the canister.");
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
    <ScrollArea className="h-[calc(100vh-200px)] overflow-y-auto">
      <Accordion
        type="single"
        value={accordionValue}
        onValueChange={setAccordionValue}
        collapsible
        className="w-full space-y-4"
      >
        <AccordionItem value="status" className="border px-3 rounded-lg">
          <AccordionTrigger className="text-sm">
            Canister Status
          </AccordionTrigger>
          <AccordionContent>
            {canisterStatus ? (
              <div>
                {canisterStatus.isActiveIdentityController ? (
                  <Alert variant="success" className="mb-4">
                    <ThumbsUpIcon className="h-4 w-4 text-green-600" />
                    <AlertTitle>Canister Status</AlertTitle>
                    <AlertDescription>
                      Active Identity is controller of the canister.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="mb-4">
                    <ThumbsDownIcon className="h-4 w-4 text-red-600" />
                    <AlertTitle>Canister Status</AlertTitle>
                    <AlertDescription>
                      Active Identity is not controller of the canister.
                    </AlertDescription>
                  </Alert>
                )}
                <ReactJson
                  name={canister.name + "_status"}
                  src={canisterStatus}
                />
              </div>
            ) : (
              <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Canister status cannot be displayed, check that the canister
                  is active or created with "dfx canister create" and refresh
                  the page.
                </AlertDescription>
              </Alert>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="config" className="border px-3 rounded-lg">
          <AccordionTrigger className="text-sm">
            Canister Config
          </AccordionTrigger>
          <AccordionContent>
            <ReactJson name={canister.name} src={canister} />

            <Link
              href={{
                pathname: `/projects/${encodeURIComponent(projectPath)}`,
                query: { tab: "dfx" },
              }}
            >
              <Button className="w-full mt-4">Edit Canister Config</Button>
            </Link>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="output" className="border px-3 rounded-lg">
          <AccordionTrigger className="text-sm">
            Canister Output
          </AccordionTrigger>
          <AccordionContent>
            <div>
              {commandOutput && (
                <Alert variant="success">
                  <ThumbsUpIcon className="h-4 w-4 text-green-600" />
                  <AlertTitle>Command Output</AlertTitle>
                  <AlertDescription>{commandOutput}</AlertDescription>
                </Alert>
              )}
              {commandError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{commandError}</AlertDescription>
                </Alert>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <ScrollBar />
    </ScrollArea>
  );
}
