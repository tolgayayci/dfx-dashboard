import { useState, useEffect } from "react";
import useProject from "renderer/hooks/useProject";

import { Button } from "@components/ui/button";
import { Avatar, AvatarImage } from "@components/ui/avatar";
import { Separator } from "@components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import DfxComponent from "@components/dfx/Dfx";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";

import { Input } from "@components/ui/input";
import { Loader2 } from "lucide-react";

import { DataTable } from "@components/canisters/data-table";
import { createProjectColumns } from "./columns";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  renameProjectFormSchema,
  onRenameProjectFormSubmit,
} from "@components/projects/forms/renameProject";

import { useToast } from "@components/ui/use-toast";
import { projectRenameSuccess, projectRenameError } from "@lib/notifications";

export default function ProjectDetail({
  projectPath,
}: {
  projectPath: string;
}) {
  const [showRenameProjectDialog, setShowRenameProjectDialog] = useState(false);
  const [isSubmittingRenameProject, setIsSubmittingRenameProject] =
    useState(false);
  const [canisters, setCanisters] = useState(null);

  const { toast } = useToast();

  const { project, isLoading } = useProject(projectPath);

  const renameProjectForm = useForm<z.infer<typeof renameProjectFormSchema>>({
    resolver: zodResolver(renameProjectFormSchema),
    defaultValues: {
      from_project_name: project?.name,
      path: project?.path,
    },
  });

  const handleRenameProjectFormSubmit = async (data) => {
    setIsSubmittingRenameProject(true);
    try {
      await onRenameProjectFormSubmit(data).then(() => {
        toast(projectRenameSuccess(data.to_project_name));
        setShowRenameProjectDialog(false);
      });
    } catch (error) {
      // handle error
      // toast(projectRenameError(data.to_project_name));
      console.log(error);
    } finally {
      setIsSubmittingRenameProject(false);
    }
  };

  useEffect(() => {
    const checkCanisters = async () => {
      try {
        if (project.path) {
          const result = await window.awesomeApi.listCanisters(project.path);

          const canistersArray = Object.keys(result.canisters).map((key) => ({
            name: key,
            ...result.canisters[key],
            projectPath: projectPath,
          }));

          setCanisters(canistersArray);
        }
      } catch (error) {
        console.error("Error invoking remote method:", error);
      }
    };

    checkCanisters();
  }, [project]);

  if (isLoading && !project) {
    return <div>Loading...</div>;
  }

  const columns = createProjectColumns();

  if (project && project.name) {
    return (
      <>
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between space-y-2 mb-4">
            <div className="flex items-center">
              <Avatar className="mr-4 h-10 w-10">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${project.name}.png`}
                  alt={project.name}
                />
              </Avatar>
              <h2 className="font-bold">{project.name}</h2>
            </div>
            <div className="space-x-2">
              <Button
                onClick={() => setShowRenameProjectDialog(true)}
                variant="default"
              >
                Rename Project
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
                        <DialogTitle>Rename "{project.name}"</DialogTitle>
                        <DialogDescription>
                          You can rename your project on application, this
                          doesn't edit your folder name on your system.
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
                                    From Project Name
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
                                    To Project Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      id="to_project_name"
                                      placeholder="ssss"
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
                              name="path"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-small">
                                    Path
                                  </FormLabel>
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
                          <Button type="submit" variant="default">
                            Rename
                          </Button>
                        )}
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <Separator className="w-full mb-4" />
        <Tabs defaultValue="canisters" className="w-full">
          <TabsList>
            <TabsTrigger value="canisters">Canisters</TabsTrigger>
            <TabsTrigger value="dfx_json">dfx.json</TabsTrigger>
          </TabsList>
          <TabsContent value="canisters">
            {canisters ? (
              <>
                <DataTable columns={columns} data={canisters} />
              </>
            ) : (
              <p>Loading canisters...</p>
            )}
          </TabsContent>
          <TabsContent value="dfx_json">
            <DfxComponent projectPath={projectPath} />
          </TabsContent>
        </Tabs>
      </>
    );
  } else {
    <h2>askdşasd</h2>;
  }
}
