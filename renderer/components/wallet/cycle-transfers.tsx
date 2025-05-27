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
import { Send, RefreshCw, AlertCircle, Calculator, Search, ChevronLeft, ChevronRight, Copy, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const sendCyclesSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  amount: z.string().min(1, "Amount is required").regex(/^\d+$/, "Must be a valid number"),
});

type SendCyclesForm = z.infer<typeof sendCyclesSchema>;

interface CycleTransfersProps {
  network: string;
  walletBalance: string;
  onRefresh?: () => void;
}

interface TransferHistory {
  id: string;
  destination: string;
  amount: string;
  timestamp: Date;
  status: "success" | "failed";
}

export default function CycleTransfers({ network, walletBalance, onRefresh }: CycleTransfersProps) {
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [transferHistory, setTransferHistory] = useState<TransferHistory[]>([]);
  const [addresses, setAddresses] = useState<Array<{id: string, label: string, address: string}>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedAddress, setCopiedAddress] = useState<string>("");
  const itemsPerPage = 3;
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SendCyclesForm>({
    resolver: zodResolver(sendCyclesSchema),
  });

  // Cycle amount presets
  const cyclePresets = [
    { label: "1 TC", value: "1000000000000" },
    { label: "5 TC", value: "5000000000000" },
    { label: "10 TC", value: "10000000000000" },
    { label: "50 TC", value: "50000000000000" },
    { label: "100 TC", value: "100000000000000" },
  ];

  // Filter and search logic
  const filteredTransfers = useMemo(() => {
    return transferHistory.filter((transfer) => {
      const matchesSearch = 
        transfer.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.amount.includes(searchTerm) ||
        formatCycles(transfer.amount).toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || transfer.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [transferHistory, searchTerm, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTransfers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransfers = filteredTransfers.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Copy to clipboard function
  const copyToClipboard = async (text: string, transferId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(transferId);
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

  const fetchAddresses = async () => {
    try {
      const result = await window.awesomeApi.walletGetAddresses();
      if (result.success) {
        setAddresses(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const loadTransferHistory = async () => {
    try {
      const result = await window.awesomeApi.storeGet(`wallet.transferHistory.${network}`);
      if (result.success && result.value) {
        // Convert timestamp strings back to Date objects
        const history = result.value.map((transfer: any) => ({
          ...transfer,
          timestamp: new Date(transfer.timestamp)
        }));
        setTransferHistory(history);
      }
    } catch (error) {
      console.error("Error loading transfer history:", error);
    }
  };

  const saveTransferHistory = async (history: TransferHistory[]) => {
    try {
      await window.awesomeApi.storeSet(`wallet.transferHistory.${network}`, history);
    } catch (error) {
      console.error("Error saving transfer history:", error);
    }
  };

  const onSendCycles = async (data: SendCyclesForm) => {
    try {
      const result = await window.awesomeApi.walletSendCycles(data.destination, data.amount, { network });
      if (result.success) {
        toast({
          title: "Success",
          description: `Successfully sent ${formatCycles(data.amount)}`,
          variant: "success",
        });
        
        // Add to transfer history
        const newTransfer: TransferHistory = {
          id: Date.now().toString(),
          destination: data.destination,
          amount: data.amount,
          timestamp: new Date(),
          status: "success"
        };
        const updatedHistory = [newTransfer, ...transferHistory];
        setTransferHistory(updatedHistory);
        await saveTransferHistory(updatedHistory);
        
        setIsSendDialogOpen(false);
        reset();
        onRefresh?.();
      } else {
        toast({
          title: "Transfer Failed",
          description: result.error || "Failed to send cycles",
          variant: "destructive",
        });
        
        // Add failed transfer to history
        const failedTransfer: TransferHistory = {
          id: Date.now().toString(),
          destination: data.destination,
          amount: data.amount,
          timestamp: new Date(),
          status: "failed"
        };
        const updatedHistory = [failedTransfer, ...transferHistory];
        setTransferHistory(updatedHistory);
        await saveTransferHistory(updatedHistory);
      }
    } catch (error) {
      console.error("Error sending cycles:", error);
      toast({
        title: "Error",
        description: "Failed to send cycles",
        variant: "destructive",
      });
    }
  };

  const formatCycles = (cycles: string) => {
    const num = parseInt(cycles);
    if (num >= 1000000000000) {
      return `${(num / 1000000000000).toFixed(2)} TC`;
    } else if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(2)} GC`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)} MC`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)} KC`;
    }
    return `${num} cycles`;
  };

  const selectAddress = (address: string) => {
    setValue("destination", address);
  };

  const selectPreset = (amount: string) => {
    setValue("amount", amount);
  };

  useEffect(() => {
    fetchAddresses();
    loadTransferHistory();
  }, [network]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-l-4 border-orange-500 pl-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center dark:bg-orange-900 dark:border-orange-800">
            <Send className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold">Cycle Transfers</h3>
            <p className="text-xs text-muted-foreground">
              Send cycles from your wallet to canisters. Current balance: {walletBalance ? formatCycles(walletBalance) : "Loading..."}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCalculatorOpen(true)}
          >
            <Calculator className="h-3 w-3" />
          </Button>
          <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                <Send className="h-3 w-3 mr-2" />
                <span className="text-xs">Send Cycles</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Send Cycles</DialogTitle>
                <DialogDescription>
                  Send cycles from your wallet to a canister.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSendCycles)}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="destination">Destination Canister ID</Label>
                    <Input
                      id="destination"
                      placeholder="rrkah-fqaaa-aaaaa-aaaaq-cai"
                      {...register("destination")}
                    />
                    {errors.destination && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.destination.message}
                      </p>
                    )}
                    
                    {/* Address book shortcuts */}
                    {addresses.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-2">Quick select:</p>
                        <div className="flex flex-wrap gap-1">
                          {addresses.slice(0, 3).map((addr) => (
                            <Button
                              key={addr.id}
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-xs h-6"
                              onClick={() => selectAddress(addr.address)}
                            >
                              {addr.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="amount">Amount (cycles)</Label>
                    <Input
                      id="amount"
                      placeholder="1000000000000"
                      {...register("amount")}
                    />
                    {errors.amount && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.amount.message}
                      </p>
                    )}
                    
                    {/* Preset amounts */}
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-2">Presets:</p>
                      <div className="flex flex-wrap gap-1">
                        {cyclePresets.map((preset) => (
                          <Button
                            key={preset.value}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-xs h-6"
                            onClick={() => selectPreset(preset.value)}
                          >
                            {preset.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsSendDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Cycles"}
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
            placeholder="Search transfers by destination or amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      {filteredTransfers.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {transferHistory.length === 0 ? "No Transfers Yet" : "No Matching Transfers"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {transferHistory.length === 0 
                  ? "Send cycles to see your transfer history" 
                  : "Try adjusting your search or filters"}
              </p>
              {transferHistory.length === 0 && (
                <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Send className="h-4 w-4 mr-2" />
                      Send First Transfer
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
                  <TableHead>Destination</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="text-xs font-mono bg-muted px-2 py-1 rounded flex-1 min-w-0">
                          {transfer.destination}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(transfer.destination, transfer.id)}
                          className="flex-shrink-0 h-8 w-8 p-0"
                        >
                          {copiedAddress === transfer.id ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCycles(transfer.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={transfer.status === "success" ? "default" : "destructive"}
                        className="w-fit"
                      >
                        {transfer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {transfer.timestamp.toLocaleString()}
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
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTransfers.length)} of {filteredTransfers.length} transfers
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

      {/* Cycle Calculator Dialog */}
      <Dialog open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cycle Calculator</DialogTitle>
            <DialogDescription>
              Convert between different cycle units.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">1 TC (Trillion)</p>
                <p className="text-muted-foreground">1,000,000,000,000 cycles</p>
              </div>
              <div>
                <p className="font-medium">1 GC (Billion)</p>
                <p className="text-muted-foreground">1,000,000,000 cycles</p>
              </div>
              <div>
                <p className="font-medium">1 MC (Million)</p>
                <p className="text-muted-foreground">1,000,000 cycles</p>
              </div>
              <div>
                <p className="font-medium">1 KC (Thousand)</p>
                <p className="text-muted-foreground">1,000 cycles</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsCalculatorOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 