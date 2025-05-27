"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { User, Send, History } from "lucide-react";
import { toast } from "@components/ui/use-toast";
import AccountManagement from "./account-management";
import ICPOperations from "./icp-operations";
import TransactionHistory from "./transaction-history";

interface LedgerTabProps {
  activeIdentityName: string;
}

export default function LedgerTab({ activeIdentityName }: LedgerTabProps) {
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);

  const fetchAccountInfo = async () => {
    if (!activeIdentityName) return;
    
    setIsLoading(true);
    try {
      // Get account ID for current identity
      const accountIdResult = await window.awesomeApi.ledgerGetAccountId(activeIdentityName);
      if (accountIdResult.success) {
        setAccountId(accountIdResult.data);
        
        // Get balance for the account
        const balanceResult = await window.awesomeApi.ledgerGetBalance(accountIdResult.data, "local");
        if (balanceResult.success) {
          setBalance(balanceResult.data);
        }
      }
    } catch (error) {
      console.error("Error fetching account info:", error);
      toast({
        title: "Error",
        description: `Failed to fetch account information: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountInfo();
  }, [activeIdentityName]);

  return (
    <div className="h-full flex flex-col">
      {/* Tabs Content */}
      <div className="flex-1 min-h-0">
        <Tabs defaultValue="account" className="h-full flex flex-col">
          <TabsList className="flex-shrink-0 grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center">
                <User className="h-3 w-3 text-blue-600" />
              </div>
              Account
            </TabsTrigger>
            <TabsTrigger value="operations" className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center">
                <Send className="h-3 w-3 text-green-600" />
              </div>
              Operations
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center">
                <History className="h-3 w-3 text-purple-600" />
              </div>
              History
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-h-0">
            <TabsContent value="account" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <div className="flex-1 min-h-0">
                <AccountManagement 
                  activeIdentityName={activeIdentityName}
                  balance={balance}
                  accountId={accountId}
                  onRefresh={fetchAccountInfo}
                />
              </div>
            </TabsContent>

            <TabsContent value="operations" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <div className="flex-1 min-h-0">
                <ICPOperations 
                  activeIdentityName={activeIdentityName}
                  onSuccess={fetchAccountInfo}
                />
              </div>
            </TabsContent>

            <TabsContent value="history" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <div className="flex-1 min-h-0">
                <TransactionHistory 
                  activeIdentityName={activeIdentityName}
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
} 