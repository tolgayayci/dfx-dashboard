import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Badge } from "@components/ui/badge";
import { useToast } from "@components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { UserCheck, Plus, Trash2, RefreshCw, AlertCircle, Search, ChevronLeft, ChevronRight, Copy, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const authorizeCustodianSchema = z.object({
  custodianId: z.string().min(1, "Custodian ID is required"),
});

type AuthorizeCustodianForm = z.infer<typeof authorizeCustodianSchema>;

interface CustodianManagementProps {
  network: string;
  onRefresh?: () => void;
}

export default function CustodianManagement({ network, onRefresh }: CustodianManagementProps) {
  const [custodians, setCustodians] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorizeDialogOpen, setIsAuthorizeDialogOpen] = useState(false);
  const [isDeauthorizeDialogOpen, setIsDeauthorizeDialogOpen] = useState(false);
  const [custodianToDeauthorize, setCustodianToDeauthorize] = useState<string>("");
  const [isDeauthorizing, setIsDeauthorizing] = useState(false);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedCustodian, setCopiedCustodian] = useState<string>("");
  const itemsPerPage = 3;
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuthorizeCustodianForm>({
    resolver: zodResolver(authorizeCustodianSchema),
  });

  // Filter and search logic
  const filteredCustodians = useMemo(() => {
    return custodians.filter((custodian) => {
      return custodian.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [custodians, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCustodians.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustodians = filteredCustodians.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Copy to clipboard function
  const copyToClipboard = async (text: string, custodianId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCustodian(custodianId);
      toast({
        title: "Copied!",
        description: "Custodian ID copied to clipboard",
        variant: "success",
      });
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopiedCustodian(""), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy custodian ID",
        variant: "destructive",
      });
    }
  };

  const fetchCustodians = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await window.awesomeApi.walletListCustodians({ network });
      if (result.success) {
        // Parse the custodian list from the command output
        const custodianList = result.data?.split('\n').filter(line => line.trim()) || [];
        setCustodians(custodianList);
        console.log("Custodians fetched successfully:", custodianList);
      } else {
        console.error("Failed to fetch custodians:", result.error);
        // Handle wallet not found errors gracefully
        if (result.error?.includes("Certificate verification failed")) {
          setError(`Certificate verification failed on ${network} network. This is a known issue with local development. Custodian operations might still work.`);
        } else if (result.error?.includes("Failed to construct wallet canister caller")) {
          setError("No wallet found on this network");
        } else {
          setError(result.error || "Failed to fetch custodians");
        }
      }
    } catch (error) {
      console.error("Error fetching custodians:", error);
      setError("Failed to fetch custodians");
    } finally {
      setIsLoading(false);
    }
  };

  const onAuthorizeCustodian = async (data: AuthorizeCustodianForm) => {
    try {
      const result = await window.awesomeApi.walletAuthorizeCustodian(data.custodianId, { network });
      if (result.success) {
        toast({
          title: "Success",
          description: "Custodian authorized successfully",
          variant: "success",
        });
        setIsAuthorizeDialogOpen(false);
        reset();
        fetchCustodians();
        onRefresh?.();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to authorize custodian",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error authorizing custodian:", error);
      toast({
        title: "Error",
        description: "Failed to authorize custodian",
        variant: "destructive",
      });
    }
  };

  const deauthorizeCustodian = async (custodianId: string) => {
    setIsDeauthorizing(true);
    try {
      const result = await window.awesomeApi.walletDeauthorizeCustodian(custodianId, { network });
      if (result.success) {
        toast({
          title: "Success",
          description: "Custodian deauthorized successfully",
          variant: "success",
        });
        setIsDeauthorizeDialogOpen(false);
        setCustodianToDeauthorize("");
        fetchCustodians();
        onRefresh?.();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to deauthorize custodian",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deauthorizing custodian:", error);
      toast({
        title: "Error",
        description: "Failed to deauthorize custodian",
        variant: "destructive",
      });
    } finally {
      setIsDeauthorizing(false);
    }
  };

  useEffect(() => {
    fetchCustodians();
  }, [network]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-l-4 border-green-500 pl-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-green-100 border border-green-200 flex items-center justify-center dark:bg-green-900 dark:border-green-800">
            <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold">Wallet Custodians</h3>
            <p className="text-xs text-muted-foreground">
              Manage custodians for your cycles wallet. Custodians can send cycles and create canisters.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCustodians}
            disabled={isLoading}
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          {!error && (
            <Dialog open={isAuthorizeDialogOpen} onOpenChange={setIsAuthorizeDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="h-3 w-3 mr-2" />
                  <span className="text-xs">Authorize Custodian</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Authorize Custodian</DialogTitle>
                  <DialogDescription>
                    Authorize a new custodian for your wallet. Custodians can send cycles and create canisters.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onAuthorizeCustodian)}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="custodianId">Custodian Principal ID</Label>
                      <Input
                        id="custodianId"
                        placeholder="Enter principal ID"
                        {...register("custodianId")}
                      />
                      {errors.custodianId && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.custodianId.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter className="mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAuthorizeDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Authorizing..." : "Authorize Custodian"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Search */}
      {!error && custodians.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search custodians..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Content */}
      {error ? (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
                Unable to load custodians
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                {error}
              </p>
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchCustodians}
                  disabled={isLoading}
                  className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
                >
                  <RefreshCw className={`h-3 w-3 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  Try Again
                </Button>
                {error.includes("Certificate verification failed") && (
                  <Dialog open={isAuthorizeDialogOpen} onOpenChange={setIsAuthorizeDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        <Plus className="h-3 w-3 mr-2" />
                        Try Authorize Custodian
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Authorize Custodian</DialogTitle>
                        <DialogDescription>
                          Even though listing custodians failed, authorization might still work. Try authorizing a custodian.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit(onAuthorizeCustodian)}>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="custodianId">Custodian Principal ID</Label>
                            <Input
                              id="custodianId"
                              placeholder="Enter principal ID"
                              {...register("custodianId")}
                            />
                            {errors.custodianId && (
                              <p className="text-sm text-red-500 mt-1">
                                {errors.custodianId.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <DialogFooter className="mt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAuthorizeDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Authorizing..." : "Authorize Custodian"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Loading custodians...</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredCustodians.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {custodians.length === 0 ? "No Custodians Found" : "No Matching Custodians"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {custodians.length === 0 
                  ? "No custodians are currently configured for this wallet." 
                  : "Try adjusting your search term"}
              </p>
              {custodians.length === 0 && (
                <Dialog open={isAuthorizeDialogOpen} onOpenChange={setIsAuthorizeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Authorize First Custodian
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
                  <TableHead>Custodian ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCustodians.map((custodian, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="text-xs font-mono bg-muted px-2 py-1 rounded flex-1 min-w-0">
                          {custodian}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(custodian, custodian)}
                          className="flex-shrink-0 h-8 w-8 p-0"
                        >
                          {copiedCustodian === custodian ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="w-fit">
                        Custodian
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCustodianToDeauthorize(custodian);
                          setIsDeauthorizeDialogOpen(true);
                        }}
                        className="hover:text-red-500 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
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
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCustodians.length)} of {filteredCustodians.length} custodians
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

      {/* Deauthorize Custodian Confirmation Dialog */}
      <Dialog open={isDeauthorizeDialogOpen} onOpenChange={setIsDeauthorizeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deauthorize Custodian</DialogTitle>
            <DialogDescription>
              Are you sure you want to deauthorize this custodian? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Custodian to deauthorize:</p>
              <code className="text-xs font-mono bg-background px-2 py-1 rounded border">
                {custodianToDeauthorize}
              </code>
            </div>
            <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950 dark:border-red-800">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700 dark:text-red-300">
                <p className="font-medium">Warning:</p>
                <p>Deauthorizing a custodian will revoke their ability to send cycles and create canisters. Make sure you want to proceed.</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeauthorizeDialogOpen(false);
                setCustodianToDeauthorize("");
              }}
              disabled={isDeauthorizing}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => deauthorizeCustodian(custodianToDeauthorize)}
              disabled={isDeauthorizing}
            >
              {isDeauthorizing ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                  Deauthorizing...
                </>
              ) : (
                <>
                  <Trash2 className="h-3 w-3 mr-2" />
                  Deauthorize Custodian
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 