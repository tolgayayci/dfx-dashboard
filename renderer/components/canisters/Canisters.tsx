import { useEffect, useState } from "react";
import useProjects from "renderer/hooks/useProjects";

import { createColumns } from "@components/canisters/columns";
import { DataTable } from "@components/canisters/data-table";
import NoCanisters from "@components/canisters/no-canister";

export default function CanistersComponent() {
  const [allCanisters, setAllCanisters] = useState([]);

  const projects = useProjects();

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
      console.log("Error invoking remote method:", error);
    }
  }

  useEffect(() => {
    setAllCanisters([]);
    projects.forEach((project) => {
      checkCanisters(project.path);
    });
  }, [projects]);

  const columns = createColumns();

  return (
    <div className="flex flex-col h-[calc(100vh-106px)]">
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
