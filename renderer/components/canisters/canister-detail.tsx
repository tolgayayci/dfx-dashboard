import useCanister from "renderer/hooks/useCanister";

import CliCommandSelector from "@components/canisters/command-selector";
import CanisterStatusConfig from "@components/canisters/canister-status-config";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";

export default function CanisterDetail({
  projectPath,
  canisterName,
}: {
  projectPath: string;
  canisterName: string;
}) {
  const { canisterData, isLoading, error } = useCanister(
    projectPath,
    canisterName
  );

  if (isLoading && !canisterData) {
    console.log("Loading...");
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>There was an error: {error.message}</div>;
  }

  if (canisterData && canisterData.name) {
    return (
      <>
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between space-y-2 mb-4">
            <h2 className="font-bold">{canisterName}</h2>
            <div className="space-x-2">
              <Button>Project</Button>
              <Button>Show Project</Button>
            </div>
          </div>
          <Separator className="w-full mb-4 -mx-4" />
          <div className="flex w-full">
            <div className="w-3/5 pr-4">
              <CliCommandSelector canister={canisterData} />
            </div>

            <div className="w-2/5">
              <CanisterStatusConfig
                canister={canisterData}
                projectPath={projectPath}
              />
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <div>Canister not found or name is undefined.</div>;
  }
}
