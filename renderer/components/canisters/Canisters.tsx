import { useEffect, useState } from "react";
import useProject from "renderer/hooks/useProject";

import { Button } from "@components/ui/button";
import { Canister, createColumns } from "./columns";
import { DataTable } from "./data-table";
import CanisterModal from "./canister-modal";

// Project Specific Page
export default function CanistersComponent() {
  const [showCanisterModal, setShowCanisterModal] = useState(false);
  const [selectedCanister, setSelectedCanister] = useState({});
  const [canisters, setCanisters] = useState();

  const { project } = useProject();

  async function checkCanisters() {
    try {
      if (!project) return;

      const result = await window.awesomeApi.listCanisters(project?.path);

      console.log(result.canisters);
      setCanisters(result.canisters);
    } catch (error) {
      console.error("Error invoking remote method:", error);
    }
  }

  async function runCanisterCommand(action: string) {
    try {
      const identities = await window.awesomeApi.runDfxCommand(
        "canister",
        action,
        ["--all"],
        [],
        project?.path
      );

      console.log(identities);
    } catch (error) {
      console.error("Error invoking remote method:", error);
    }
  }

  const handleOpenModal = (canisterData) => {
    setSelectedCanister(canisterData);
    setShowCanisterModal(true);
  };

  const columns = createColumns(handleOpenModal);

  // Function to convert the canisters object into an array of rows
  function generateCanisterRows(
    canisters: Record<string, Canister>
  ): Canister[] {
    return Object.keys(canisters).map((key) => ({
      name: key,
      ...canisters[key],
    }));
  }

  useEffect(() => {
    if (project) {
      checkCanisters();
    }
  }, [project]);

  return (
    <div>
      {project?.name ? (
        <div>
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Canisters</h2>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                onClick={() => {
                  runCanisterCommand("start");
                }}
              >
                Start All
              </Button>
              <Button
                type="button"
                onClick={() => {
                  runCanisterCommand("stop");
                }}
              >
                Stop All
              </Button>
            </div>
          </div>
          <div className="mt-6">
            {canisters ? (
              <>
                <DataTable
                  columns={columns}
                  data={generateCanisterRows(canisters)}
                />
                <CanisterModal
                  showCanisterDialog={showCanisterModal}
                  setShowCanisterDialog={setShowCanisterModal}
                  canisterData={selectedCanister}
                />
              </>
            ) : null}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            No project selected
          </h2>
        </div>
      )}
    </div>
  );
}
