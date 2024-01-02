"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@components/ui/button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Canister = {
  [key: string]: any;
};

export const createColumns = (
  onOpenModal: (data: Canister) => void
): ColumnDef<Canister>[] => {
  return [
    {
      accessorKey: "name",
      header: "Name",
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
          <Button onClick={() => onOpenModal(row.original)}>
            Show Canister Details
          </Button>
        </div>
      ),
    },
  ];
};
