import { useState } from "react";
import { useRouter } from "next/router";
import useCanister from "renderer/hooks/useCanister";
import CliCommandSelector from "@components/canisters/canister/command-selector";

import { Separator } from "@components/ui/separator";
import { Avatar, AvatarImage } from "@components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Badge } from "@components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";

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
  const [executedCommand, setExecutedCommand] = useState("");

  const router = useRouter();
  const { path, canisterName, command } = router.query;

  const { canisterData, isLoading, error } = useCanister(path as string, canisterName as string);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-gray-500">Loading canister details...</div>
      </div>
    );
  }

  if (error || !canisterData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Canister not found
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            {error?.message || "The requested canister could not be found."}
          </p>
        </div>
      </div>
    );
  }

  const isNNSCanister = canisterData.type === 'nns';

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between space-y-2 mb-4">
        <div className="flex items-center">
          <Avatar className="mr-4 h-12 w-12">
            <AvatarImage
              src={`https://avatar.vercel.sh/${canisterData.name}.png`}
              alt={canisterData.name}
            />
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold">{canisterData.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              {isNNSCanister ? (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  NNS
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200">
                  User
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {canisterData.network || 'local'}
              </Badge>
              <span className="text-xs text-gray-500 font-mono">{canisterData.canister_id}</span>
            </div>
          </div>
        </div>
        <div className="space-x-2 flex items-center">
          {(commandOutput || commandError) && (
            <OutputModal
              isOpen={isModalOpen}
              onOpenChange={setIsModalOpen}
              latestCommand={latestCommand}
              runnedCommand={executedCommand}
              commandOutput={commandOutput}
              commandError={commandError}
            />
          )}
          {!isNNSCanister && (
            <>
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
            </>
          )}
        </div>
      </div>
      <Separator className="w-full mb-4 -mx-4" />
      
      <Tabs defaultValue="methods" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="methods">Methods</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
        </TabsList>
        
        <TabsContent value="methods" className="mt-4">
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
                setRunnedCommand={setExecutedCommand}
                isNNSCanister={isNNSCanister}
                onViewOutput={() => setIsModalOpen(true)}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="metadata" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Canister Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                <p>Metadata functionality coming soon...</p>
                <p className="text-xs mt-2">Will show controllers, module hash, and canister settings</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
