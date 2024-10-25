"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import { UserCircle } from "lucide-react";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@components/ui/command";
import { Dialog, DialogTrigger } from "@components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";

import IdentityModal from "@components/identities/identity-modal";

type Team = {
  label: string;
  value: string;
  isInternetIdentity?: boolean;
  isActive?: boolean;
};

type Group = {
  label: string;
  teams: Team[];
};

const initialGroups: Group[] = [
  {
    label: "Identities",
    teams: [],
  },
];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {}

export default function IdentitySwitcher({ className }: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedIdentity, setSelectedIdentity] = React.useState<Team>({
    label: "",
    value: "",
  });
  const [updatedGroups, setUpdatedGroups] = useState<Group[]>(initialGroups);

  const router = useRouter();

  async function checkCurrentIdentity() {
    try {
      const identities = await window.awesomeApi.manageIdentities("list");
      const activeIdentity = identities.find((i) => i.isActive);
      if (activeIdentity) {
        setSelectedIdentity({
          label: activeIdentity.name,
          value: activeIdentity.name,
          isInternetIdentity: activeIdentity.isInternetIdentity,
          isActive: true,
        });
      } else {
        // If no active identity in store, check with dfx
        const result = await window.awesomeApi.runDfxCommand(
          "identity",
          "whoami"
        );
        setSelectedIdentity({
          label: result,
          value: result,
          isInternetIdentity: false,
          isActive: true,
        });
      }
    } catch (error) {
      console.log("Error checking current identity:", error);
    }
  }

  async function checkIdentities() {
    try {
      const identities = await window.awesomeApi.manageIdentities("list");

      const newGroups = [
        {
          label: "Identities",
          teams: identities.map((identity) => ({
            label: identity.name,
            value: identity.name,
            isInternetIdentity: identity.isInternetIdentity || false,
            isActive: identity.isActive || false,
          })),
        },
      ];

      setUpdatedGroups(newGroups);
    } catch (error) {
      console.log("Error fetching identities:", error);
    }
  }

  async function changeIdentity(
    newIdentity: string,
    isInternetIdentity: boolean
  ) {
    try {
      await window.awesomeApi.manageIdentities("select", { name: newIdentity });

      if (isInternetIdentity) {
        // For Internet Identity, we don't need to run dfx command
        await window.awesomeApi.manageIdentities(
          "update",
          { name: newIdentity },
          {
            isInternetIdentity: true,
            isActive: true,
          }
        );
      } else {
        // For regular identity, run dfx command
        await window.awesomeApi.runDfxCommand("identity", "use", [newIdentity]);
      }

      setSelectedIdentity({
        label: newIdentity,
        value: newIdentity,
        isInternetIdentity: isInternetIdentity,
        isActive: true,
      });

      await checkIdentities();

      if (router.pathname === "/identities") {
        await window.awesomeApi.reloadApplication();
      }
    } catch (error) {
      console.log("Error changing identity:", error);
    }
  }

  useEffect(() => {
    checkCurrentIdentity();
    checkIdentities();
  }, []);

  return (
    <Dialog
      open={showNewTeamDialog}
      onOpenChange={() => setShowNewTeamDialog(false)}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select an identity"
            className={cn("w-[150px] justify-between", className)}
          >
            <div className="flex items-center">
              <UserCircle className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate flex-grow text-left">
                {selectedIdentity.label || "No Identity"}
              </span>
            </div>
            <CaretSortIcon className="ml-2 h-4 w-4 flex-shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search identity..." />
              <CommandEmpty>No identity found.</CommandEmpty>
              <CommandGroup heading="Active Identity">
                <CommandItem key={selectedIdentity.value} className="text-sm">
                  <div className="flex items-center w-full">
                    <UserCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="flex-grow truncate">
                      {selectedIdentity.label}
                      {selectedIdentity.isInternetIdentity &&
                        " (Internet Identity)"}
                    </span>
                    <CheckIcon className="ml-2 h-4 w-4 flex-shrink-0" />
                  </div>
                </CommandItem>
              </CommandGroup>
              <CommandGroup heading="Identities">
                {updatedGroups[0].teams.map((team) => (
                  <CommandItem
                    key={team.value}
                    onSelect={() => {
                      if (selectedIdentity.value !== team.value) {
                        changeIdentity(
                          team.value,
                          team.isInternetIdentity || false
                        );
                      }
                      setOpen(false);
                    }}
                    className="text-sm"
                  >
                    <div className="flex items-center w-full">
                      <UserCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="flex-grow truncate">
                        {team.label}
                        {team.isInternetIdentity && " (Internet Identity)"}
                      </span>
                      <CheckIcon
                        className={cn(
                          "ml-2 h-4 w-4 flex-shrink-0",
                          selectedIdentity.value === team.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Identity
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    router.push("/identities");
                  }}
                >
                  <UpdateIcon className="mr-2 h-5 w-5" />
                  Edit Identities
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <IdentityModal
        showCreateIdentityDialog={showNewTeamDialog}
        setShowCreateIdentityDialog={setShowNewTeamDialog}
      />
    </Dialog>
  );
}
