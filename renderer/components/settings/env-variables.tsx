import { useEffect, useState } from "react";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { CodeIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { Switch } from "@components/ui/switch";

interface EnvVar {
  value: string;
  path?: string;
}

export default function EnvironmentVariables() {
  const [envVars, setEnvVars] = useState<{ [key: string]: EnvVar }>({});
  const [useBundledDfx, setUseBundledDfx] = useState(false);
  const [customDfxPath, setCustomDfxPath] = useState("");
  const [systemDfxAvailable, setSystemDfxAvailable] = useState(false);
  const [bundledDfxPath, setBundledDfxPath] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const defaultKeys = [
    "CUSTOM_DFX_PATH",
    "CANISTER_CANDID_PATH",
    "CANISTER_ID",
    "DFX_CONFIG_ROOT",
    "DFX_INSTALLATION_ROOT",
    "DFX_VERSION",
    "DFX_MOC_PATH",
    "DFX_WARNING",
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

      const bundledDfxUsed = await window.awesomeApi.getUseBundledDfx();
      setUseBundledDfx(bundledDfxUsed);

      const customPath = await window.awesomeApi.getCustomDfxPath();
      setCustomDfxPath(customPath);
      setEnvVars((prevEnvVars) => ({
        ...prevEnvVars,
        CUSTOM_DFX_PATH: { value: customPath, path: "" },
      }));

      const systemDfxCheck = await window.awesomeApi.checkSystemDfx();
      setSystemDfxAvailable(systemDfxCheck);

      const bundledPath = await window.awesomeApi.getBundledDfxPath();
      setBundledDfxPath(bundledPath);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setError("Failed to load settings. Please try again.");
    } finally {
      setIsLoading(false);
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
    if (key === "CUSTOM_DFX_PATH") {
      await handleCustomDfxPathChange({
        target: { value: customDfxPath },
      } as React.ChangeEvent<HTMLInputElement>);
      return;
    }

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

  const handleUseBundledDfxChange = async (checked: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await window.awesomeApi.setUseBundledDfx(checked);
      if (result) {
        setUseBundledDfx(checked);
        if (checked) {
          await window.awesomeApi.setupBundledDfx();
          // Clear custom DFX path when switching to bundled DFX
          setCustomDfxPath("");
          setEnvVars((prevEnvVars) => ({
            ...prevEnvVars,
            CUSTOM_DFX_PATH: { value: "", path: "" },
          }));
        }
        await fetchData(); // Refresh data after changing DFX
        await window.awesomeApi.reloadApplication(); // Reload the app after changing DFX
      } else {
        throw new Error("Failed to change DFX settings");
      }
    } catch (error) {
      console.error("Error changing bundled DFX usage:", error);
      setError("Failed to change DFX settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomDfxPathChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const path = e.target.value;
    setCustomDfxPath(path);
    setEnvVars((prevEnvVars) => ({
      ...prevEnvVars,
      CUSTOM_DFX_PATH: { value: path, path: "" },
    }));

    if (!useBundledDfx) {
      setIsLoading(true);
      setError(null);
      try {
        await window.awesomeApi.setCustomDfxPath(path);
        await fetchData(); // Refresh data after changing custom DFX path
        await window.awesomeApi.reloadApplication(); // Reload the app after changing custom DFX path
      } catch (error) {
        console.error("Error setting custom DFX path:", error);
        setError("Failed to set custom DFX path. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderEnvVarFields = () => {
    return defaultKeys.map((key) => (
      <div key={key} className="flex items-center justify-between space-x-4">
        <Label className="w-72">{key}</Label>
        <Input
          value={
            key === "CUSTOM_DFX_PATH"
              ? customDfxPath
              : envVars[key]?.value || ""
          }
          placeholder={!envVars[key] ? "Not Defined" : ""}
          onChange={(e) =>
            key === "CUSTOM_DFX_PATH"
              ? handleCustomDfxPathChange(e)
              : handleInputChange(key, e.target.value)
          }
          disabled={key === "CUSTOM_DFX_PATH" && (useBundledDfx || isLoading)}
        />
        <Button
          onClick={() => updateEnvVar(key)}
          disabled={key === "CUSTOM_DFX_PATH" && useBundledDfx}
        >
          Update
        </Button>
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-106px)]">
      <Alert className="mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CodeIcon className="h-5 w-5" />
            <div>
              <AlertTitle className="mb-2">Use Bundled Dfx</AlertTitle>
              <AlertDescription>
                DFX GUI uses dfx version{" "}
                <span className="font-semibold">0.21.0</span> by default. If you
                want to use a custom DFX version, you can toggle the switch.
              </AlertDescription>
            </div>
          </div>
          <Switch
            id="use-bundled-dfx"
            checked={useBundledDfx}
            onCheckedChange={handleUseBundledDfxChange}
            disabled={isLoading}
          />
        </div>
        {!useBundledDfx && !systemDfxAvailable && (
          <div className="mt-2 text-red-500">
            Warning: System DFX is not available. Please provide a valid custom
            DFX path in the environment variables below.
          </div>
        )}
        {error && <div className="mt-2 text-red-500">{error}</div>}
        {isLoading && <div className="mt-2">Loading...</div>}
      </Alert>

      <ScrollArea className="h-[calc(85vh-180px)] overflow-y-auto mt-6">
        <div className="space-y-4">{renderEnvVarFields()}</div>
        <ScrollBar />
      </ScrollArea>
    </div>
  );
}
