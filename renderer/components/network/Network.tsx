import { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';

// Add this type definition
type JSONInputProps = {
  id: string;
  placeholder: any;
  locale: any;
  height: string;
  width: string;
  onChange: (value: { json: string; jsObject: any }) => void;
  waitAfterKeyPress: number;
  theme: string;
  colors: any;
  style: any;
};

// Dynamically import JSONInput to avoid SSR issues
const JSONInput = dynamic(
  () => import('react-json-editor-ajrm').then((mod) => mod.default as React.ComponentType<JSONInputProps>),
  { ssr: false }
);

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Search, ArrowUpDown, Edit, Plus, Trash2 } from "lucide-react";
import locale from "react-json-editor-ajrm/locale/en";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import Loading from "@components/common/loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Label } from "@components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/ui/alert-dialog";
import { useToast } from "@components/ui/use-toast";
import { useTheme } from "next-themes";
import { Card } from "@components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { AlertCircle, Save, RotateCcw } from "lucide-react";
import { Skeleton } from "@components/ui/skeleton";

import { NetworkData, NetworkType } from "./types";
import { LocalNetworkForm } from "./forms/LocalNetworkForm";
import { ICNetworkForm } from "./forms/ICNetworkForm";
import { CustomNetworkForm } from "./forms/CustomNetworkForm";
import { sortAndFilterNetworks } from "./utils";
import { checkNetworkJson, updateJson, getNetworkJsonPath } from "./api";

// Add this type guard function at the top of the file, outside of the component
function hasReplica(details: any): details is { replica?: { subnet_type?: string } } {
  return 'replica' in details;
}

