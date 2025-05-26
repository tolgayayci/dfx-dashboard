import React, { useEffect, useState } from "react";
import useProjects from "renderer/hooks/useProjects";

import { createColumns } from "@components/canisters/columns";
import { DataTable } from "@components/canisters/data-table";
import NoCanisters from "@components/canisters/no-canister";

export default function CanistersComponent() {
  const [allCanisters, setAllCanisters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const projects = useProjects();

  async function checkCanisters(projectPath) {
    try {
      const result = await window.awesomeApi.listCanisters(projectPath);

      // Convert canisters object into an array of rows and add project info
      const canistersArray = Object.keys(result.canisters).map((key) => ({
        name: key,
        ...result.canisters[key],
        type: result.canisters[key].type || 'user',
        projectName: projects.find((p) => p.path === projectPath)?.name,
        path: projectPath,
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

  async function fetchNNSCanisters() {
    try {
      setIsLoading(true);
      // Fetch NNS canisters for both local and IC networks
      const [localResult, icResult] = await Promise.all([
        window.awesomeApi.listNNSCanisters('local'),
        window.awesomeApi.listNNSCanisters('ic')
      ]);

      const nnsCanisters = [];
      
      if (localResult.success) {
        nnsCanisters.push(...localResult.data);
      }
      
      if (icResult.success) {
        // Add IC canisters with different network identifier
        const icCanisters = icResult.data.map(canister => ({
          ...canister,
          name: `${canister.name} (IC)`,
          network: 'ic'
        }));
        nnsCanisters.push(...icCanisters);
      }

      // Add NNS canisters to the list
      setAllCanisters((prevCanisters) => {
        // Remove existing NNS canisters to avoid duplicates
        const userCanisters = prevCanisters.filter(c => c.type !== 'nns');
        return [...userCanisters, ...nnsCanisters];
      });
    } catch (error) {
      console.error("Error fetching NNS canisters:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setAllCanisters([]);
    
    // Fetch user canisters from projects
    projects.forEach((project) => {
      checkCanisters(project.path);
    });

    // Fetch NNS canisters
    fetchNNSCanisters();
  }, [projects]);

  const columns = createColumns();

  return (
    <div className="flex flex-col h-[calc(100vh-106px)]">
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <div className="text-sm text-gray-500">Loading NNS canisters...</div>
        </div>
      )}
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
