import { useEffect, useState } from "react";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import { useTheme } from "next-themes";
import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { useToast } from "@components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { AlertCircle, Save, RotateCcw } from "lucide-react";
import { Skeleton } from "@components/ui/skeleton";

export default function DfxComponent({ projectPath }) {
  const [dfxJson, setDfxJson] = useState(null);
  const [localDfxJson, setLocalDfxJson] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const { toast } = useToast();

  /// Function to read the JSON file
  const readJson = async () => {
    if (projectPath) {
      const data = await window.awesomeApi.jsonRead(projectPath, "/dfx.json");
      if (data) {
        setDfxJson(data);
        setLocalDfxJson(data);
        setIsLoading(false);
      } else {
        console.error("Failed to read dfx.json from the provided path");
        setError("Failed to read dfx.json from the provided path");
        setIsLoading(false);
      }
    } else {
      console.error("No project path provided");
      setError("No project path provided");
      setIsLoading(false);
    }
  };

  // Function to update the JSON file
  const updateJson = async (newData) => {
    console.log(newData);
    if (projectPath) {
      const success = await window.awesomeApi.jsonWrite(
        projectPath,
        "/dfx.json",
        newData
      );
      if (success) {
        console.log("File updated successfully");
        return true;
      } else {
        console.error("Failed to update dfx.json at the provided path");
        return false;
      }
    } else {
      console.error("No project path provided");
      return false;
    }
  };

  useEffect(() => {
    readJson();
  }, [projectPath]); // Re-run when projectPath changes

  const handleSave = async () => {
    try {
      console.log(localDfxJson); 
      const success = await updateJson(localDfxJson);
      if (success) {
        setDfxJson(localDfxJson);
        toast({
          title: "Changes Saved",
          description: "The dfx.json file has been updated.",
          duration: 2000,
        });
      } else {
        setError("Failed to save changes. Please try again.");
      }
    } catch (err) {
      setError("Failed to save changes. Please try again.");
    }
  };

  const handleReset = () => {
    setLocalDfxJson(dfxJson);
    setError(null);
    toast({
      title: "Changes Reset",
      description: "The editor has been reset to the last saved state.",
      duration: 2000,
    });
  };

  const editorColors = {
    background: "hsl(var(--background))",
    default: "hsl(var(--foreground))",
    string: "hsl(var(--primary))",
    number: "hsl(var(--secondary))",
    colon: "hsl(var(--muted-foreground))",
    keys: theme === "dark" ? "#4299e1" : "#3182ce", // Blue hex color
    keys_whiteSpace: theme === "dark" ? "#4299e1" : "#3182ce",
    primitive: "hsl(var(--destructive))",
  };

  return (
    <div className="w-full">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <div>
            <h3 className="text-xl font-semibold mb-1">dfx.json</h3>
            {isLoading ? (
              <Skeleton className="h-4 w-[250px]" />
            ) : (
              projectPath && (
                <p className="text-sm text-muted-foreground">{`${projectPath}/dfx.json`}</p>
              )
            )}
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {localDfxJson ? (
          <JSONInput
            id="dfx_json"
            placeholder={localDfxJson}
            locale={locale}
            height="calc(90vh - 260px)"
            width="100%"
            onChange={(value) => {
              setLocalDfxJson(value.jsObject);
              setError(null);
            }}
            theme={theme === "dark" ? "dark_vscode_tribute" : "light_mitsuketa_tribute"}
            colors={{
              background: theme === "dark" ? "#1e1e1e" : "#ffffff",
              ...editorColors,
            }}
            style={{
              contentBox: {
                fontSize: "14px",
                fontFamily: "var(--font-mono)",
                fontWeight: "500",
              },
            }}
          />
        ) : (
          <div>No project path provided or failed to load data.</div>
        )}
      </Card>
    </div>
  );
}
