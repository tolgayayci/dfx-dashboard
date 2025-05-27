import EnvironmentVariables from "@components/settings/env-variables";
import VersionManager from "@components/settings/version-manager";
import DfxCompletion from "@components/settings/dfx-completion";
import CacheManagement from "@components/settings/cache-management";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

export default function SettingsComponent() {
  return (
    <Tabs defaultValue="version-manager" className="w-full">
      <div className="flex items-center justify-between w-full">
        <TabsList className="w-full">
          <TabsTrigger value="version-manager" className="flex-1">
            Version Manager
          </TabsTrigger>
          <TabsTrigger value="cache" className="flex-1">
            Cache Management
          </TabsTrigger>
          <TabsTrigger value="env" className="flex-1">
            Environment Variables
          </TabsTrigger>
          <TabsTrigger value="completion" className="flex-1">
            Shell Completion
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="version-manager">
        <VersionManager />
      </TabsContent>
      <TabsContent value="cache">
        <CacheManagement />
      </TabsContent>
      <TabsContent value="env">
        <EnvironmentVariables />
      </TabsContent>
      <TabsContent value="completion">
        <DfxCompletion />
      </TabsContent>
    </Tabs>
  );
}
