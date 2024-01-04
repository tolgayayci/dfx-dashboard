"use client";

import { useState, useEffect } from "react";

import {
  Form,
  FormControl,
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

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";

import { Avatar, AvatarImage } from "@components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Loader2 } from "lucide-react";
import { FolderCheck } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { CodeIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import ProjectModal from "@components/projects/project-modal";

import {
  renameProjectFormSchema,
  onRenameProjectFormSubmit,
} from "@components/projects/forms/renameProject";

import {
  removeProjectFormSchema,
  onRemoveProjectFormSubmit,
} from "@components/projects/forms/removeProject";

import { useToast } from "@components/ui/use-toast";
import {
  projectRenameSuccess,
  projectRenameError,
  projectRemoveSuccess,
  projectRemoveError,
} from "@lib/notifications";

const ProjectCard = ({
  project,
}: {
  project: {
    name: string;
    path: string;
    active: boolean;
  };
}) => {
  const [showRenameProjectDialog, setShowRenameProjectDialog] = useState(false);
  const [showRemoveProjectDialog, setShowRemoveProjectDialog] = useState(false);
  const [isSubmittingRenameProject, setIsSubmittingRenameProject] =
    useState(false);
  const [isSubmittingRemoveProject, setIsSubmittingRemoveProject] =
    useState(false);

  const { toast } = useToast();

  const renameProjectForm = useForm<z.infer<typeof renameProjectFormSchema>>({
    resolver: zodResolver(renameProjectFormSchema),
    defaultValues: {
      from_project_name: project.name,
      path: project.path,
    },
  });

  const removeProjectForm = useForm<z.infer<typeof removeProjectFormSchema>>({
    resolver: zodResolver(removeProjectFormSchema),
    defaultValues: {
      project_name: project.name,
      path: project.path,
    },
  });

  // Modify your form submit handler to use setIsSubmitting
  const handleRenameProjectFormSubmit = async (data) => {
    setIsSubmittingRenameProject(true);
    try {
      await onRenameProjectFormSubmit(data).then(() => {
        toast(projectRenameSuccess(data.to_project_name));
        setShowRenameProjectDialog(false);
      });
    } catch (error) {
      // handle error
      toast(projectRenameError(data.to_project_name));
    } finally {
      setIsSubmittingRenameProject(false);
    }
  };

  const handleRemoveProjectFormSubmit = async (data) => {
    setIsSubmittingRemoveProject(true);
    try {
      await onRemoveProjectFormSubmit(data).then(() => {
        toast(projectRemoveSuccess(data.to_project_name));
        setShowRemoveProjectDialog(false);
      });
    } catch (error) {
      // handle error
      toast(projectRemoveError(data.to_project_name));
    } finally {
      setIsSubmittingRemoveProject(false);
    }
  };

  return (
    <Card className="col-span-1" key={project.name}>
      <CardHeader>
        <div className="flex items-center">
          <Avatar className="mr-4 h-10 w-10">
            <AvatarImage
              src={`https://avatar.vercel.sh/${project.name}.png`}
              alt={project.name}
            />
          </Avatar>
          <div className="flex flex-col space-y-1 overflow-hidden">
            <CardTitle className="text-medium">{project.name}</CardTitle>
            <CardDescription className="truncate inline-flex items-center">
              <FolderCheck className="w-4 h-4 mr-1" />
              {project.path.split("/").slice(-2)[0] +
                "/" +
                project.path.split("/").slice(-2)[1]}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowRenameProjectDialog(true)}
        >
          Edit
        </Button>
        <Button
          className="w-full"
          onClick={() => setShowRemoveProjectDialog(true)}
        >
          Remove
        </Button>
        <Dialog open={showRenameProjectDialog}>
          <DialogContent>
            <Form {...renameProjectForm}>
              <form
                onSubmit={renameProjectForm.handleSubmit(
                  handleRenameProjectFormSubmit
                )}
              >
                <DialogHeader className="space-y-3">
                  <DialogTitle>Edit "{project.name}"</DialogTitle>
                  <DialogDescription>
                    You can edit your project name, this is just for this
                    application and doesn't change folder name on your file
                    system.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <div className="py-4 pb-6">
                    <div className="space-y-3">
                      <FormField
                        control={renameProjectForm.control}
                        name="from_project_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-small">
                              Current Project Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id="from_project_name"
                                placeholder={project.name}
                                disabled
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-3">
                      <FormField
                        control={renameProjectForm.control}
                        name="to_project_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-small">
                              New Project Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id="to_project_name"
                                placeholder="alice"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setShowRenameProjectDialog(false);
                    }}
                  >
                    Cancel
                  </Button>
                  {isSubmittingRenameProject ? (
                    <Button disabled>
                      {" "}
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Renaming...
                    </Button>
                  ) : (
                    <Button type="submit">Rename</Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <Dialog open={showRemoveProjectDialog}>
          <DialogContent>
            <Form {...removeProjectForm}>
              <form
                onSubmit={removeProjectForm.handleSubmit(
                  handleRemoveProjectFormSubmit
                )}
              >
                <DialogHeader className="space-y-3">
                  <DialogTitle>Remove "{project.name}"</DialogTitle>
                  <DialogDescription>
                    You can remove your project on application, this doesn't
                    remove your project folder on your system.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <div className="py-4 pb-6">
                    <div className="space-y-3">
                      <FormField
                        control={removeProjectForm.control}
                        name="project_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-small">
                              Project Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id="project_name"
                                placeholder={project.name}
                                disabled
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-3">
                      <FormField
                        control={removeProjectForm.control}
                        name="path"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-small">Path</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id="path"
                                placeholder={project.path}
                                disabled
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setShowRemoveProjectDialog(false);
                    }}
                  >
                    Cancel
                  </Button>
                  {isSubmittingRemoveProject ? (
                    <Button disabled>
                      {" "}
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removing...
                    </Button>
                  ) : (
                    <Button type="submit">Remove</Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default function ProjectsComponent() {
  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false);
  const [projects, setProjects] = useState<any>();
  const [searchQuery, setSearchQuery] = useState("");

  async function checkProjects() {
    try {
      const projects = await window.awesomeApi.manageProjects("get", "");

      setProjects(projects);
    } catch (error) {
      console.error("Error invoking remote method:", error);
    }
  }

  const handleSearchChange = (e: any) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  // Call checkIdentities when the component mounts
  useEffect(() => {
    checkProjects();
  }, []);

  return (
    <div>
      <>
        <div className="flex items-center justify-between">
          <Alert className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <CodeIcon className="h-5 w-5 mr-4" />
              <div>
                <AlertTitle>
                  You have {projects?.length ? projects?.length : "0"} projects
                </AlertTitle>
                <AlertDescription>
                  You can add, remove, or edit your projects on this page.
                </AlertDescription>
              </div>
            </div>
            <Button onClick={() => setShowCreateProjectDialog(true)}>
              Create New Project
            </Button>
          </Alert>
          <ProjectModal
            showNewProjectDialog={showCreateProjectDialog}
            setShowNewProjectDialog={setShowCreateProjectDialog}
          />
        </div>

        {projects ? (
          <div>
            <div className="my-6">
              <Input
                type="search"
                placeholder={`${"=>"} Search for an identity between ${
                  projects.length
                } projects`}
                onChange={handleSearchChange}
                value={searchQuery}
              />
            </div>
            <ScrollArea className="max-h-[350px] overflow-y-auto">
              <div className="grid grid-cols-3 gap-6">
                {projects
                  .filter((project) =>
                    project.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .map((project) => (
                    <ProjectCard key={project.path} project={project} /> // Pass the callback here/>
                  ))}
              </div>
              <ScrollBar />
            </ScrollArea>
          </div>
        ) : (
          <div>"No projects found"</div>
        )}
      </>
    </div>
  );
}
