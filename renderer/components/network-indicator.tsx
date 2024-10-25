"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CaretSortIcon, CheckIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Globe } from "lucide-react";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { useToast } from "@components/ui/use-toast";
import { NetworkData } from "./network/types";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface NetworkSwitcherProps extends PopoverTriggerProps {}

export default function NetworkIndicator({ className }: NetworkSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedNetwork, setSelectedNetwork] = React.useState<string>("");
  const [networkData, setNetworkData] = useState<NetworkData>({});

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchNetworks();
    checkCurrentNetwork();
  }, []);

  async function fetchNetworks() {
    try {
      const networks = await window.awesomeApi.getNetworks();
      setNetworkData(networks);
    } catch (error) {
      console.error("Error fetching networks:", error);
    }
  }

  async function checkCurrentNetwork() {
    try {
      const currentNetwork = await window.awesomeApi.getNetworkPreference();
      setSelectedNetwork(currentNetwork);
    } catch (error) {
      console.error("Error checking current network:", error);
    }
  }

  async function changeNetwork(newNetwork: string) {
    try {
      await window.awesomeApi.setNetworkPreference(newNetwork);
      setSelectedNetwork(newNetwork);

      toast({
        title: "Network Changed",
        description: `Switched to ${newNetwork}`,
        duration: 2000,
      });

      await window.awesomeApi.reloadApplication();
    } catch (error) {
      console.error("Error changing network:", error);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a network"
          className={cn("w-[140px] justify-between", className)}
        >
          <Globe className="mr-2 h-4 w-4" />
          <span className="truncate flex-grow text-left">
            {selectedNetwork || "No Network"}
          </span>
          <CaretSortIcon className="ml-2 h-4 w-4 flex-shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search network..." />
            <CommandEmpty>No network found.</CommandEmpty>
            <CommandGroup heading="Current Network">
              <CommandItem key={selectedNetwork} className="text-sm">
                <Globe className="mr-2 h-4 w-4" />
                {selectedNetwork}
                <CheckIcon className="ml-auto h-4 w-4 opacity-100" />
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Available Networks">
              {Object.entries(networkData).map(([name, details]) => (
                <CommandItem
                  key={name}
                  onSelect={() => {
                    if (selectedNetwork !== name) {
                      changeNetwork(name);
                    }
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  {name}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {details.type}
                  </span>
                  <CheckIcon
                    className={cn(
                      "ml-2 h-4 w-4",
                      selectedNetwork === name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  router.push("/networks");
                }}
              >
                <UpdateIcon className="mr-2 h-5 w-5" />
                Manage Networks
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
