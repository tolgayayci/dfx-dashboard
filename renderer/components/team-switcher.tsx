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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Checkbox } from "./ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  importIdentityFormSchema,
  onimportIdentityFormSubmit,
} from "@components/identities/forms/importNewIdentity";

import {
  onNewIdentityFormSubmit,
  newIdentityFormSchema,
} from "@components/identities/forms/createNewIdentity";

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

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedIdentity, setSelectedIdentity] = React.useState<Team>(
    initialGroups[0].teams[0]
  );
  const [updatedGroups, setUpdatedGroups] = useState(initialGroups);

  const router = useRouter();

  const newIdentityForm = useForm<z.infer<typeof newIdentityFormSchema>>({
    resolver: zodResolver(newIdentityFormSchema),
  });

  const importIdentityForm = useForm<z.infer<typeof importIdentityFormSchema>>({
    resolver: zodResolver(importIdentityFormSchema),
  });

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
    } catch (error) {
      console.error("Error invoking remote method:", error);
    }
  }

  async function checkIdentities() {
    try {
      const result = await window.awesomeApi.runDfxCommand("identity", "list");

      // Split the input string into an array of identities
      const identities = result
        .split("\n")
        .filter((identity) => identity.trim() !== "");

      // Find the "Identities" group and update its "teams" property
      const newGroups = updatedGroups.map((group) => {
        if (group.label === "Identities") {
          return {
            ...group,
            teams: identities.map((identity) => ({
              label: identity,
              value: identity,
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
      const identity = await window.awesomeApi.runDfxCommand(
        "identity",
        "use",
        [newIdentity]
      );
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
      <DialogContent>
        <Tabs defaultValue="new-identity">
          <TabsList className="mb-4">
            <TabsTrigger value="new-identity">New Identity</TabsTrigger>
            <TabsTrigger value="import">Import Existing</TabsTrigger>
          </TabsList>
          <TabsContent value="new-identity">
            <Form {...newIdentityForm}>
              <form
                onSubmit={newIdentityForm.handleSubmit(onNewIdentityFormSubmit)}
              >
                <DialogHeader className="space-y-3">
                  <DialogTitle>Create New Identity</DialogTitle>
                  <DialogDescription>
                    Identities you will add are global. They are not confined to
                    a specific project context.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <div className="py-4 pb-6">
                    <div className="space-y-3">
                      <FormField
                        control={newIdentityForm.control}
                        name="identity_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-small">
                              Identity Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id="identity_name"
                                placeholder="alice"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Options</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div className="space-y-3">
                              <FormField
                                control={newIdentityForm.control}
                                name="hsm_key_id"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-small">
                                      HSM Key Id (Optional)
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        id="hsm_key_id"
                                        placeholder="xxxx"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="space-y-3">
                              <FormField
                                control={newIdentityForm.control}
                                name="hsm_pkcs11_lib_path"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-small">
                                      opensc-pkcs11 Lib Path (Optional)
                                    </FormLabel>
                                    <FormControl>
                                      <div className="flex w-full items-center space-x-2">
                                        <Input
                                          type="text"
                                          readOnly
                                          value={field.value}
                                        />
                                        <Button
                                          onClick={() => {
                                            getDirectoryPath().then((path) => {
                                              if (path) {
                                                field.onChange(path);
                                              }
                                            });
                                          }}
                                        >
                                          Select
                                        </Button>
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="space-y-3">
                              <FormField
                                control={newIdentityForm.control}
                                name="storage_mode"
                                render={({ field }) => (
                                  <FormItem className="space-y-3">
                                    <FormLabel>
                                      Storage Mode (Optional)
                                    </FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a storage mode" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="password-protected">
                                          Password Protected
                                        </SelectItem>
                                        <SelectItem value="plain-text">
                                          Plain Text
                                        </SelectItem>
                                        <SelectItem value="null">
                                          No Storage Mode
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormDescription>
                                      Plaintext PEM files are still available
                                      (e.g. for use in non-interactive
                                      situations like CI), but not recommended
                                      for use since they put the keys at risk.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="space-y-3">
                              <FormField
                                control={newIdentityForm.control}
                                name="force"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>Force</FormLabel>
                                      <FormDescription>
                                        If the identity already exists, remove
                                        and re-import it.
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewTeamDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="import">
            <Form {...importIdentityForm}>
              <form
                onSubmit={importIdentityForm.handleSubmit(
                  onimportIdentityFormSubmit
                )}
              >
                <DialogHeader className="space-y-3">
                  <DialogTitle>Import Identity</DialogTitle>
                  <DialogDescription>
                    Create a user identity by importing the user’s key
                    information or security certificate from a PEM file.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <div className="space-y-4 py-4 pb-6">
                    <div className="space-y-3">
                      <FormField
                        control={newIdentityForm.control}
                        name="identity_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-small">
                              Identity Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id="identity_name"
                                placeholder="alice"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-3">
                      <FormField
                        control={importIdentityForm.control}
                        name="pem_identity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-small">
                              Pem File
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id="pem_identity"
                                type="file"
                                placeholder="alice"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Options</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div className="space-y-3">
                              <FormField
                                control={importIdentityForm.control}
                                name="storage_mode"
                                render={({ field }) => (
                                  <FormItem className="space-y-3">
                                    <FormLabel>
                                      Storage Mode (Optional)
                                    </FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a storage mode" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="password-protected">
                                          Password Protected
                                        </SelectItem>
                                        <SelectItem value="plain-text">
                                          Plain Text
                                        </SelectItem>
                                        <SelectItem value="null">
                                          No Storage Mode
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormDescription>
                                      Plaintext PEM files are still available
                                      (e.g. for use in non-interactive
                                      situations like CI), but not recommended
                                      for use since they put the keys at risk.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="space-y-3">
                              <FormField
                                control={importIdentityForm.control}
                                name="force"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>Force</FormLabel>
                                      <FormDescription>
                                        If the identity already exists, remove
                                        and re-import it.
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewTeamDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" onClick={checkCurrentIdentity}>
                    Import
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
