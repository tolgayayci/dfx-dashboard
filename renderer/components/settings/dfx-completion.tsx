import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Switch } from "@components/ui/switch";
import { Badge } from "@components/ui/badge";
import { Alert, AlertDescription } from "@components/ui/alert";
import { Separator } from "@components/ui/separator";
import { ScrollArea } from "@components/ui/scroll-area";
import { toast } from "@components/ui/use-toast";
import { 
  Terminal, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Loader2,
  Copy,
  ExternalLink 
} from "lucide-react";

interface ShellInfo {
  shell: string;
  shellName: string;
  supported: boolean;
}

export default function DfxCompletion() {
  const [shellInfo, setShellInfo] = useState<ShellInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [completionEnabled, setCompletionEnabled] = useState(false);

  useEffect(() => {
    detectShell();
  }, []);

  const detectShell = async () => {
    setIsLoading(true);
    try {
      const result = await window.awesomeApi.settingsDetectShell();
      if (result.success && result.data) {
        setShellInfo(result.data);
      } else {
        throw new Error(result.error || "Failed to detect shell");
      }
    } catch (error) {
      console.error("Error detecting shell:", error);
      toast({
        title: "Shell Detection Failed",
        description: "Could not detect your shell environment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompletionToggle = async (enabled: boolean) => {
    setIsSettingUp(true);
    try {
      const result = await window.awesomeApi.settingsSetupCompletion(enabled);
      
      if (result.success) {
        setCompletionEnabled(enabled);
        toast({
          title: enabled ? "Completion Enabled" : "Completion Disabled",
          description: result.data,
        });
      } else {
        throw new Error(result.error || "Failed to setup completion");
      }
    } catch (error) {
      console.error("Error setting up completion:", error);
      toast({
        title: "Setup Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSettingUp(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Command copied to clipboard",
    });
  };

  const getManualInstructions = () => {
    if (!shellInfo) return null;

    const instructions = {
      bash: {
        configFile: "~/.bashrc (or ~/.bash_profile on macOS)",
        command: 'eval "$(dfx completion bash)"',
        description: "Add this line to your bash configuration file:"
      },
      zsh: {
        configFile: "~/.zshrc",
        command: 'eval "$(dfx completion zsh)"',
        description: "Add this line to your zsh configuration file:"
      },
      fish: {
        configFile: "~/.config/fish/completions/dfx.fish",
        command: "dfx completion fish > ~/.config/fish/completions/dfx.fish",
        description: "Run this command to set up fish completions:"
      }
    };

    return instructions[shellInfo.shellName as keyof typeof instructions];
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-160px)] w-full rounded-md border p-4 flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
          <Terminal className="h-8 w-8 text-blue-600" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-foreground">Detecting Shell Environment</p>
          <p className="text-sm text-muted-foreground">
            Checking your shell configuration...
          </p>
        </div>
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3 p-6">
          <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
            <Terminal className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">DFX Shell Completion</h2>
            <p className="text-sm text-muted-foreground">
              Enable auto-completion for dfx commands in your terminal
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Shell Detection */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Detected Shell</h4>
            <div className="flex items-center gap-3">
              <Badge variant={shellInfo?.supported ? "default" : "secondary"}>
                {shellInfo?.shellName || "Unknown"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {shellInfo?.shell}
              </span>
              {shellInfo?.supported ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              )}
            </div>
          </div>

          <Separator />

          {/* Auto-setup Toggle */}
          {shellInfo?.supported && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Auto-setup Completion</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatically configure dfx completion for your shell
                  </p>
                </div>
                <Switch
                  checked={completionEnabled}
                  onCheckedChange={handleCompletionToggle}
                  disabled={isSettingUp}
                />
              </div>
              
              {isSettingUp && (
                <Alert>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertDescription>
                    Setting up completion for {shellInfo.shellName}...
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Unsupported Shell Warning */}
          {!shellInfo?.supported && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your shell ({shellInfo?.shellName}) is not supported for auto-setup. 
                Please use the manual instructions below.
              </AlertDescription>
            </Alert>
          )}

          <Separator />

          {/* Manual Instructions */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Info className="h-4 w-4" />
              Manual Setup Instructions
            </h4>
            
            {getManualInstructions() ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {getManualInstructions()?.description}
                </p>
                
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono">
                      {getManualInstructions()?.command}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(getManualInstructions()?.command || "")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Configuration file: <code>{getManualInstructions()?.configFile}</code>
                </p>
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Manual instructions not available for your shell. 
                  Please refer to the dfx documentation.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Separator />

          {/* Additional Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Additional Information</h4>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                • Completion provides auto-suggestions for dfx commands, subcommands, and options
              </p>
              <p>
                • After setup, restart your terminal or run <code>source ~/.{shellInfo?.shellName}rc</code>
              </p>
              <p>
                • You can disable completion by removing the added lines from your shell config
              </p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.awesomeApi.openExternalLink("https://internetcomputer.org/docs/current/developer-docs/setup/install/")}
              className="mt-3"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View DFX Documentation
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
} 