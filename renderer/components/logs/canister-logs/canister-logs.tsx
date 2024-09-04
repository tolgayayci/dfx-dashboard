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
import { Loader2 } from "lucide-react";
import useProjects from "renderer/hooks/useProjects";

interface Canister {
  name: string;
  projectName: string;
  path: string;
}

const exampleLogs: Log[] = [
  {
    count: 42,
    date: "2021-05-06",
    time: "19:17:10.000000001Z",
    message: "Some text message",
  },
  {
    count: 43,
    date: "2021-05-06",
    time: "19:17:10.000000002Z",
    message: "(bytes) 0xc0ffee",
  },
  {
    count: 44,
    date: "2021-05-06",
    time: "19:17:11.000000003Z",
    message: "Another log entry",
  },
  {
    count: 45,
    date: "2021-05-06",
    time: "19:17:12.000000004Z",
    message: "Test log message",
  },
  {
    count: 46,
    date: "2021-05-06",
    time: "19:17:13.000000005Z",
    message: "Example log for testing",
  },
  {
    count: 47,
    date: "2021-05-06",
    time: "19:17:13.000000005Z",
    message: "Example log for testing",
  },
  {
    count: 48,
    date: "2021-05-06",
    time: "19:17:13.000000005Z",
    message: "Example log for testing",
  },
];

export default function CanisterLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [allCanisters, setAllCanisters] = useState<Canister[]>([]);
  const [selectedCanister, setSelectedCanister] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
    }
  }

  useEffect(() => {
    setIsLoading(true);
    setAllCanisters([]);
    const fetchCanisters = async () => {
      for (const project of projects) {
        await checkCanisters(project.path);
      }
      setIsLoading(false);
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
    try {
      const result = await window.awesomeApi.runDfxCommand("canister", "logs", [
        canisterName,
      ]);
      const parsedLogs = parseLogs(result);
      setLogs(parsedLogs.length > 0 ? parsedLogs : exampleLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs(exampleLogs);
    }
    setIsLoading(false);
  };

  const parseLogs = (rawLogs: string): Log[] => {
    const logLines = rawLogs.split("\n");
    return logLines.map((line, index) => {
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

  return (
    <div className="flex flex-col h-[calc(100vh-90px)]">
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedCanister} onValueChange={setSelectedCanister}>
          <SelectTrigger className="w-[200px]">
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
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading logs...</span>
        </div>
      ) : (
        <DataTable columns={columns} data={filteredLogs} />
      )}
    </div>
  );
}
