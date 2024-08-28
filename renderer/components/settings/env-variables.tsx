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
  const [useBundledDfx, setUseBundledDfx] = useState(false);
  const [dfxVersion, setDfxVersion] = useState<string>("");
  const [dfxType, setDfxType] = useState<string>("");
  const [showFallbackAlert, setShowFallbackAlert] = useState(false);

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
      const [fetchedVars, dfxPreference, dfxVersions] = await Promise.all([
        window.awesomeApi.readEnvVariables(),
        window.awesomeApi.getDfxPreference(),
        window.awesomeApi.getDfxVersions(),
      ]);

      const formattedVars: { [key: string]: EnvVar } = {};
      Object.entries(fetchedVars).forEach(([key, value]) => {
        formattedVars[key] = { value: value, path: "" };
      });
      setEnvVars(formattedVars);
      setUseBundledDfx(dfxPreference);

      updateDfxInfo(dfxPreference, dfxVersions);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setError("Failed to load settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateDfxInfo = (
    preference: boolean,
    versions: { system: string; bundled: string }
  ) => {
    if (preference) {
      setDfxVersion(versions.bundled);
      setDfxType("Bundled");
    } else {
      setDfxVersion(versions.system);
      setDfxType("System");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleDfxPreferenceChange = async (checked: boolean) => {
    try {
      setIsLoading(true);
      await window.awesomeApi.setDfxPreference(checked);
      setUseBundledDfx(checked);
      const dfxVersions = await window.awesomeApi.getDfxVersions();
      updateDfxInfo(checked, dfxVersions);
      setShowFallbackAlert(false);
      setError(null);
      await window.awesomeApi.reloadApplication();
    } catch (error) {
      console.error("Error updating DFX preference:", error);
      setError(
        "Failed to update DFX preference. The application may have fallen back to system DFX."
      );
      setShowFallbackAlert(true);
      const currentPreference = await window.awesomeApi.getDfxPreference();
      const dfxVersions = await window.awesomeApi.getDfxVersions();
      setUseBundledDfx(currentPreference);
      updateDfxInfo(currentPreference, dfxVersions);
    } finally {
      setIsLoading(false);
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <div className="flex items-center justify-between space-x-4 p-3 rounded-lg border w-[400px]">
          <div className="flex items-center space-x-3">
            <Label htmlFor="dfx-preference" className="text-sm font-medium">
              Use Bundled DFX
            </Label>
            <Switch
              id="dfx-preference"
              checked={useBundledDfx}
              onCheckedChange={handleDfxPreferenceChange}
              disabled={isLoading}
            />
          </div>
          {!isLoading && (
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="px-2 py-1">
                {dfxType}
              </Badge>
              <Badge variant="outline" className="px-2 py-1">
                {dfxVersion}
              </Badge>
            </div>
          )}
        </div>
      </div>
      <Separator />

      <ScrollArea className="h-[calc(90vh-90px)] overflow-y-auto relative">
        <div className="space-y-4">{renderEnvVarFields()}</div>
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
