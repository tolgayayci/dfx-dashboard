import { useState } from "react";
import useCanister from "renderer/hooks/useCanister";

import CliCommandSelector from "@components/canisters/canister/command-selector";

// Modals
import OutputModal from "@components/canisters/canister/modals/output-modal";
import TopUpModal from "@components/canisters/canister/modals/topup-modal";
import StatusModal from "@components/canisters/canister/modals/status-modal";
import ConfigModal from "@components/canisters/canister/modals/config-modal";
import RemoveModal from "@components/canisters/canister/modals/remove-modal";

import { Separator } from "@components/ui/separator";
import { Avatar, AvatarImage } from "@components/ui/avatar";

export default function CanisterDetail({
  projectPath,
  canisterName,
}: {
  projectPath: string;
  canisterName: string;
}) {
  const [commandOutput, setCommandOutput] = useState();
  const [commandError, setCommandError] = useState();
  const [latestCommand, setLatestCommand] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialCommand, setInitialCommand] = useState("");

  const { canisterData } = useCanister(projectPath, canisterName);

  if (canisterData) {
    return (
      <>
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between space-y-2 mb-4">
            <div className="flex items-center">
              <Avatar className="mr-4 h-10 w-10">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${canisterData.name}.png`}
                  alt={canisterData.name}
                />
              </Avatar>
              <h2 className="font-bold">{canisterData.name}</h2>
            </div>
            <div className="space-x-2 flex items-center">
              {(commandOutput || commandError) && (
                <OutputModal
                  isOpen={isModalOpen}
                  onOpenChange={setIsModalOpen}
                  latestCommand={latestCommand}
                  commandOutput={commandOutput}
                  commandError={commandError}
                />
              )}
              <TopUpModal
                canisterName={canisterName}
                projectPath={projectPath}
              />
              <StatusModal canister={canisterData} projectPath={projectPath} />
              <ConfigModal canister={canisterData} projectPath={projectPath} />
              <RemoveModal
                canisterName={canisterName}
                projectPath={projectPath}
              />
            </div>
          </div>
          <Separator className="w-full mb-4 -mx-4" />
          <div className="flex flex-col w-full h-screen">
            <div className="flex-grow overflow-hidden">
              <CliCommandSelector
                canister={canisterData}
                canisterName={canisterName}
                path={projectPath as string}
                initialCommand={initialCommand}
                latestCommand={latestCommand}
                setCommandError={setCommandError}
                setCommandOutput={setCommandOutput}
                setLatestCommand={setLatestCommand}
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
