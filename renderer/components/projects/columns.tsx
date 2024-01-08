"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui/button";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Canister = {
  [key: string]: any;
};

export const createProjectColumns = (): ColumnDef<Canister>[] => {
  return [
    {
      accessorKey: "name",
      header: "Canister Name",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "details",
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <Link
            href={`/canisters/${encodeURIComponent(
              row.original.projectPath
            )}/${encodeURIComponent(row.original.name)}`}
          >
            <Button>Show Canister Details</Button>
          </Link>
        </div>
      ),
    },
  ];
};
