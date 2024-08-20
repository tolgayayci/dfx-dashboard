import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useCanister from "renderer/hooks/useCanister";
import CliCommandSelector from "@components/canisters/canister/command-selector";

import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import { Avatar, AvatarImage } from "@components/ui/avatar";
import { useToast } from "@components/ui/use-toast";

// Modals
import OutputModal from "@components/canisters/canister/modals/output-modal";
import TopUpModal from "@components/canisters/canister/modals/topup-modal";
import StatusModal from "@components/canisters/canister/modals/status-modal";
import ConfigModal from "@components/canisters/canister/modals/config-modal";
import RemoveModal from "@components/canisters/canister/modals/remove-modal";

export default function CanisterDetail() {
  const [commandOutput, setCommandOutput] = useState();
  const [commandError, setCommandError] = useState();
  const [latestCommand, setLatestCommand] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const { path, canisterName, command } = router.query;

  const { canisterData } = useCanister(path as string, canisterName as string);
  const { toast } = useToast();

  useEffect(() => {
    if (commandOutput && !commandError) {
      toast({
        title: "Command Executed Successfully",
        description: (
          <div>
            <pre className="bg-gray-100 text-black p-1 px-2 rounded-md mt-1">
              {latestCommand}
            </pre>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="mt-2"
            >
              View Output
            </Button>
          </div>
        ),
        variant: "default",
        className: "border-green-500",
      });
    } else if (commandError) {
      toast({
        title: "Command Execution Failed",
        description: (
          <div>
            <pre className="bg-gray-100 text-black p-1 px-2 rounded-md mt-1">
              {latestCommand}
            </pre>
            <Button
              variant="default"
              onClick={() => setIsModalOpen(true)}
              className="mt-2"
            >
              View Output
            </Button>
          </div>
        ),
        variant: "default",
        className: "border-red-500",
      });
    }
  }, [commandOutput, commandError, latestCommand, toast]);

  if (canisterData) {
    return (
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
              canisterName={canisterName as string}
              projectPath={path as string}
            />
            <StatusModal canister={canisterData} projectPath={path as string} />
            <ConfigModal canister={canisterData} projectPath={path as string} />
            <RemoveModal
              canisterName={canisterName as string}
              projectPath={path as string}
            />
          </div>
        </div>
        <Separator className="w-full mb-4 -mx-4" />
        <div className="flex flex-col w-full h-screen">
          <div className="flex-grow overflow-hidden">
            <CliCommandSelector
              canisterName={canisterName as string}
              path={path as string}
              initialCommand={command as string}
              latestCommand={latestCommand}
              setCommandError={setCommandError}
              setCommandOutput={setCommandOutput}
              setLatestCommand={setLatestCommand}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Canister not found or name is undefined.</div>;
  }
}
