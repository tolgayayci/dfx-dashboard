import { useEffect, useState } from "react";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { CodeIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";

export default function EnvironmentVariables() {
  const [envVars, setEnvVars] = useState({});

  useEffect(() => {
    window.awesomeApi
      .readEnvVariables()
      .then((fetchedVars) => {
        setEnvVars(fetchedVars);
      })
      .catch((error) => {
        console.error("Error fetching environment variables:", error);
      });
  }, []);

  const handleInputChange = (key, newValue) => {
    setEnvVars((prevEnvVars) => ({
      ...prevEnvVars,
      [key]: { ...prevEnvVars[key], value: newValue },
    }));
  };

  const updateEnvVar = (key) => {
    const variable = envVars[key];
    if (!variable || !variable.path) {
      console.error("Path for the variable is not defined");
      return;
    }

    window.awesomeApi
      .updateEnvVariables(variable.path, key, variable.value)
      .then(() => {
        console.log(`Environment variable ${key} updated successfully.`);
        // Optionally, handle any UI updates or notifications here
      })
      .catch((error) => {
        console.error("Error updating environment variable:", error);
      });
  };

  const renderEnvVarFields = () => {
    const keys = [
      "CANISTER_CANDID_PATH",
      "CANISTER_ID",
      "DFX_CONFIG_ROOT",
      "DFX_INSTALLATION_ROOT",
      "DFX_VERSION",
      "DFX_MOC_PATH",
      "DFX_WARNING",
    ];
    return keys.map((key) => (
      <div key={key} className="flex items-center justify-between space-x-4">
        <Label className="w-72">{key}</Label>
        <Input
          value={envVars[key]?.value || ""}
          placeholder={!envVars[key] ? "Not Defined" : ""}
          onChange={(e) => handleInputChange(key, e.target.value)}
        />
        <Button onClick={() => updateEnvVar(key)}>Update</Button>{" "}
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-106px)] ">
      <Alert className="flex items-center justify-between py-4 mt-4">
        <div className="flex items-center">
          <CodeIcon className="h-5 w-5 mr-4" />
          <div>
            <AlertTitle>Global Environment Variables</AlertTitle>
            <AlertDescription>
              You can edit your existing environment variables on this page that
              you globally defined like in your .profile file.
            </AlertDescription>
          </div>
        </div>
      </Alert>
      <ScrollArea className="h-[calc(100vh-100px)] overflow-y-auto">
        <div className="space-y-4 mt-6">
          {renderEnvVarFields()}
          <ScrollBar />
        </div>
      </ScrollArea>
    </div>
  );
}
