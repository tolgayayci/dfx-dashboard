import EnvironmentVariables from "@components/settings/env-variables";
import VersionManager from "@components/settings/version-manager";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

export default function SettingsComponent() {
  return (
    <Tabs defaultValue="version-manager" className="w-full">
      <div className="flex items-center justify-between w-full">
        <TabsList className="w-full">
          <TabsTrigger value="version-manager" className="flex-1">
            Version Manager
          </TabsTrigger>
          <TabsTrigger value="env" className="flex-1">
            Environment Variables
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="version-manager">
        <VersionManager />
      </TabsContent>
      <TabsContent value="env">
        <EnvironmentVariables />
      </TabsContent>
    </Tabs>
  );
}
