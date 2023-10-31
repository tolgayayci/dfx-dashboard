"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Switch } from "@components/ui/switch";

import {
  createNewProjectFormSchema,
  onCreateNewProjectFormSchema,
} from "@components/projects/forms/createNewProject";

import {
  addExistingProjectFormSchema,
  onAddExistingProjectFormSchema,
} from "@components/projects/forms/addExistingProject";

type Project = {
  name: string;
  path: string;
};

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {}

export default function ProjectSwitcher({ className }: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const createNewProjectform = useForm<
    z.infer<typeof createNewProjectFormSchema>
  >({
    resolver: zodResolver(createNewProjectFormSchema),
    defaultValues: {
      frontend_status: true,
      dry_run: false,
    },
  });

  const addExistingProjectForm = useForm<
    z.infer<typeof addExistingProjectFormSchema>
  >({
    resolver: zodResolver(addExistingProjectFormSchema),
  });

  async function checkProjects() {
    try {
      const result = await window.awesomeApi.manageProjects("get");
      const projectsData = result.map((project) => ({
        name: project.name,
        path: project.path,
      }));
      setProjects(projectsData);

      // Automatically select the first project if there are any
      if (projectsData.length > 0) {
        setSelectedTeam(projectsData[0]);
      }
    } catch (error) {
      console.error("Error invoking remote method:", error);
    }
  }

  async function getDirectoryPath() {
    try {
      const result = await window.awesomeApi.openDirectory();
      return result;
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  const groups = [
    {
      label: "Selected Project",
      teams: selectedTeam ? [selectedTeam] : [],
    },
    {
      label: "Projects",
      teams: projects,
    },
  ];

  useEffect(() => {
    checkProjects();
  }, []);

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        {selectedTeam ? (
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
                  src={`https://avatar.vercel.sh/${selectedTeam.name}.png`}
                  alt={selectedTeam.name}
                />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              {selectedTeam.name}
              <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
        ) : null}
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No projects found</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.teams.map((team) => (
                    <CommandItem
                      key={team.name}
                      onSelect={() => {
                        setSelectedTeam(team);
                        setOpen(false);
                      }}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${team.name}.png`}
                          alt={team.name}
                          className="grayscale"
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      {team.name}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedTeam.path === team.path
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
                    Create New Project
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <Tabs defaultValue="create-project">
          <TabsList className="mb-4">
            <TabsTrigger value="create-project">New Project</TabsTrigger>
            <TabsTrigger value="import">Import Existing</TabsTrigger>
          </TabsList>
          <TabsContent value="create-project">
            <Form {...createNewProjectform}>
              <form
                onSubmit={createNewProjectform.handleSubmit(
                  onCreateNewProjectFormSchema
                )}
              >
                <DialogHeader>
                  <DialogTitle>Create Project</DialogTitle>
                  <DialogDescription>
                    Create a new project for the Internet Computer
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <div className="space-y-4 py-4 pb-4">
                    <div>
                      <FormField
                        control={createNewProjectform.control}
                        name="project_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-small">
                              Project Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="My Social Network"
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={createNewProjectform.control}
                        name="path"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-small">
                              Project Path
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
                    <div className="space-y-4">
                      <FormLabel className="text-small"> Options</FormLabel>
                      <FormField
                        control={createNewProjectform.control}
                        name="frontend_status"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Activate Frontend
                              </FormLabel>
                              <FormDescription className="mr-4">
                                Installs the template frontend code for the
                                default project canister.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createNewProjectform.control}
                        name="dry_run"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Dry Run
                              </FormLabel>
                              <FormDescription className="mr-4">
                                Generates a preview the directories and files to
                                be created for a new project without adding them
                                to the file system.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowNewTeamDialog(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Continue</Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="import">
            <Form {...addExistingProjectForm}>
              <form
                onSubmit={addExistingProjectForm.handleSubmit(
                  onAddExistingProjectFormSchema
                )}
              >
                <DialogHeader>
                  <DialogTitle>Import Existing Project</DialogTitle>
                  <DialogDescription>
                    Create a new project for the Internet Computer
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <div className="space-y-4 py-4 pb-4">
                    <div>
                      <FormField
                        control={addExistingProjectForm.control}
                        name="project_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-small">
                              Project Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="My Social Network"
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={addExistingProjectForm.control}
                        name="path"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-small">
                              Project Path
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
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowNewTeamDialog(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Continue</Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
