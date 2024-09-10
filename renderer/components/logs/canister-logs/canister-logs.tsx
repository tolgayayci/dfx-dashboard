import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns, Log } from "./columns";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Loader2, Package, AlertCircle } from "lucide-react";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import useProjects from "renderer/hooks/useProjects";

interface Canister {
  name: string;
  projectName: string;
  path: string;
}

export default function CanisterLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [allCanisters, setAllCanisters] = useState<Canister[]>([]);
  const [selectedCanister, setSelectedCanister] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string>("");
  const projects = useProjects();

  async function checkCanisters(projectPath: string) {
    try {
      const result = await window.awesomeApi.listCanisters(projectPath);
      const canistersArray = Object.keys(result.canisters).map((key) => ({
        name: key,
        ...result.canisters[key],
        projectName: projects.find((p) => p.path === projectPath)?.name,
        path: projectPath,
      }));
      setAllCanisters((prevCanisters) => {
        const newCanisters = canistersArray.filter(
          (newCanister) =>
            !prevCanisters.some(
              (prevCanister) =>
                prevCanister.name === newCanister.name &&
                prevCanister.projectName === newCanister.projectName
            )
        );
        return [...prevCanisters, ...newCanisters];
      });
    } catch (error) {
      console.log("Error invoking remote method:", error);
      setError("Error fetching canisters. Please try again.");
      setErrorDetails(JSON.stringify(error, null, 2));
    }
  }

  useEffect(() => {
    setIsInitialLoading(true);
    setIsLoading(true);
    setAllCanisters([]);
    const fetchCanisters = async () => {
      for (const project of projects) {
        await checkCanisters(project.path);
      }
      setIsLoading(false);
      setIsInitialLoading(false);
    };
    fetchCanisters();
  }, [projects]);

  useEffect(() => {
    if (allCanisters.length > 0 && !selectedCanister) {
      setSelectedCanister(allCanisters[0].name);
    }
  }, [allCanisters]);

  useEffect(() => {
    if (selectedCanister) {
      fetchLogs(selectedCanister);
    }
  }, [selectedCanister]);

  const fetchLogs = async (canisterName: string) => {
    setIsLoading(true);
    setError(null);
    setErrorDetails("");
    try {
      const selectedCanisterObj = allCanisters.find(c => c.name === canisterName);
      if (!selectedCanisterObj) {
        throw new Error("Selected canister not found");
      }
      const result = await window.awesomeApi.runDfxCommand("canister", "logs", [
        canisterName,
      ], "", selectedCanisterObj.path);
      console.log(result)
      const parsedLogs = parseLogs(result);
      setLogs(parsedLogs);
      console.log(parsedLogs)
    } catch (error) {
      console.error("Error fetching logs:", error);
      setError(`Error fetching logs for ${canisterName}`);
      setErrorDetails(JSON.stringify({
        error: "Error fetching logs",
        details: error instanceof Error ? error.message : String(error)
      }, null, 2));
      setLogs([]);
    }
    setIsLoading(false);
  };

  const parseLogs = (rawLogs: string): Log[] => {
    if (!rawLogs || rawLogs.trim() === "") {
      return [];
    }
    
    const logLines = rawLogs.split("\n");
    return logLines
      .filter(line => line.trim() !== "")
      .map((line, index) => {
        const match = line.match(
          /\[(\d+)\. (\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}\.\d+Z)\]: (.+)/
        );
        if (match) {
          return {
            count: parseInt(match[1]),
            date: match[2],
            time: match[3],
            message: match[4],
          };
        }
        return {
          count: index + 1,
          date: "",
          time: "",
          message: line,
        };
      });
  };

  const filteredLogs = logs.filter((log) =>
    log.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderErrorContent = (errorMessage: string) => {
    return errorMessage.split("\n").map((line, index) => (
      <div key={index}>
        {line
          .split(/(\s--[\w-]+(?:\s+<[\w_]+>)?|\s-\w(?:\s+<[\w_]+>)?)/g)
          .map((part, partIndex) => {
            if (part.trim().match(/^--[\w-]+(?:\s+<[\w_]+>)?$/)) {
              return (
                <span key={partIndex} className="text-blue-400">
                  {part}
                </span>
              );
            } else if (part.trim().match(/^-\w(?:\s+<[\w_]+>)?$/)) {
              return (
                <span key={partIndex} className="text-blue-400">
                  {part}
                </span>
              );
            } else if (part.trim() === "") {
              return <br key={partIndex} />;
            } else {
              return <span key={partIndex}>{part}</span>;
            }
          })}
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-90px)]">
      <div className="flex items-center mt-2 mb-6 space-x-2">
        <Input
          placeholder="Search Between Canister Logs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        <Select value={selectedCanister} onValueChange={setSelectedCanister}>
          <SelectTrigger className="w-[350px]">
            <SelectValue placeholder="Select Canister" />
          </SelectTrigger>
          <SelectContent>
            {allCanisters.map((canister) => (
              <SelectItem key={canister.name} value={canister.name}>
                {canister.name} ({canister.projectName})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isInitialLoading || isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading logs...</span>
        </div>
      ) : error ? (
        <div className="h-[calc(100vh-240px)] w-full rounded-md border p-4 flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-lg text-red-500">{error}</p>
          <p className="text-sm text-gray-600 text-center max-w-md">
            There was an error fetching the logs for the selected canister.
            This could be due to network issues or problems with the canister itself.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Click to See Error Details</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Error Details</DialogTitle>
              </DialogHeader>
              <div className="bg-red-100 text-red-500 p-4 rounded-md -mt-1">
                <ScrollArea className="h-[calc(80vh-106px)]">
                  <pre className="font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                    {renderErrorContent(errorDetails)}
                  </pre>
                  <ScrollBar />
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : logs.length === 0 ? (
        <div className="h-[calc(100vh-240px)] w-full rounded-md border p-4 flex flex-col items-center justify-center space-y-4">
          <Package className="h-12 w-12" />
          <p className="text-lg">No Logs Found</p>
          <p className="text-sm text-gray-600 text-center max-w-md">
            There are currently no logs available for the selected canister.
            This could mean the canister hasn't generated any logs yet.
          </p>
        </div>
      ) : (
        <DataTable columns={columns} data={filteredLogs} />
      )}
    </div>
  );
}