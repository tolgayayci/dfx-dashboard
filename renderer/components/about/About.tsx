import { useEffect, useState } from "react";

import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { Switch } from "@components/ui/switch";
import { BarChart2 } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@components/ui/card";

import { Button } from "@components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function EnvironmentVariables() {
  const [dfxDashboardAppVersion, setDfxDashboardAppVersion] =
    useState("Loading...");
  const [dfxVersion, setDfxVersion] = useState("Loading...");
  const [dfxvmVersion, setDfxvmVersion] = useState("Loading...");
  const [dfxError, setDfxError] = useState(null);
  const [dfxvmError, setDfxvmError] = useState(null);
  const [trackingAllowed, setTrackingAllowed] = useState(false);

  useEffect(() => {
    async function fetchVersions() {
      try {
        const appVersion = await window.awesomeApi.getAppVersion();
        setDfxDashboardAppVersion(appVersion);

        const { dfx, dfxvm, dfxError, dfxvmError } =
          await window.awesomeApi.getDfxVersion();
        setDfxVersion(dfx);
        setDfxvmVersion(dfxvm);
        setDfxError(dfxError);
        setDfxvmError(dfxvmError);
      } catch (error) {
        console.error("Error fetching versions:", error);
        setDfxError("Failed to fetch versions. Please try again.");
        setDfxvmError("Failed to fetch versions. Please try again.");
      }
    }

    fetchVersions();
  }, []);

  async function openExternalLink(url: string) {
    try {
      await window.awesomeApi.openExternalLink(url);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const trackingPreference = await window.awesomeApi.getTrackingAllowed();
        setTrackingAllowed(trackingPreference);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleTrackingPreferenceChange = async (checked: boolean) => {
    try {
      await window.awesomeApi.setTrackingAllowed(checked);
      setTrackingAllowed(checked);
      await window.awesomeApi.reloadApplication();
    } catch (error) {
      console.error("Error updating tracking preference:", error);
    }
  };

  const handlePrivacyPolicyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.awesomeApi.openExternalLink(
      "https://dfx-dashboard-docs.netlify.app/privacy-policy"
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-90px)] space-y-4">
      <div className="w-full">
        <div className="space-y-4">
          <div className="flex flex-col justify-between space-y-3">
            <Label className="w-full">Dfx Dashboard App Version</Label>
            <Input
              value={dfxDashboardAppVersion}
              placeholder="Loading..."
              disabled
            />
          </div>
          <div className="flex flex-col justify-between space-y-3">
            <Label className="w-full">dfx Version</Label>
            <Input value={dfxVersion} placeholder="Loading..." disabled />
            {dfxError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{dfxError}</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="flex flex-col justify-between space-y-3">
            <Label className="w-full">dfxvm Version</Label>
            <Input value={dfxvmVersion} placeholder="Loading..." disabled />
            {dfxvmError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{dfxvmError}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center border p-4 rounded-lg mb-5">
        <div className="flex-shrink-0 mr-4">
          <BarChart2 className="h-7 w-7 text-primary" />
        </div>
        <div className="flex-grow">
          <Label htmlFor="tracking-preference" className="text-sm font-medium">
            Allow Analytics
          </Label>
          <p className="text-sm text-muted-foreground mb-1 mt-1">
            {trackingAllowed
              ? "Analytics are currently enabled. We collect anonymous usage data to improve our service."
              : "Analytics are currently disabled. Enable to help us improve our service."}
          </p>
          <a
            href="/privacy-policy"
            onClick={handlePrivacyPolicyClick}
            className="text-xs text-primary hover:text-foreground cursor-pointer"
          >
            View our Privacy Policy
          </a>
        </div>
        <div className="flex-shrink-0 ml-4">
          <Switch
            id="tracking-preference"
            checked={trackingAllowed}
            onCheckedChange={handleTrackingPreferenceChange}
          />
        </div>
      </div>
      <div className="w-full grid grid-cols-3 gap-4 pt-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Make a Feature Request</CardTitle>
            <CardDescription>
              You can request a feature by creating an issue on Github.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                openExternalLink(
                  "https://github.com/tolgayayci/dfx-dashboard/issues/new?assignees=tolgayayci&labels=feature-request&projects=&template=feature-request.md&title=%5BFEAT%5D"
                )
              }
            >
              Visit Github
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Report a Bug</CardTitle>
            <CardDescription>
              You can report a bug by creating an issue on Github.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                openExternalLink(
                  "https://github.com/tolgayayci/dfx-dashboard/issues/new?assignees=tolgayayci&labels=bug&projects=&template=bug-report.md&title=%5BBUG%5D"
                )
              }
            >
              Visit Github
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Review Release Notes</CardTitle>
            <CardDescription>
              You can review the release notes on Github for this version.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                openExternalLink(
                  `https://github.com/tolgayayci/dfx-dashboard/releases/tag/v${dfxDashboardAppVersion}`
                )
              }
            >
              Visit Github
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
