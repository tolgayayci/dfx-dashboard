"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { ScrollArea } from "@components/ui/scroll-area";
import { useToast } from "@components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { RefreshCw, History, Bell, BellOff, Loader2, TrendingUp, CheckCircle, Clock } from "lucide-react";

interface TransactionHistoryProps {
  activeIdentityName: string;
}

interface Transaction {
  id: string;
  hash: string;
  type: string;
  amount: string;
  fee: string;
  from: string;
  to: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  blockHeight: number;
  memo: string;
}

export default function TransactionHistory({ activeIdentityName }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { toast } = useToast();

  const fetchTransactionHistory = async () => {
    setIsLoading(true);
    try {
      const result = await window.awesomeApi.ledgerGetTransactions(activeIdentityName);
      if (result.success) {
        // Convert the backend data structure to match our Transaction interface
        const backendTransactions = result.data || [];
        const convertedTransactions: Transaction[] = backendTransactions.map((tx, index) => ({
          id: `${tx.blockHeight}-${index}`,
          hash: `${tx.blockHeight}`,
          type: tx.operation,
          amount: tx.amount,
          fee: "0.0001", // Default fee for ICP transactions
          from: tx.from,
          to: tx.to,
          timestamp: tx.timestamp,
          status: tx.status,
          blockHeight: tx.blockHeight,
          memo: tx.memo,
        }));
        setTransactions(convertedTransactions);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      toast({
        title: "Error",
        description: `Failed to fetch transaction history: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotifications = async () => {
    try {
      const result = await window.awesomeApi.ledgerSetupNotifications(!notificationsEnabled);
      if (result.success) {
        setNotificationsEnabled(!notificationsEnabled);
        toast({
          title: notificationsEnabled ? "Notifications Disabled" : "Notifications Enabled",
          description: notificationsEnabled 
            ? "Transaction notifications have been disabled" 
            : "You will now receive transaction notifications",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to toggle notifications: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500/20 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatAmount = (amount: string) => {
    return `${amount} ICP`;
  };

  const formatAddress = (address: string) => {
    if (address.length > 20) {
      return `${address.slice(0, 10)}...${address.slice(-10)}`;
    }
    return address;
  };

  useEffect(() => {
    if (activeIdentityName) {
      fetchTransactionHistory();
    }
  }, [activeIdentityName]);

  const completedTransactions = transactions.filter(t => t.status === "completed").length;
  const pendingTransactions = transactions.filter(t => t.status === "pending").length;

  return (
    <div className="h-full">
      <ScrollArea className="h-full">
        <div className="space-y-6">
          {/* Transaction History Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <History className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Transaction History</CardTitle>
                    <CardDescription>
                      View your ICP transaction history for identity: {activeIdentityName}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleNotifications}
                  >
                    {notificationsEnabled ? (
                      <>
                        <BellOff className="h-4 w-4 mr-2" />
                        Disable
                      </>
                    ) : (
                      <>
                        <Bell className="h-4 w-4 mr-2" />
                        Enable
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchTransactionHistory}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Transaction Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center">
                    <TrendingUp className="h-3 w-3 text-blue-600" />
                  </div>
                  <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{transactions.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {completedTransactions}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-yellow-500/20 flex items-center justify-center">
                    <Clock className="h-3 w-3 text-yellow-600" />
                  </div>
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {pendingTransactions}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Table */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-2">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading transaction history...</p>
                  </div>
                </div>
              ) : transactions.length > 0 ? (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs font-medium">Block Height</TableHead>
                        <TableHead className="text-xs font-medium">Timestamp</TableHead>
                        <TableHead className="text-xs font-medium">Operation</TableHead>
                        <TableHead className="text-xs font-medium">Amount</TableHead>
                        <TableHead className="text-xs font-medium">From</TableHead>
                        <TableHead className="text-xs font-medium">To</TableHead>
                        <TableHead className="text-xs font-medium">Memo</TableHead>
                        <TableHead className="text-xs font-medium">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.blockHeight}>
                          <TableCell className="font-mono text-sm">
                            {transaction.blockHeight}
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">{transaction.type}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {formatAmount(transaction.amount)}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {formatAddress(transaction.from)}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {formatAddress(transaction.to)}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {transaction.memo}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(transaction.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
                      <History className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">No Transactions Found</p>
                      <p className="text-sm text-muted-foreground text-center max-w-md leading-relaxed mt-2">
                        No transaction history available for this identity.
                        <br />
                        Transactions will appear here once you start using ICP operations.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add some bottom margin to ensure scrolling to bottom works */}
          <div className="h-8"></div>
        </div>
      </ScrollArea>
    </div>
  );
} 