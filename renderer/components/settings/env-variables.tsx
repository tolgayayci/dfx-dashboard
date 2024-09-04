import React, { useEffect, useState } from "react";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { Switch } from "@components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { Badge } from "@components/ui/badge";
import { Separator } from "@components/ui/separator";
import { Loader2 } from "lucide-react";

interface EnvVar {
  value: string;
  path?: string;
}

export default function EnvironmentVariables() {
  const [envVars, setEnvVars] = useState<{ [key: string]: EnvVar }>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const defaultKeys = [
    "CANISTER_CANDID_PATH",
    "CANISTER_ID",
    "DFX_CONFIG_ROOT",
    "DFX_INSTALLATION_ROOT",
    "DFX_VERSION",
    "DFX_MOC_PATH",
    "DFX_WARNING",
    "DFX_DISABLE_QUERY_VERIFICATION",
  ];

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedVars = await window.awesomeApi.readEnvVariables();

      const formattedVars: { [key: string]: EnvVar } = {};
      Object.entries(fetchedVars).forEach(([key, value]) => {
        formattedVars[key] = { value: value, path: "" };
      });
      setEnvVars(formattedVars);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setError("Failed to load settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (key: string, newValue: string) => {
    setEnvVars((prevEnvVars) => ({
      ...prevEnvVars,
      [key]: { ...prevEnvVars[key], value: newValue },
    }));
  };

  const updateEnvVar = async (key: string) => {
    const variable = envVars[key];
    if (!variable || !variable.path) {
      console.error("Path for the variable is not defined");
      return;
    }
    try {
      await window.awesomeApi.updateEnvVariables(
        variable.path,
        key,
        variable.value
      );
      console.log(`Environment variable ${key} updated successfully.`);
    } catch (error) {
      console.error("Error updating environment variable:", error);
      setError(`Failed to update ${key}. Please try again.`);
    }
  };

  const renderEnvVarFields = () => {
    return defaultKeys.map((key) => (
      <div key={key} className="flex items-center justify-between space-x-4">
        <Label className="w-[420px]">{key}</Label>
        <Input
          value={envVars[key]?.value || ""}
          placeholder={!envVars[key] ? "Not Defined" : ""}
          onChange={(e) => handleInputChange(key, e.target.value)}
          disabled={isLoading}
        />
        <Button onClick={() => updateEnvVar(key)} disabled={isLoading}>
          Update
        </Button>
      </div>
    ));
  };

  return (
    <div className="space-y-6 relative">
      <ScrollArea className="h-[calc(90vh-90px)] overflow-y-auto relative mt-6">
        <div className="space-y-6">{renderEnvVarFields()}</div>
        <ScrollBar />
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}
      </ScrollArea>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
