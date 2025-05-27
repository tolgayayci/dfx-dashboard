import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Badge } from "@components/ui/badge";
import { useToast } from "@components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { Users, Plus, Trash2, RefreshCw, AlertCircle, Search, ChevronLeft, ChevronRight, Copy, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const addControllerSchema = z.object({
  controllerId: z.string().min(1, "Controller ID is required"),
});

type AddControllerForm = z.infer<typeof addControllerSchema>;

interface ControllerManagementProps {
  network: string;
  onRefresh?: () => void;
}

export default function ControllerManagement({ network, onRefresh }: ControllerManagementProps) {
  const [controllers, setControllers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [controllerToRemove, setControllerToRemove] = useState<string>("");
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedController, setCopiedController] = useState<string>("");
  const itemsPerPage = 3;
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddControllerForm>({
    resolver: zodResolver(addControllerSchema),
  });

  // Filter and search logic
  const filteredControllers = useMemo(() => {
    return controllers.filter((controller) => {
      return controller.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [controllers, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredControllers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedControllers = filteredControllers.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Copy to clipboard function
  const copyToClipboard = async (text: string, controllerId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedController(controllerId);
      toast({
        title: "Copied!",
        description: "Controller ID copied to clipboard",
        variant: "success",
      });
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopiedController(""), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy controller ID",
        variant: "destructive",
      });
    }
  };

  const fetchControllers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await window.awesomeApi.walletListControllers({ network });
      if (result.success) {
        // Parse the controller list from the command output
        const controllerList = result.data?.split('\n').filter(line => line.trim()) || [];
        setControllers(controllerList);
      } else {
        // Handle wallet not found errors gracefully
        if (result.error?.includes("Certificate verification failed") || 
            result.error?.includes("Failed to construct wallet canister caller")) {
          setError("No wallet found on this network");
        } else {
          setError(result.error || "Failed to fetch controllers");
        }
      }
    } catch (error) {
      console.error("Error fetching controllers:", error);
      setError("Failed to fetch controllers");
    } finally {
      setIsLoading(false);
    }
  };

  const onAddController = async (data: AddControllerForm) => {
    try {
      const result = await window.awesomeApi.walletAddController(data.controllerId, { network });
      if (result.success) {
        toast({
          title: "Success",
          description: "Controller added successfully",
          variant: "success",
        });
        setIsAddDialogOpen(false);
        reset();
        fetchControllers();
        onRefresh?.();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add controller",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding controller:", error);
      toast({
        title: "Error",
        description: "Failed to add controller",
        variant: "destructive",
      });
    }
  };

  const removeController = async (controllerId: string) => {
    setIsRemoving(true);
    try {
      const result = await window.awesomeApi.walletRemoveController(controllerId, { network });
      if (result.success) {
        toast({
          title: "Success",
          description: "Controller removed successfully",
          variant: "success",
        });
        setIsRemoveDialogOpen(false);
        setControllerToRemove("");
        fetchControllers();
        onRefresh?.();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to remove controller",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error removing controller:", error);
      toast({
        title: "Error",
        description: "Failed to remove controller",
        variant: "destructive",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  useEffect(() => {
    fetchControllers();
  }, [network]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-l-4 border-blue-500 pl-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center dark:bg-blue-900 dark:border-blue-800">
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold">Wallet Controllers</h3>
            <p className="text-xs text-muted-foreground">
              Manage controllers for your cycles wallet. Controllers have full privileges.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchControllers}
            disabled={isLoading}
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          {!error && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-3 w-3 mr-2" />
                  <span className="text-xs">Add Controller</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Controller</DialogTitle>
                  <DialogDescription>
                    Add a new controller to your wallet. Controllers have full privileges.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onAddController)}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="controllerId">Controller Principal ID</Label>
                      <Input
                        id="controllerId"
                        placeholder="Enter principal ID"
                        {...register("controllerId")}
                      />
                      {errors.controllerId && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.controllerId.message}
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
                      {isSubmitting ? "Adding..." : "Add Controller"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Search */}
      {!error && controllers.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search controllers..."
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
                Unable to load controllers
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                {error}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchControllers}
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
              <p className="text-sm text-muted-foreground">Loading controllers...</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredControllers.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {controllers.length === 0 ? "No Controllers Found" : "No Matching Controllers"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {controllers.length === 0 
                  ? "No controllers are currently configured for this wallet." 
                  : "Try adjusting your search term"}
              </p>
              {controllers.length === 0 && (
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Controller
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
                  <TableHead>Controller ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedControllers.map((controller, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="text-xs font-mono bg-muted px-2 py-1 rounded flex-1 min-w-0">
                          {controller}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(controller, controller)}
                          className="flex-shrink-0 h-8 w-8 p-0"
                        >
                          {copiedController === controller ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="w-fit">
                        Controller
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsRemoveDialogOpen(true);
                          setControllerToRemove(controller);
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
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredControllers.length)} of {filteredControllers.length} controllers
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

      {/* Remove Controller Confirmation Dialog */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Controller</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this controller? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Controller to remove:</p>
              <code className="text-xs font-mono bg-background px-2 py-1 rounded border">
                {controllerToRemove}
              </code>
            </div>
            <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950 dark:border-red-800">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700 dark:text-red-300">
                <p className="font-medium">Warning:</p>
                <p>Removing a controller will revoke their access to manage this wallet. Make sure you want to proceed.</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsRemoveDialogOpen(false);
                setControllerToRemove("");
              }}
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => removeController(controllerToRemove)}
              disabled={isRemoving}
            >
              {isRemoving ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <Trash2 className="h-3 w-3 mr-2" />
                  Remove Controller
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 