import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { CodeIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";

export default function EnvironmentVariables() {
  return (
    <div className="flex flex-col h-[calc(100vh-106px)] ">
      <Alert className="flex items-center justify-between py-4 mt-4">
        <div className="flex items-center">
          <CodeIcon className="h-5 w-5 mr-4" />
          <div>
            <AlertTitle>Global Environment Variables</AlertTitle>
            <AlertDescription>
              You can add or edit your environment variables on this page, these
              variables will be available for all projects.
            </AlertDescription>
          </div>
        </div>
      </Alert>
      <ScrollArea className="h-[calc(100vh-100px)] overflow-y-auto">
        <div className="space-y-3 mt-6">
          <div className="flex items-center justify-between space-x-4">
            <Label>CANISTER_CANDID_PATH</Label>
            <Input />
            <Button>Update</Button>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <Label>CANISTER_ID</Label>
            <Input />
            <Button>Update</Button>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <Label>DFX_CONFIG_ROOT</Label>
            <Input />
            <Button>Update</Button>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <Label>DFX_INSTALLATION_ROOT</Label>
            <Input />
            <Button>Update</Button>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <Label>DFX_VERSION</Label>
            <Input />
            <Button>Update</Button>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <Label>DFX_MOC_PATH</Label>
            <Input />
            <Button>Update</Button>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <Label>DFX_WARNING</Label>
            <Input />
            <Button>Update</Button>
          </div>
          <ScrollBar />
        </div>
      </ScrollArea>
    </div>
  );
}
