import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { Button } from "@components/ui/button";

const ReactJson = dynamic(() => import("react-json-view"), {
  ssr: false, // This will only import 'ReactJson' on the client-side
});

export default function CanisterStatusConfig({
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
    // Here we call the exposed method from preload.js
    try {
      const result = await window.awesomeApi.runDfxCommand(
        "canister",
        "status",
        [canister.name],
        [],
        projectPath
      );

      const parsedResult = parseCliOutput(result);
      setCanisterStatus(parsedResult);
    } catch (error) {
      console.error("Error invoking remote method:", error);
    }
  }

  useEffect(() => {
    checkCanisterStatus();
  }, []);

  return (
    <Accordion
      type="single"
      defaultValue="status"
      collapsible
      className="w-full space-y-4"
    >
      <AccordionItem value="status" className="border px-3 rounded-lg">
        <AccordionTrigger className="text-sm">Canister Status</AccordionTrigger>
        <AccordionContent>
          {canisterStatus ? (
            <ReactJson name={canister.name + "_status"} src={canisterStatus} />
          ) : (
            <h2>Loading...</h2>
          )}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="config" className="border px-3 rounded-lg">
        <AccordionTrigger className="text-sm">Canister Config</AccordionTrigger>
        <AccordionContent>
          <ReactJson name={canister.name} src={canister} />
          <Button className="mt-4 w-full">Edit Canister Config</Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
