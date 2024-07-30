"use client";

import { useState } from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Switch } from "@components/ui/switch";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Checkbox } from "@components/ui/checkbox";
import { Loader2 } from "lucide-react";

import {
  createNewProjectFormSchema,
  onCreateNewProjectForm,
} from "@components/projects/forms/createNewProject";

import {
  addExistingProjectFormSchema,
  onAddExistingProjectForm,
} from "@components/projects/forms/addExistingProject";

import { useToast } from "@components/ui/use-toast";
import {
  projectCreateSuccess,
  projectCreateError,
  projectImportSuccess,
  projectImportError,
} from "@lib/notifications";

export default function ProjectModal({
  showNewProjectDialog,
  setShowNewProjectDialog,
  onProjectChange,
}) {
  const [isSubmittingNewProject, setIsSubmittingNewProject] = useState(false);
  const [isSubmittingExistingProject, setIsSubmittingExistingProject] =
    useState(false);

  const { toast } = useToast();

  const createNewProjectform = useForm<
    z.infer<typeof createNewProjectFormSchema>
  >({
    resolver: zodResolver(createNewProjectFormSchema),
    defaultValues: {
      project_name: "",
      path: "",
      frontend: "react",
      type: "motoko",
      dry_run: false,
      verbose: false,
      quiet: false,
      extras: [],
    },
  });

  const addExistingProjectForm = useForm<
    z.infer<typeof addExistingProjectFormSchema>
  >({
    resolver: zodResolver(addExistingProjectFormSchema),
  });

  // Modify your form submit handler to use setIsSubmitting
  const handleNewProjectFormSubmit = async (data) => {
    setIsSubmittingNewProject(true);
    try {
      await onCreateNewProjectForm(data).then(() => {
        toast(projectCreateSuccess(data.project_name));
        setShowNewProjectDialog(false);
        createNewProjectform.reset();
        onProjectChange();
      });
    } catch (error) {
      toast(projectCreateError(data.project_name, error));
      console.log(error);
    } finally {
      setIsSubmittingNewProject(false);
    }
  };

  const handleExistingProjectFormSubmit = async (data) => {
    setIsSubmittingExistingProject(true);
    try {
      const result = await window.awesomeApi.isDfxProject(data.path as string);

      if (result) {
        await onAddExistingProjectForm(data).then(async () => {
          toast(projectImportSuccess(data.project_name));
          setShowNewProjectDialog(false);
          addExistingProjectForm.reset();
          onProjectChange();
        });
      } else {
        toast(projectImportError(data.project_name));
        setShowNewProjectDialog(false);
        addExistingProjectForm.reset();
        onProjectChange();
      }
      // handle success
    } catch (error) {
      // handle error
      console.error(error);
    } finally {
      setIsSubmittingExistingProject(false);
    }
  };

  // Function to extract project name from path
  function extractProjectNameFromPath(path) {
    const pathSegments = path.split(/[\\/]/); // Split by both forward and back slashes to cover different OS
    return pathSegments.pop() || ""; // Get the last segment of the path
  }

  // Modified onClick handler for the "Select" button
  async function handleDirectorySelection(path) {
    if (path) {
      const projectName = extractProjectNameFromPath(path);
      if (addExistingProjectForm.setValue) {
        addExistingProjectForm.setValue("project_name", projectName);
      }
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

  return (
    <Dialog
      open={showNewProjectDialog}
      onOpenChange={() => setShowNewProjectDialog(false)}
    >
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
                  handleNewProjectFormSubmit
                )}
              >
                <DialogHeader>
                  <DialogTitle>Create Project</DialogTitle>
                  <DialogDescription>
                    Create a new project for the Internet Computer
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[360px] overflow-y-auto">
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
                                    type="button"
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
                      <div>
                        <FormField
                          control={createNewProjectform.control}
                          name="frontend"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Frontend Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frontend type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="sveltekit">
                                    SvelteKit
                                  </SelectItem>
                                  <SelectItem value="vanilla">
                                    Vanilla
                                  </SelectItem>
                                  <SelectItem value="vue">Vue</SelectItem>
                                  <SelectItem value="react">React</SelectItem>
                                  <SelectItem value="simple-assets">
                                    Simple Assets
                                  </SelectItem>
                                  <SelectItem value="none">None</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={createNewProjectform.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Canister Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select canister type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="motoko">Motoko</SelectItem>
                                  <SelectItem value="rust">Rust</SelectItem>
                                  <SelectItem value="azle">Azle</SelectItem>
                                  <SelectItem value="kybra">Kybra</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <FormLabel className="text-small">Options</FormLabel>
                        <FormField
                          control={createNewProjectform.control}
                          name="dry_run"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Dry Run
                                </FormLabel>
                                <FormDescription>
                                  Preview directories and files without creating
                                  them.
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
                          name="verbose"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Verbose
                                </FormLabel>
                                <FormDescription>
                                  Display detailed information about operations.
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
                          name="quiet"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Quiet
                                </FormLabel>
                                <FormDescription>
                                  Suppress informational messages.
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
                      <div>
                        <FormField
                          control={createNewProjectform.control}
                          name="extras"
                          render={({ field }) => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel className="text-base">
                                  Extras
                                </FormLabel>
                                <FormDescription>
                                  Select additional features for your project.
                                </FormDescription>
                              </div>
                              {(
                                [
                                  "internet-identity",
                                  "bitcoin",
                                  "frontend-tests",
                                ] as const
                              ).map((item) => (
                                <FormItem
                                  key={item}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value.includes(item)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          field.onChange([
                                            ...field.value,
                                            item,
                                          ]);
                                        } else {
                                          field.onChange(
                                            field.value.filter(
                                              (value) => value !== item
                                            )
                                          );
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item}
                                  </FormLabel>
                                </FormItem>
                              ))}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <ScrollBar />
                </ScrollArea>
                <DialogFooter>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setShowNewProjectDialog(false);
                    }}
                  >
                    Cancel
                  </Button>
                  {isSubmittingNewProject ? (
                    <Button type="button" disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </Button>
                  ) : (
                    <Button type="submit">Create</Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="import">
            <Form {...addExistingProjectForm}>
              <form
                onSubmit={addExistingProjectForm.handleSubmit(
                  handleExistingProjectFormSubmit
                )}
              >
                <DialogHeader>
                  <DialogTitle>Import Existing Project</DialogTitle>
                  <DialogDescription>
                    Import an existing project for the Internet Computer
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
                                  type="button"
                                  onClick={() => {
                                    getDirectoryPath().then((path) => {
                                      if (path) {
                                        field.onChange(path);
                                        handleDirectorySelection(path);
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
                    type="button"
                    onClick={() => {
                      setShowNewProjectDialog(false);
                    }}
                  >
                    Cancel
                  </Button>
                  {isSubmittingExistingProject ? (
                    <Button disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </Button>
                  ) : (
                    <Button type="submit">Import</Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
