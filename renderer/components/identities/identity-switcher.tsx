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
import { cn } from "@lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
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

const initialGroups = [
  {
    label: "Active Identity",
    teams: [
      {
        label: "",
        value: "",
      },
    ],
  },
  {
    label: "Identities",
    teams: [
      {
        label: "",
        value: "",
      },
    ],
  },
];

type Team = (typeof initialGroups)[number]["teams"][number];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {}

export default function IdentitySwitcher({ className }: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedIdentity, setSelectedIdentity] = React.useState<Team>(
    initialGroups[0].teams[0]
  );
  const [updatedGroups, setUpdatedGroups] = useState(initialGroups);

  const router = useRouter();

  async function getDirectoryPath() {
    try {
      const result = await window.awesomeApi.openDirectory();
      return result;
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  async function checkCurrentIdentity() {
    // Here we call the exposed method from preload.js
    try {
      const result = await window.awesomeApi.runDfxCommand(
        "identity",
        "whoami"
      );

      initialGroups[0].teams[0].label = result;
      initialGroups[0].teams[0].value = result;
      setSelectedIdentity({
        label: result,
        value: result,
      });

      console.log();
    } catch (error) {
      console.error("Error invoking remote method:", error);
    }
  }

  async function checkIdentities() {
    try {
      const identities = await window.awesomeApi.manageIdentities("list", "");

      // Find the "Identities" group and update its "teams" property
      const newGroups = updatedGroups.map((group) => {
        if (group.label === "Identities") {
          return {
            ...group,
            teams: identities.map((identity) => ({
              label: identity.name
                ? identity.name
                : identity.internetIdentityPrincipal.slice(0, 11),
              value: identity.name
                ? identity.name
                : identity.internetIdentityPrincipal.slice(0, 11),
            })),
          };
        }
        return group;
      });

      // Update the state variable with the new groups data
      setUpdatedGroups(newGroups);
    } catch (error) {
      console.error("Error invoking remote method:", error);
    }
  }

  async function changeIdentity(newIdentity: string) {
    try {
      await window.awesomeApi.runDfxCommand("identity", "use", [newIdentity]);
    } catch (error) {
      console.error("Error invoking remote method:", error);
    }
  }

  useEffect(() => {
    checkCurrentIdentity();
    checkIdentities();
  }, []);

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedIdentity.value}.png`}
                alt={selectedIdentity.label}
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {selectedIdentity.label}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No identity found.</CommandEmpty>
              {updatedGroups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.teams.map((team) => (
                    <CommandItem
                      key={team.value}
                      onSelect={() => {
                        if (selectedIdentity.value !== team.value) {
                          setSelectedIdentity(team);
                          changeIdentity(team.value);
                        }
                        setOpen(false);
                      }}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${team.value}.png`}
                          alt={team.label}
                          className="grayscale"
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      {team.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedIdentity.value === team.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
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
