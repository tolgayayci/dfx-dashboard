import CommandHistory from "@components/logs/command-history/command-history";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

export default function LogsComponent() {
  return (
    <div className="flex flex-col h-[calc(100vh-90px)]">
      <Tabs defaultValue="command-history" className="w-full">
        <TabsList className="flex">
          <TabsTrigger value="command-history" className="flex-1 text-center">
            Command History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="command-history">
          <CommandHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
