import React, { useEffect, useState } from "react";
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { Switch } from "@components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { Badge } from "@components/ui/badge";
import { Separator } from "@components/ui/separator";
import { Loader2 } from "lucide-react";
import { useToast } from "@components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { PlusCircle, Package, Trash2 } from "lucide-react";
import { dfxVersions } from "@lib/dfx-versions";

interface DfxVersion {
  version: string;
  installed: boolean;
  isDefault?: boolean;
}

function VercelAvatar({ version }: { version: string }) {
  return (
    <div className="relative w-9 h-9 overflow-hidden rounded-full">
      <Image
        src={`https://avatar.vercel.sh/${version}.png`}
        alt={`Avatar for version ${version}`}
        layout="fill"
        objectFit="cover"
      />
    </div>
  );
}

export default function VersionManager() {
  const [availableVersions, setAvailableVersions] = useState<DfxVersion[]>([]);
  const [installedVersions, setInstalledVersions] = useState<
    { id: string; number: string }[]
  >([]);
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [activeVersion, setActiveVersion] = useState<string | null>(null);
  const [useBundledDfx, setUseBundledDfx] = useState(false);
  const [dfxVersion, setDfxVersion] = useState<string>("");
  const [dfxType, setDfxType] = useState<string>("");
  const [showFallbackAlert, setShowFallbackAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [versionToUninstall, setVersionToUninstall] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dfxPreference, dfxVersions] = await Promise.all([
        window.awesomeApi.getDfxPreference(),
        window.awesomeApi.getDfxVersions(),
      ]);

      setUseBundledDfx(dfxPreference);
      updateDfxInfo(dfxPreference, dfxVersions);

      await Promise.all([
        fetchGithubReleases(),
        fetchInstalledVersions(),
        fetchActiveVersion(),
      ]);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setError("Failed to load settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGithubReleases = async () => {
    try {
      const response = await fetch(
        "https://api.github.com/repos/dfinity/sdk/releases?per_page=100"
      );
      const releases = await response.json();

      if (Array.isArray(releases) && releases.length > 0) {
        const versions: DfxVersion[] = releases.map((release: any) => ({
          version: release.tag_name,
          installed: false,
          isDefault: false,
        }));
        setAvailableVersions(versions);
        setShowFallbackAlert(false);
      } else {
        throw new Error("Invalid response format from GitHub API");
      }
    } catch (error) {
      console.error("Error fetching GitHub releases:", error);
      const localVersions: DfxVersion[] = dfxVersions.map((version) => ({
        version,
        installed: false,
        isDefault: false,
      }));
      setAvailableVersions(localVersions);
      setShowFallbackAlert(true);
    }
  };

  const fetchInstalledVersions = async () => {
    try {
      const output = await window.awesomeApi.runCommand("dfxvm list");
      const versions = output
        .split("\n")
        .filter(Boolean)
        .map((v, index) => ({
          id: `${index + 1}`,
          number: v.trim().replace(" (default)", ""),
        }));
      setInstalledVersions(versions);
      setAvailableVersions((prev) =>
        prev.map((v) => ({
          ...v,
          installed: versions.some((iv) => iv.number === v.version),
        }))
      );
    } catch (error) {
      console.error("Error fetching installed versions:", error);
      setError("Failed to fetch installed DFX versions.");
    }
  };

  const fetchActiveVersion = async () => {
    try {
      const output = await window.awesomeApi.runCommand("dfxvm default");
      const activeVersionNumber = output.trim();

      setActiveVersion(activeVersionNumber || null);
      setAvailableVersions((prev) =>
        prev.map((v) => ({
          ...v,
          isDefault: v.version === activeVersionNumber,
        }))
      );
    } catch (error) {
      console.error("Error fetching active version:", error);
      setError("Failed to fetch active DFX version.");
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

  const handleInstall = async () => {
    if (selectedVersion) {
      setIsInstalling(true);
      try {
        await window.awesomeApi.runCommand(`dfxvm install ${selectedVersion}`);
        await fetchInstalledVersions();
        setError(null);
        toast({
          title: "Installation Successful",
          description: `Version ${selectedVersion} has been installed.`,
          duration: 2000,
        });
        setIsInstallModalOpen(false);
      } catch (error) {
        console.error("Error installing version:", error);
        setError("Failed to install version. Please try again.");
      } finally {
        setIsInstalling(false);
      }
    }
  };

  const handleActivate = async (id: string) => {
    const versionToActivate = installedVersions.find(
      (v) => v.id === id
    )?.number;
    if (!versionToActivate) return;

    setIsLoading(true);
    try {
      await window.awesomeApi.runCommand(`dfxvm default ${versionToActivate}`);
      await fetchActiveVersion();
      setError(null);
      toast({
        title: "Version Activated",
        description: `Version ${versionToActivate} has been set as the default.`,
        duration: 2000,
      });
      await window.awesomeApi.reloadApplication();
    } catch (error) {
      console.error("Error activating version:", error);
      setError("Failed to activate version. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUninstall = async (version: string) => {
    setVersionToUninstall(version);
  };

  const confirmUninstall = async () => {
    if (versionToUninstall) {
      setIsLoading(true);
      try {
        await window.awesomeApi.runCommand(
          `dfxvm uninstall ${versionToUninstall}`
        );
        await fetchInstalledVersions();
        setError(null);
        toast({
          title: "Uninstallation Successful",
          description: `Version ${versionToUninstall} has been uninstalled.`,
          duration: 2000,
        });
        setVersionToUninstall(null);
        await window.awesomeApi.reloadApplication();
      } catch (error) {
        console.error("Error uninstalling version:", error);
        setError("Failed to uninstall version. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredVersions = installedVersions.filter((v) =>
    v.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedVersions = [...filteredVersions].sort((a, b) => {
    if (a.number === activeVersion) return -1;
    if (b.number === activeVersion) return 1;
    return 0;
  });

  const handleSwitchToSystemDfx = async () => {
    await handleDfxPreferenceChange(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">
              {useBundledDfx ? "Bundled DFX" : "Installed Versions"}
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setIsInstallModalOpen(true)}
                variant="outline"
                className="h-10"
                disabled={useBundledDfx}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Install New Version
              </Button>
              <div className="flex items-center space-x-4 p-2 rounded-md border h-10 px-3">
                {" "}
                {/* Added h-10 for consistent height */}
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
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-[calc(100vh-270px)]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : useBundledDfx ? (
              <div className="h-[calc(100vh-270px)] w-full rounded-md border p-4 flex flex-col items-center justify-center space-y-4 mt-3">
                <Package className="h-12 w-12" />

                <p className="text-lg">
                  Using Bundled DFX Version: {dfxVersion}
                </p>
                <p className="text-sm text-gray-600 text-center max-w-md">
                  Bundled DFX is a pre-packaged version of the DFINITY Canister
                  SDK that comes with this application. It ensures compatibility
                  and simplifies setup, but may not always be the latest version
                  available.
                </p>
                <Button variant="outline" onClick={handleSwitchToSystemDfx}>
                  Switch to System DFX
                </Button>
              </div>
            ) : (
              <>
                <Input
                  placeholder="Search versions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-4 mt-3"
                />
                <ScrollArea className="h-[calc(100vh-320px)] w-full rounded-md border p-4">
                  <div className="space-y-4">
                    {sortedVersions.map((version) => (
                      <div
                        key={version.id}
                        className="flex items-center justify-between space-x-4"
                      >
                        <div className="flex items-center space-x-4">
                          <VercelAvatar version={version.number} />
                          <span className="text-sm font-medium">
                            {version.number}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant={
                              activeVersion === version.number
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className="w-24"
                            onClick={() => handleActivate(version.id)}
                          >
                            {activeVersion === version.number
                              ? "Active"
                              : "Activate"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUninstall(version.number)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isInstallModalOpen} onOpenChange={setIsInstallModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Install New DFX Version</DialogTitle>
            <DialogDescription>
              Select a version to install from the available sources.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="flex items-center space-x-2">
              <Badge variant={showFallbackAlert ? "secondary" : "default"}>
                {showFallbackAlert ? "Local" : "GitHub"}
              </Badge>
              <span className="text-sm text-gray-500">
                {showFallbackAlert
                  ? "Using local version list"
                  : "Versions fetched from GitHub"}
              </span>
            </div>
            <Select onValueChange={setSelectedVersion} value={selectedVersion}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select version to install" />
              </SelectTrigger>
              <SelectContent>
                {availableVersions
                  .filter((v) => !v.installed)
                  .map((version) => (
                    <SelectItem key={version.version} value={version.version}>
                      {version.version}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              {showFallbackAlert
                ? "The local version list is used when GitHub data cannot be fetched due to a problem. This may be due to network issues or if the GitHub API rate limit is exceeded."
                : "These versions are fetched from the DFINITY SDK GitHub repository."}
            </p>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button
              onClick={handleInstall}
              disabled={!selectedVersion || isInstalling}
            >
              {isInstalling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Installing...
                </>
              ) : (
                "Install"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showFallbackAlert && (
        <Alert variant="warning" className="mt-4">
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Failed to update DFX preference. The application may have fallen
            back to system DFX.
          </AlertDescription>
        </Alert>
      )}

      <Dialog
        open={!!versionToUninstall}
        onOpenChange={() => setVersionToUninstall(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Uninstall DFX Version</DialogTitle>
            <DialogDescription>
              Are you sure you want to uninstall DFX version{" "}
              {versionToUninstall}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVersionToUninstall(null)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmUninstall}>
              Uninstall
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
