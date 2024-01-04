"use client";
import ReactJson from "react-json-view";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@components/ui/dialog";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";

import { SelectSeparator } from "@components/ui/select";

import CliCommandSelector from "@components/canisters/command-selector";

export default function CanisterModal({
  showCanisterDialog,
  setShowCanisterDialog,
  canisterData,
}) {
  return (
    <Dialog open={showCanisterDialog}>
      <DialogContent>
        <DialogTitle>{canisterData.name}</DialogTitle>{" "}
        <DialogDescription>
          Review the details of the canister and call the canister's methods.
        </DialogDescription>
        <SelectSeparator />
        <CliCommandSelector canister={canisterData} />
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="config" className="border px-3 rounded-lg">
            <AccordionTrigger className="text-sm">
              Show Canister Config
            </AccordionTrigger>
            <AccordionContent>
              {/* <ReactJson name={canisterData.name} src={canisterData} /> */}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}
