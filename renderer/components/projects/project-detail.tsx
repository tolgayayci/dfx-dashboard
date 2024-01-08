import { useState, useEffect } from "react";
import useProject from "renderer/hooks/useProject";

import { Button } from "@components/ui/button";
import { Avatar, AvatarImage } from "@components/ui/avatar";
import { Separator } from "@components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import DfxComponent from "@components/dfx/Dfx";

import { DataTable } from "@components/canisters/data-table";
import { createProjectColumns } from "./columns";

export default function ProjectDetail({
  projectPath,
}: {
  projectPath: string;
}) {
  const { project, isLoading } = useProject(projectPath);
  const [canisters, setCanisters] = useState(null);

  useEffect(() => {
    const checkCanisters = async () => {
      console.log(project);
      try {
        if (project.path) {
          console.log("project.path", project.path);
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

  console.log(canisters);

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
              <Button variant="destructive">Remove Project</Button>
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
