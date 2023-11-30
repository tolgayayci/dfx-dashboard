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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Switch } from "@components/ui/switch";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Loader2 } from "lucide-react";

import {
  createNewProjectFormSchema,
  onCreateNewProjectForm,
} from "@components/projects/forms/createNewProject";

import {
  addExistingProjectFormSchema,
  onAddExistingProjectForm,
} from "@components/projects/forms/addExistingProject";

export default function ProjectModal({
  showNewProjectDialog,
  setShowNewProjectDialog,
}) {
  const [isSubmittingNewProject, setIsSubmittingNewProject] = useState(false);
  const [isSubmittingExistingProject, setIsSubmittingExistingProject] =
    useState(false);

  // Modify your form submit handler to use setIsSubmitting
  const handleNewProjectFormSubmit = async (data) => {
    setIsSubmittingNewProject(true);
    try {
      await onCreateNewProjectForm(data);
      // handle success
    } catch (error) {
      // handle error
    } finally {
      setIsSubmittingNewProject(false);
    }
  };

  const handleExistingProjectFormSubmit = async (data) => {
    setIsSubmittingExistingProject(true);
    try {
      await onAddExistingProjectForm(data);
      // handle success
    } catch (error) {
      // handle error
    } finally {
      setIsSubmittingExistingProject(false);
    }
  };

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

  async function getDirectoryPath() {
    try {
      const result = await window.awesomeApi.openDirectory();
      return result;
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  return (
    <Dialog open={showNewProjectDialog}>
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
                <ScrollArea className="max-h-[345px] overflow-y-auto">
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
                                  Generates a preview the directories and files
                                  to be created for a new project without adding
                                  them to the file system.
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
                    <Button disabled>
                      {" "}
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
                    type="button"
                    onClick={() => {
                      setShowNewProjectDialog(false);
                    }}
                  >
                    Cancel
                  </Button>
                  {isSubmittingExistingProject ? (
                    <Button disabled>
                      {" "}
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
