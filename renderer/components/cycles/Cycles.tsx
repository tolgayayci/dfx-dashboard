import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Button } from "@components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/ui/tooltip";
import { Wallet, ArrowRightLeft, DollarSign, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "@components/ui/use-toast";
import BalanceOperations from "./balance-operations";
import TransferOperations from "./transfer-operations";
import FaucetOperations from "./faucet-operations";

export default function CyclesPage() {
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  const fetchCyclesBalance = async () => {
    setIsLoading(true);
    setHasAttemptedFetch(true);

    try {
      const result = await window.awesomeApi.cyclesBalance({
        network: "ic",
      });

      if (result.success) {
        const lines = result.data.split("\n");
        let balanceValue = "";

        for (const line of lines) {
          if (line.startsWith("WARN:")) {
            console.warn(line.substring(5).trim());
          } else if (line.includes("TC (trillion cycles)")) {
            balanceValue = line.trim();
          } else if (line.includes("cycles.") && !balanceValue) {
            // Fallback for different output formats
            balanceValue = line.trim();
          }
        }

        setBalance(balanceValue);
        
        toast({
          title: "Balance Retrieved",
          description: balanceValue || "Balance information fetched successfully",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error("Error fetching cycles balance:", err);
      
      toast({
        title: "Connection Error",
        description: "Failed to fetch cycles balance. Please ensure you have dfx configured and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-26px)] flex flex-col">
      {/* Header with Balance */}
      <div className="flex-shrink-0 mb-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold">Current Balance</h2>
              <p className="text-sm font-mono mt-1 text-muted-foreground truncate">
                {isLoading ? "Loading..." : balance || "Click 'Check Balance' to view your cycles"}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchCyclesBalance}
              disabled={isLoading}
              className="flex-shrink-0 ml-4"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {balance ? "Refresh" : "Check Balance"}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="flex-1 min-h-0">
        <Tabs defaultValue="balance" className="h-full flex flex-col">
          <TabsList className="flex-shrink-0 grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="balance" className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center">
                <Wallet className="h-3 w-3 text-blue-600" />
              </div>
              Balance & Approvals
            </TabsTrigger>
            <TabsTrigger value="transfers" className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center">
                <ArrowRightLeft className="h-3 w-3 text-green-600" />
              </div>
              Transfers & Top-ups
            </TabsTrigger>
            <TabsTrigger value="convert" className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center">
                <DollarSign className="h-3 w-3 text-purple-600" />
              </div>
              Convert & Faucet
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-h-0">
            <TabsContent value="balance" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <div className="flex-1 min-h-0 pb-24">
                <BalanceOperations
                  balance={balance}
                  isLoadingBalance={isLoading}
                  onRefreshBalance={fetchCyclesBalance}
                />
              </div>
            </TabsContent>

            <TabsContent value="transfers" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <div className="flex-1 min-h-0 pb-24">
                <TransferOperations onSuccess={fetchCyclesBalance} />
              </div>
            </TabsContent>

            <TabsContent value="convert" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <div className="flex-1 min-h-0 pb-24">
                <FaucetOperations onSuccess={fetchCyclesBalance} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={fetchCyclesBalance}
            disabled={isLoading}
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <RefreshCw className="h-6 w-6" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{isLoading ? "Checking balance..." : balance ? "Refresh Balance" : "Check Balance"}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
