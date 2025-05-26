import React, { useEffect, useState, useCallback, useMemo } from "react";
import useProjects from "renderer/hooks/useProjects";

import { createColumns } from "@components/canisters/columns";
import { DataTable } from "@components/canisters/data-table";
import NoCanisters from "@components/canisters/no-canister";

export default function CanistersComponent() {
  const [allCanisters, setAllCanisters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const projects = useProjects();

  const checkCanisters = useCallback(async (projectPath) => {
    try {
      const result = await window.awesomeApi.listCanisters(projectPath);

      // Convert canisters object into an array of rows and add project info
      const canistersArray = Object.keys(result.canisters).map((key) => ({
        name: key,
        ...result.canisters[key],
        type: 'user', // Explicitly set as user canister
        network: result.canisters[key].network || 'local', // Default to local for user canisters
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
  }, [projects]);

  const fetchNNSCanisters = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch NNS canisters for both local and IC networks
      const [localResult, icResult] = await Promise.all([
        window.awesomeApi.listNNSCanisters('local'),
        window.awesomeApi.listNNSCanisters('ic')
      ]);

      const nnsCanisters = [];
      
      if (localResult.success) {
        // Add local NNS canisters
        const localCanisters = localResult.data.map(canister => ({
          ...canister,
          network: 'local',
          projectName: 'Network Nervous System'
        }));
        nnsCanisters.push(...localCanisters);
      }
      
      if (icResult.success) {
        // Add IC NNS canisters with different network identifier
        const icCanisters = icResult.data.map(canister => ({
          ...canister,
          name: `${canister.name} (IC)`,
          network: 'ic',
          projectName: 'Network Nervous System'
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
  }, []);

  useEffect(() => {
    setAllCanisters([]);
    
    // Fetch user canisters from projects
    projects.forEach((project) => {
      checkCanisters(project.path);
    });

    // Fetch NNS canisters
    fetchNNSCanisters();
  }, [projects, checkCanisters, fetchNNSCanisters]);

  const columns = useMemo(() => createColumns(), []);

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
