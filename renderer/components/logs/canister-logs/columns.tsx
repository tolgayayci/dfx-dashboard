import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Maximize2 } from "lucide-react";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";

export type Log = {
  count: number;
  date: string;
  time: string;
  message: string;
};

const LogMessageDialog = ({ message }: { message: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Log Message</DialogTitle>
        </DialogHeader>
        <div className="mt-2 max-h-[60vh] overflow-y-auto border rounded-md p-4">
          <pre className="whitespace-pre-wrap break-words text-sm tracking-wide leading-6">{message}</pre>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const columns: ColumnDef<Log>[] = [
  {
    accessorKey: "count",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-16 justify-start px-2"
        >
          Count
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const count = row.getValue("count") as number;
      return (
        <div className="w-16 text-left font-medium px-2 text-blue-600">
          {count}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-24 justify-start px-2"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return <div className="w-24 px-2">{date}</div>;
    },
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      const time = row.getValue("time") as string;
      const formattedTime = time.split('.')[0]; // Remove milliseconds and timezone
      return <div className="w-24 px-2">{formattedTime}</div>;
    },
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const message = row.getValue("message") as string;
      return (
        <div className="flex items-center justify-between space-x-2 px-2">
          <div className="truncate max-w-[400px]" title={message}>
            {message}
          </div>
          {message.length > 50 && <LogMessageDialog message={message} />}
        </div>
      );
    },
  },
];