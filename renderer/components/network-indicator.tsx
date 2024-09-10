"use client";

import React, { useEffect, useState } from "react";
import { Switch } from "@components/ui/switch";
import { Label } from "@components/ui/label";
import { useToast } from "@components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { Button } from "@components/ui/button";

const NetworkIndicator: React.FC = () => {
  const [isIcNetwork, setIsIcNetwork] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    window.awesomeApi.getNetworkPreference().then((preference) => {
      setIsIcNetwork(preference === "ic");
    });
  }, []);

  const handleNetworkChange = async (checked: boolean) => {
    const newPreference = checked ? "ic" : "local";
    await window.awesomeApi.setNetworkPreference(newPreference);
    setIsIcNetwork(checked);

    toast({
      title: "Network Changed",
      description: `Switched to ${checked ? "IC Mainnet" : "Local Network"}`,
      duration: 2000,
    });

    await window.awesomeApi.reloadApplication();
  };

  return (
    <div className="p-4 border-t space-y-3">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">Network</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isIcNetwork
                    ? "Calls are being made to the Internet Computer mainnet"
                    : "Using local network for development"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <Button
          variant="outline"
          className="w-full p-0 overflow-hidden relative"
          onClick={() => handleNetworkChange(!isIcNetwork)}
        >
          <span
            className={`flex-1 flex items-center justify-center px-2 h-full text-xs font-medium z-50 ${
              !isIcNetwork ? " text-primary-foreground" : ""
            }`}
          >
            Local
          </span>
          <span
            className={`flex-1 flex items-center justify-center px-2 h-full text-xs font-medium z-50 ${
              isIcNetwork ? "text-white" : ""
            }`}
          >
            IC
          </span>
          <div
            className={`absolute inset-0 bg-primary transition-all duration-300 ease-in-out`}
            style={{
              transform: isIcNetwork ? "translateX(100%)" : "translateX(0)",
              width: "50%",
              borderRadius: "0.25rem",
            }}
          />
        </Button>
      </div>
    </div>
  );
};

export default NetworkIndicator;
