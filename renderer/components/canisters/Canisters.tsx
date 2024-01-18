import { useEffect, useState } from "react";
import useProjects from "renderer/hooks/useProjects";

import { Button } from "@components/ui/button";
import { createColumns } from "./columns";
import { DataTable } from "./data-table";
import NoCanisters from "@components/canisters/no-canister";
import Loading from "@components/common/loading";

export default function CanistersComponent() {
  const [allCanisters, setAllCanisters] = useState([]);

  const projects = useProjects(); // Retrieve all projects

  async function checkCanisters(projectPath) {
    try {
      const result = await window.awesomeApi.listCanisters(projectPath);

      // Convert canisters object into an array of rows and add project info
      const canistersArray = Object.keys(result.canisters).map((key) => ({
        name: key,
        ...result.canisters[key],
        projectName: projects.find((p) => p.path === projectPath)?.name,
        projectPath: projectPath,
      }));

      // Update all canisters with the new canisters, avoiding duplicates
      setAllCanisters((prevCanisters) => {
        const newCanisters = canistersArray.filter(
          (newCanister) =>
            !prevCanisters.some(
              (prevCanister) =>
                prevCanister.name === newCanister.name &&
                prevCanister.projectName === newCanister.projectName
            )
        );
        return [...prevCanisters, ...newCanisters];
      });
    } catch (error) {
      console.error("Error invoking remote method:", error);
    }
  }

  async function runCanisterCommand(action: string) {
    try {
      // Execute the command for each project
      projects.forEach(async (project) => {
        await window.awesomeApi.runDfxCommand(
          "canister",
          action,
          ["--all"],
          [],
          project.path
        );
      });
      // Optionally, refresh the canisters list here
    } catch (error) {
      console.error("Error invoking remote method:", error);
    }
  }

  useEffect(() => {
    setAllCanisters([]); // Reset the canisters list when projects change
    projects.forEach((project) => {
      checkCanisters(project.path);
    });
  }, [projects]);

  const columns = createColumns();

  return (
    <div className="flex flex-col h-[calc(100vh-106px)]">
      <div className="flex items-center justify-between space-y-2 mb-3">
        <h2 className="text-2xl font-bold tracking-tight">All Canisters</h2>
        <div className="flex items-center space-x-2">
          <Button type="button" onClick={() => runCanisterCommand("start")}>
            Start All
          </Button>
          <Button type="button" onClick={() => runCanisterCommand("stop")}>
            Stop All
          </Button>
        </div>
      </div>
      {allCanisters.length > 0 ? (
        <>
          <DataTable columns={columns} data={allCanisters} />
        </>
      ) : (
        <NoCanisters />
      )}
    </div>
  );
}
