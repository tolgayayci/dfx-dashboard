import EnvironmentVariables from "@components/settings/env-variables";
import Adapters from "@components/settings/adapters";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

export default function SettingsComponent() {
  return (
    <Tabs defaultValue="env" className="w-full">
      <div className="flex items-center justify-between w-full">
        {/* <TabsList>
          <TabsTrigger value="env">Environment Variables</TabsTrigger>
          <TabsTrigger value="adapters" disabled>
            Adapters
          </TabsTrigger>
        </TabsList> */}
      </div>
      <TabsContent value="env">
        <EnvironmentVariables />
      </TabsContent>
      {/* <TabsContent value="adapters">
        <Adapters />
      </TabsContent> */}
    </Tabs>
  );
}
