import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { useToast } from "@components/ui/use-toast";
import { Input } from "@components/ui/input";
import { 
  Trash2, 
  FolderOpen, 
  HardDrive, 
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Package,
  Database,
  Folder
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

interface CacheVersion {
  version: string;
  isActive: boolean;
  path: string;
  size: string;
}

interface CacheInfo {
  currentPath: string;
  cacheDir: string;
  totalSize: string;
}

export default function CacheManagement() {
  const [versions, setVersions] = useState<CacheVersion[]>([]);
  const [cacheInfo, setCacheInfo] = useState<CacheInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteVersion, setDeleteVersion] = useState<string | null>(null);
  const [isClearingAll, setIsClearingAll] = useState(false);
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const { toast } = useToast();

  // Define table columns
  const columns: ColumnDef<CacheVersion>[] = [
    {
      accessorKey: "version",
      header: "Version",
      cell: ({ row }) => (
        <div className="font-mono font-medium">
          {row.getValue("version")}
        </div>
      ),
    },
    {
      accessorKey: "size",
      header: "Size",
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.getValue("size")}
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return isActive ? (
          <Badge variant="default" className="text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-xs">
            Cached
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const version = row.original;
        return (
          <div className="text-right">
            <Button
              onClick={() => setDeleteVersion(version.version)}
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
              disabled={version.isActive}
              title={version.isActive ? "Cannot delete active version" : `Delete version ${version.version}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    loadCacheData();
  }, []);

  // Filter and sort versions - active first, then by version
  const filteredAndSortedVersions = useMemo(() => {
    let filtered = versions.filter(version => {
      const matchesSearch = version.version.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "active" && version.isActive) ||
        (statusFilter === "cached" && !version.isActive);
      
      return matchesSearch && matchesStatus;
    });

    // Sort: active versions first, then by version number
    filtered.sort((a, b) => {
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      return a.version.localeCompare(b.version);
    });

    return filtered;
  }, [versions, searchTerm, statusFilter]);

  const table = useReactTable({
    data: filteredAndSortedVersions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 4,
        pageIndex: 0,
      },
    },
    state: {
      sorting,
    },
  });

  const loadCacheData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [versionsResult, pathResult] = await Promise.all([
        window.awesomeApi.cacheListVersions(),
        window.awesomeApi.cacheGetPath()
      ]);

      if (versionsResult.success) {
        setVersions(versionsResult.data);
      } else {
        throw new Error(versionsResult.error || "Failed to load cache versions");
      }

      if (pathResult.success) {
        setCacheInfo(pathResult.data);
      } else {
        throw new Error(pathResult.error || "Failed to load cache path info");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVersion = async (version: string) => {
    try {
      const result = await window.awesomeApi.cacheDeleteVersion(version);
      
      if (result.success) {
        toast({
          title: "Success",
          description: `DFX version ${version} has been deleted from cache.`,
          duration: 3000,
        });
        
        await loadCacheData();
      } else {
        throw new Error(result.error || "Failed to delete version");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to delete version ${version}: ${errorMessage}`,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setDeleteVersion(null);
    }
  };

  const handleClearAllCache = async () => {
    setIsClearingAll(true);
    
    try {
      const result = await window.awesomeApi.cacheClearAll();
      
      if (result.success) {
        toast({
          title: "Success",
          description: "All cache versions have been cleared.",
          duration: 3000,
        });
        
        await loadCacheData();
      } else {
        throw new Error(result.error || "Failed to clear cache");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to clear cache: ${errorMessage}`,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsClearingAll(false);
      setShowClearAllDialog(false);
    }
  };

  const handleOpenCacheFolder = async () => {
    if (cacheInfo?.cacheDir) {
      try {
        await window.awesomeApi.openExternalLink(`file://${cacheInfo.cacheDir}`);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to open cache folder",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };

  const handleInstallCurrent = async () => {
    try {
      const result = await window.awesomeApi.cacheInstallVersion();
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Current DFX version has been installed to cache.",
          duration: 3000,
        });
        
        await loadCacheData();
      } else {
        throw new Error(result.error || "Failed to install current version");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to install current version: ${errorMessage}`,
        variant: "destructive",
        duration: 5000,
      });
    }
  };



  return (
    <div className="h-[calc(100vh-26px)] flex flex-col">
      {/* Header Section */}
      <div className="flex-shrink-0">

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Compact Overview Cards */}
        {cacheInfo && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <Card className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center">
                    <Folder className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">Cache Directory</p>
                    <p className="text-sm font-mono truncate">{cacheInfo.cacheDir}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-green-500/10 flex items-center justify-center">
                    <HardDrive className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">Total Size</p>
                    <p className="text-sm font-semibold">{cacheInfo.totalSize}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-purple-500/10 flex items-center justify-center">
                    <Database className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">Cached Versions</p>
                    <p className="text-sm font-semibold">{versions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}



        {/* Filters and Actions */}
        <div className="flex items-center gap-2 mt-3 mb-6">
          <Input
            placeholder="Search versions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Versions</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="cached">Cached Only</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={loadCacheData}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="px-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            onClick={handleInstallCurrent}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Install Current
          </Button>

          <Button
            onClick={() => setShowClearAllDialog(true)}
            variant="destructive"
            size="sm"
            disabled={versions.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Versions Data Table */}
      <div className="flex-1 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Package className="h-6 w-6 animate-pulse mr-2" />
            Loading cache information...
          </div>
        ) : filteredAndSortedVersions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Package className="h-12 w-12 mb-4 opacity-50" />
            <div className="text-lg font-medium mb-2">
              {versions.length === 0 ? "No cached versions found" : "No matching versions"}
            </div>
            <div className="text-sm text-center max-w-md">
              {versions.length === 0 
                ? "Install the current version to populate the cache"
                : "Try adjusting your search or filter criteria"
              }
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="h-12">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="h-16"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
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
                        className="h-24 text-center"
                      >
                        No cached versions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center">
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
                      {[4, 8, 12].map((pageSize) => (
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
        )}
      </div>

      {/* Delete Version Dialog */}
      <Dialog 
        open={deleteVersion !== null} 
        onOpenChange={() => setDeleteVersion(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Version</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete DFX version {deleteVersion} from the cache?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteVersion(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteVersion && handleDeleteVersion(deleteVersion)}
            >
              Delete Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear All Cache Dialog */}
      <Dialog 
        open={showClearAllDialog} 
        onOpenChange={setShowClearAllDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All Cache</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear all cached DFX versions? This will remove 
              all versions from the cache and free up disk space. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowClearAllDialog(false)}
              disabled={isClearingAll}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearAllCache}
              disabled={isClearingAll}
            >
              {isClearingAll && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              Clear All Cache
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 