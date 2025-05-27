import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Badge } from "@components/ui/badge";
import { useToast } from "@components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { BookOpen, Plus, Trash2, RefreshCw, AlertCircle, User, Globe, Search, ChevronLeft, ChevronRight, Filter, Copy, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const addAddressSchema = z.object({
  label: z.string().min(1, "Label is required"),
  address: z.string().min(1, "Address is required"),
  type: z.enum(["principal", "account"], {
    required_error: "Please select an address type",
  }),
});

type AddAddressForm = z.infer<typeof addAddressSchema>;

interface AddressEntry {
  id: string;
  label: string;
  address: string;
  type: "principal" | "account";
  source: "local" | "dfx";
}

interface AddressBookProps {
  network: string;
}

export default function AddressBook({ network }: AddressBookProps) {
  const [addresses, setAddresses] = useState<AddressEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<AddressEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedAddress, setCopiedAddress] = useState<string>("");
  const itemsPerPage = 3;
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddAddressForm>({
    resolver: zodResolver(addAddressSchema),
  });

  // Filter and search logic
  const filteredAddresses = useMemo(() => {
    return addresses.filter((address) => {
      const matchesSearch = 
        address.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === "all" || address.type === typeFilter;
      const matchesSource = sourceFilter === "all" || address.source === sourceFilter;
      
      return matchesSearch && matchesType && matchesSource;
    });
  }, [addresses, searchTerm, typeFilter, sourceFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAddresses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAddresses = filteredAddresses.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, sourceFilter]);

  const fetchAddresses = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Fetch local addresses
      const localResult = await window.awesomeApi.walletGetAddresses();
      const localAddresses: AddressEntry[] = localResult.success ? (localResult.data || []) : [];

      // Fetch dfx wallet addresses
      const dfxResult = await window.awesomeApi.walletGetDfxAddresses({ network });
      let dfxAddresses: AddressEntry[] = [];
      
      if (dfxResult.success && dfxResult.data) {
        // Parse dfx wallet addresses output
        const lines = dfxResult.data.split('\n').filter(line => line.trim());
        dfxAddresses = lines.map((line, index) => {
          // Parse format: "Id: <address>, Kind: <kind>, Role: <role>, Name: <name>."
          const match = line.match(/Id: ([^,]+), Kind: ([^,]+), Role: ([^,]+)(?:, Name: ([^.]+))?/);
          if (match) {
            const [, address, kind, role, name] = match;
            return {
              id: `dfx-${index}`,
              label: name || `${role} (${kind})`,
              address: address.trim(),
              type: "principal" as const,
              source: "dfx" as const
            };
          }
          return null;
        }).filter(Boolean) as AddressEntry[];
      }

      // Combine addresses
      setAddresses([...localAddresses, ...dfxAddresses]);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setError("Failed to fetch addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const onAddAddress = async (data: AddAddressForm) => {
    try {
      const result = await window.awesomeApi.walletSaveAddress(data.address, data.label, data.type);
      if (result.success) {
        toast({
          title: "Success",
          description: "Address saved successfully",
          variant: "success",
        });
        setIsAddDialogOpen(false);
        reset();
        fetchAddresses();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save address",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive",
      });
    }
  };

  const deleteAddress = async (addressId: string) => {
    setIsDeleting(true);
    try {
      const result = await window.awesomeApi.walletDeleteAddress(addressId);
      if (result.success) {
        toast({
          title: "Success",
          description: "Address deleted successfully",
          variant: "success",
        });
        setIsDeleteDialogOpen(false);
        setAddressToDelete(null);
        fetchAddresses();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete address",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Copy to clipboard function
  const copyToClipboard = async (text: string, addressId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(addressId);
      toast({
        title: "Copied!",
        description: "Address copied to clipboard",
        variant: "success",
      });
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopiedAddress(""), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy address",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [network]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-l-4 border-purple-500 pl-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center dark:bg-purple-900 dark:border-purple-800">
            <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold">Address Book</h3>
            <p className="text-xs text-muted-foreground">
              Manage your saved addresses for easy access during transfers.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAddresses}
            disabled={isLoading}
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="h-3 w-3 mr-2" />
                <span className="text-xs">Add Address</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Address</DialogTitle>
                <DialogDescription>
                  Add a new address to your address book for easy access during transfers.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onAddAddress)}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="label">Label</Label>
                    <Input
                      id="label"
                      placeholder="e.g., Alice's Account"
                      {...register("label")}
                    />
                    {errors.label && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.label.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Principal ID or Account ID"
                      {...register("address")}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select onValueChange={(value) => register("type").onChange({ target: { value } })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select address type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="principal">Principal ID</SelectItem>
                        <SelectItem value="account">Account ID</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.type.message}
                      </p>
                    )}
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Address"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search addresses or labels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="principal">Principal</SelectItem>
              <SelectItem value="account">Account</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="local">Local</SelectItem>
              <SelectItem value="dfx">DFX</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
                Unable to load addresses
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                {error}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAddresses}
                disabled={isLoading}
                className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
              >
                <RefreshCw className={`h-3 w-3 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Loading addresses...</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredAddresses.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {addresses.length === 0 ? "No Addresses Found" : "No Matching Addresses"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {addresses.length === 0 
                  ? "Add an address to get started" 
                  : "Try adjusting your search or filters"}
              </p>
              {addresses.length === 0 && (
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Address
                    </Button>
                  </DialogTrigger>
                </Dialog>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Data Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAddresses.map((address) => (
                  <TableRow key={address.id}>
                    <TableCell className="font-medium">{address.label}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="text-xs font-mono bg-muted px-2 py-1 rounded flex-1 min-w-0">
                          {address.address}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(address.address, address.id)}
                          className="flex-shrink-0 h-8 w-8 p-0"
                        >
                          {copiedAddress === address.id ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center space-x-1 w-fit">
                        {address.type === "principal" ? (
                          <User className="h-3 w-3" />
                        ) : (
                          <Globe className="h-3 w-3" />
                        )}
                        <span>{address.type}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={address.source === "local" ? "default" : "secondary"}
                          className="w-fit"
                        >
                          {address.source}
                        </Badge>
                        {address.source === "local" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsDeleteDialogOpen(true);
                              setAddressToDelete(address);
                            }}
                            className="hover:text-red-500 h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAddresses.length)} of {filteredAddresses.length} addresses
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Address Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Address</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {addressToDelete && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Address to delete:</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Label:</span>
                    <span className="text-sm">{addressToDelete.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Address:</span>
                    <code className="text-xs font-mono bg-background px-2 py-1 rounded border">
                      {addressToDelete.address}
                    </code>
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950 dark:border-red-800">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700 dark:text-red-300">
                  <p className="font-medium">Warning:</p>
                  <p>This will permanently remove the address from your local address book.</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setAddressToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => addressToDelete && deleteAddress(addressToDelete.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete Address
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 