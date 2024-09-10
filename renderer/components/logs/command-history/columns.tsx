import { useState } from "react";
import { useRouter } from "next/router";

import { ColumnDef } from "@tanstack/react-table";
import { useCopyToClipboard } from "react-use";
import { Play, Copy, Info } from "lucide-react";

import { useToast } from "@components/ui/use-toast";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";

import { DataTableColumnHeader } from "@components/logs/command-history/column-header";

export type Network = {
  [key: string]: any;
};

const getSubcommandColor = (subcommand: string) => {
  switch (subcommand) {
    case "canister":
      return "text-blue-500";
    default:
      return "";
  }
};

const subcommandFilterFn = (
  row: any,
  columnId: string,
  filterValue: string
) => {
  if (filterValue === "all") {
    return true;
  }
  return row.getValue(columnId) === filterValue;
};

export const createCommandHistoryColumns = (
  subcommandFilter: string,
  setSubcommandFilter: (value: string) => void
): ColumnDef<Network>[] => {
  const [state, copyToClipboard] = useCopyToClipboard();

  const router = useRouter();
  const { toast } = useToast();

  const isExists = async (path: string) => {
    try {
      const exist = await window.awesomeApi.checkFileExists(path);
      return exist;
    } catch (error) {
      console.error("Error checking file existence:", error);
      return false;
    }
  };

  return [
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => <div className="uppercase">{row.original.date}</div>,
      sortingFn: (rowA, rowB, columnId) => {
        const dateTimeA = new Date(`${rowA.original.date} ${rowA.original.time}`);
        const dateTimeB = new Date(`${rowB.original.date} ${rowB.original.time}`);
        return dateTimeB.getTime() - dateTimeA.getTime(); // Descending order
      },
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }) => <div className="uppercase">{row.original.time}</div>,
      enableSorting: false,
    },
    {
      accessorKey: "subcommand",
      header: () => (
        <div className="flex items-center space-x-2">
          <Select
            value={subcommandFilter}
            onValueChange={(value) => setSubcommandFilter(value)}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="canister">Canister</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
      cell: ({ row }) => (
        <div
          className={`${getSubcommandColor(
            row.original.subcommand
          )} uppercase text-center`}
        >
          {row.original.subcommand}
        </div>
      ),
      filterFn: subcommandFilterFn,
    },
    {
      accessorKey: "command",
      header: "Command",
      cell: ({ row }) => (
        <div className="max-w-xs truncate">{row.original.command}</div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const [open, setOpen] = useState(false);

        return (
          <div className="flex justify-start space-x-3">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Info className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="min-w-[calc(70vw-106px)]">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <span>Command Output</span>
                    <Badge className="ml-4">
                      {"Path: " + row.original.path}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription className="pt-2">
                    <pre className="bg-white text-black shadow-lg border border-black p-2 pl-3 rounded-md">
                      {row.original.command}
                    </pre>
                  </DialogDescription>
                </DialogHeader>
                <div className="bg-gray-900 text-white p-4 rounded-md -mt-1">
                  <ScrollArea className="h-[calc(80vh-106px)]">
                    <pre className="font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                      {row.original.result.split("\n").map((line, index) => (
                        <div key={index}>
                          {line
                            .split(
                              /(\s--[\w-]+(?:\s+<[\w_]+>)?|\s-\w(?:\s+<[\w_]+>)?)/g
                            )
                            .map((part, partIndex) => {
                              if (
                                part.trim().match(/^--[\w-]+(?:\s+<[\w_]+>)?$/)
                              ) {
                                return (
                                  <span
                                    key={partIndex}
                                    className="text-blue-400"
                                  >
                                    {part}
                                  </span>
                                );
                              } else if (
                                part.trim().match(/^-\w(?:\s+<[\w_]+>)?$/)
                              ) {
                                return (
                                  <span
                                    key={partIndex}
                                    className="text-blue-400"
                                  >
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
                      ))}
                    </pre>
                    <ScrollBar />
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              disabled={row.original.subcommand !== "canister"}
              onClick={async () => {
                const { path, command, subcommand } = row.original;

                const exist = await isExists(path);
                if (exist && subcommand === "canister") {
                  router.push({
                    pathname: `/canisters/[path]/[canisterName]`,
                    query: {
                      path,
                      command,
                      canisterName: row.original.command.split(" ")[3],
                    },
                  });
                } else {
                  toast({
                    title: "Path Not Found",
                    description: `Project does not exist at "${path}" `,
                  });
                }
              }}
            >
              <Play className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => {
                copyToClipboard(row.original.command);
                toast({
                  title: "Copied to Clipboard",
                  description: (
                    <pre className="bg-gray-100 text-black p-1 px-2 rounded-md mt-1 overflow-hidden text-ellipsis whitespace-nowrap max-w-[360px]">
                      {row.original.command}
                    </pre>
                  ),
                });
              }}
              className="transition-colors duration-200 hover:text-blue-500 focus:text-blue-500"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
};
