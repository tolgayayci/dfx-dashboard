"use client";
import { useState, useMemo } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: any[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [networkFilter, setNetworkFilter] = useState<string>("all");
  const [globalFilter, setGlobalFilter] = useState<string>("");

  // Memoize filtered data to prevent unnecessary re-calculations
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Type filter
      if (typeFilter !== "all") {
        if (typeFilter === "user") {
          // Show all canisters that are NOT NNS (this includes undefined, 'user', or any other type)
          if (item.type === "nns") return false;
        }
        if (typeFilter === "nns") {
          // Only show canisters that are explicitly marked as NNS
          if (item.type !== "nns") return false;
        }
      }

      // Network filter
      if (networkFilter !== "all") {
        const itemNetwork = item.network || (item.name?.includes("(IC)") ? "ic" : "local");
        if (networkFilter !== itemNetwork) return false;
      }

      // Global search filter (search in name and canister_id)
      if (globalFilter) {
        const searchTerm = globalFilter.toLowerCase();
        const nameMatch = item.name?.toLowerCase().includes(searchTerm);
        const idMatch = item.canister_id?.toLowerCase().includes(searchTerm);
        if (!nameMatch && !idMatch) return false;
      }

      return true;
    });
  }, [data, typeFilter, networkFilter, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
        pageIndex: 0,
      },
    },
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex items-center gap-4 mt-3 mb-6">
        {/* Global Search */}
        <Input
          placeholder="Search canisters by name or ID..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="flex-1"
        />
        
        {/* Type Filter */}
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Canisters</SelectItem>
            <SelectItem value="user">User Canisters</SelectItem>
            <SelectItem value="nns">NNS Canisters</SelectItem>
          </SelectContent>
        </Select>

        {/* Network Filter */}
        <Select value={networkFilter} onValueChange={setNetworkFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by network" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Networks</SelectItem>
            <SelectItem value="local">Local</SelectItem>
            <SelectItem value="ic">IC</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="max-h-[calc(85vh-130px)] overflow-y-auto">
        <div className="rounded-md border ">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="h-16">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-[54vh] text-center"
                  >
                    No canisters found with the current filters!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <div className="flex-1 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 15].map((pageSize) => (
                  <SelectItem
                    key={pageSize}
                    value={`${pageSize}`}
                  >
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center w-[100px] justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