export default function NetworkComponent() {
  const [networkData, setNetworkData] = useState<NetworkData>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<"name" | "type">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNetworkType, setSelectedNetworkType] =
    useState<NetworkType>("local");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingNetwork, setEditingNetwork] = useState<string | null>(null);
  const [networkToRemove, setNetworkToRemove] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkNetworkJson(setNetworkData, setIsLoading);
  }, []);

  const handleSort = (column: "name" | "type") => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleEdit = (name: string) => {
    setEditingNetwork(name);
    if (name === "local" || name === "ic") {
      setSelectedNetworkType(name);
    } else {
      setSelectedNetworkType("custom");
    }
    setIsDialogOpen(true);
  };

  const handleAddNetwork = () => {
    setEditingNetwork(null);
    setSelectedNetworkType("local");
    setIsDialogOpen(true);
  };

  const handleNetworkTypeChange = (value: NetworkType) => {
    setSelectedNetworkType(value);
  };

  const handleJsonChange = async (newData: { jsObject: NetworkData }) => {
    if (newData.jsObject) {
      const path = await getNetworkJsonPath();
      if (path) {
        await updateJson(path, newData.jsObject);
        setNetworkData(newData.jsObject);
      }
    }
  };

  const handleRemove = async (name: string) => {
    setNetworkToRemove(name);
  };

  const confirmRemove = async () => {
    if (networkToRemove) {
      const updatedNetworkData = { ...networkData };
      delete updatedNetworkData[networkToRemove];

      const path = await getNetworkJsonPath();
      if (path) {
        await updateJson(path, updatedNetworkData);
        setNetworkData(updatedNetworkData);
        toast({
          title: "Network Removed",
          description: `${networkToRemove} has been successfully removed.`,
          duration: 2000,
        });
      }
      setNetworkToRemove(null);
    }
  };

  const sortedAndFilteredNetworks = sortAndFilterNetworks(
    networkData,
    searchTerm,
    sortColumn,
    sortDirection
  );

  const JsonEditor = () => {
    const { theme } = useTheme();
    const [localNetworkData, setLocalNetworkData] = useState(networkData);
    const [error, setError] = useState<string | null>(null);
    const [networkJsonPath, setNetworkJsonPath] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const jsonInputRef = useRef<any>(null);
    const cursorPositionRef = useRef<number | null>(null);

    useEffect(() => {
      getNetworkJsonPath().then((path) => {
        setNetworkJsonPath(path);
        setIsLoading(false);
      });
    }, []);

    useEffect(() => {
      setLocalNetworkData(networkData);
    }, [networkData]);

    const handleSave = async () => {
      try {
        const path = await getNetworkJsonPath();
        if (path) {
          await updateJson(path, localNetworkData);
          setNetworkData(localNetworkData);
          toast({
            title: "Changes Saved",
            description: "The network configuration has been updated.",
            duration: 2000,
          });
        }
      } catch (err) {
        setError("Failed to save changes. Please try again.");
      }
    };

    const handleReset = () => {
      setLocalNetworkData(networkData);
      setError(null);
      toast({
        title: "Changes Reset",
        description: "The editor has been reset to the last saved state.",
        duration: 2000,
      });
    };

    const editorColors = {
      background: "hsl(var(--background))",
      default: "hsl(var(--foreground))",
      string: "hsl(var(--primary))",
      number: "hsl(var(--secondary))",
      colon: "hsl(var(--muted-foreground))",
      keys: theme === "dark" ? "#4299e1" : "#3182ce", // Blue hex color
      keys_whiteSpace: theme === "dark" ? "#4299e1" : "#3182ce",
      primitive: "hsl(var(--destructive))",
    };

    const handleJsonInputChange = (value: { json: string, jsObject: any }) => {
      setLocalNetworkData(value.jsObject);
      setError(null);

      // Store the current cursor position
      if (jsonInputRef.current) {
        const textArea = jsonInputRef.current.querySelector('textarea');
        if (textArea) {
          cursorPositionRef.current = textArea.selectionStart;
        }
      }
    };

    useEffect(() => {
      // Restore the cursor position after the component updates
      if (jsonInputRef.current && cursorPositionRef.current !== null) {
        const textArea = jsonInputRef.current.querySelector('textarea');
        if (textArea) {
          textArea.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
        }
      }
    });

    return (
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <div>
            <h3 className="text-xl font-semibold mb-1">networks.json</h3>
            {isLoading ? (
              <Skeleton className="h-4 w-[250px]" />
            ) : (
              networkJsonPath && (
                <p className="text-sm text-muted-foreground">{networkJsonPath}</p>
              )
            )}
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div ref={jsonInputRef}>
          <JSONInput
            id="network_json"
            placeholder={localNetworkData}
            locale={locale}
            height="calc(100vh - 300px)"
            width="100%"
            onChange={handleJsonInputChange}
            waitAfterKeyPress={300}
            theme={theme === "dark" ? "dark_vscode_tribute" : "light_mitsuketa_tribute"}
            colors={{
              background: theme === "dark" ? "#1e1e1e" : "#ffffff",
              ...editorColors,
            }}
            style={{
              contentBox: {
                fontSize: "14px",
                fontFamily: "var(--font-mono)",
                fontWeight: "500",
              },
            }}
          />
        </div>
      </Card>
    );
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Tabs defaultValue="form" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="form" className="flex-1">
                Network Manager
              </TabsTrigger>
              <TabsTrigger value="json" className="flex-1">
                JSON Editor
              </TabsTrigger>
            </TabsList>
            <TabsContent value="form" className="mt-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="relative flex-grow mr-4">
                  <Input
                    type="text"
                    placeholder="Search networks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>
                <Button onClick={handleAddNetwork}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Network
                </Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        onClick={() => handleSort("name")}
                        className="cursor-pointer"
                      >
                        Name{" "}
                        {sortColumn === "name" && (
                          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                        )}
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort("type")}
                        className="cursor-pointer"
                      >
                        Type{" "}
                        {sortColumn === "type" && (
                          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                        )}
                      </TableHead>
                      <TableHead>Subnet Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAndFilteredNetworks.length > 0 ? (
                      sortedAndFilteredNetworks.map(([name, details]) => (
                        <TableRow key={name}>
                          <TableCell className="font-medium">{name}</TableCell>
                          <TableCell>{details.type || "-"}</TableCell>
                          <TableCell>
                            {hasReplica(details) && details.replica?.subnet_type
                              ? details.replica.subnet_type
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(name)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemove(name)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-4 h-[calc(90vh-200px)]"
                        >
                          No results found for "{searchTerm}"
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="json" className="mt-4">
              <JsonEditor />
            </TabsContent>
          </Tabs>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingNetwork ? "Edit Network" : "Add Network"}
                </DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <p>
                  {editingNetwork
                    ? "Edit the network configuration in the global networks.json file."
                    : "Add a system-wide network configuration to the global networks.json file. These networks can be used by any project in your local environment."}
                </p>
              </DialogDescription>
              <div className="space-y-3">
                {!editingNetwork && (
                  <div className="space-y-1">
                    <Label htmlFor="networkType">Network Type</Label>
                    <Select
                      onValueChange={handleNetworkTypeChange}
                      defaultValue="local"
                    >
                      <SelectTrigger id="networkType">
                        <SelectValue placeholder="Select network type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Local</SelectItem>
                        <SelectItem value="ic">IC</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedNetworkType === "local" && (
                  <LocalNetworkForm
                    networkData={networkData}
                    setNetworkData={setNetworkData}
                    setIsDialogOpen={setIsDialogOpen}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                    editingNetwork={editingNetwork}
                  />
                )}
                {selectedNetworkType === "ic" && (
                  <ICNetworkForm
                    networkData={networkData}
                    setNetworkData={setNetworkData}
                    setIsDialogOpen={setIsDialogOpen}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                    editingNetwork={editingNetwork}
                  />
                )}
                {selectedNetworkType === "custom" && (
                  <CustomNetworkForm
                    networkData={networkData}
                    setNetworkData={setNetworkData}
                    setIsDialogOpen={setIsDialogOpen}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                    editingNetwork={editingNetwork}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
          <AlertDialog
            open={!!networkToRemove}
            onOpenChange={() => setNetworkToRemove(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  {networkToRemove && ` "${networkToRemove}"`} network.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmRemove}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
