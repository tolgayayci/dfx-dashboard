"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Badge } from "@components/ui/badge";
import { ScrollArea } from "@components/ui/scroll-area";
import { useToast } from "@components/ui/use-toast";
import { Copy, RefreshCw, Wallet, User, CreditCard, Eye, Loader2 } from "lucide-react";

interface AccountManagementProps {
  activeIdentityName: string;
  balance?: string | null;
  accountId?: string | null;
  onRefresh?: () => void;
}

interface AccountInfo {
  accountId: string;
  principal: string;
  balance: string;
}

export default function AccountManagement({ 
  activeIdentityName, 
  balance: propBalance, 
  accountId: propAccountId, 
  onRefresh 
}: AccountManagementProps) {
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customPrincipal, setCustomPrincipal] = useState("");
  const [customAccountId, setCustomAccountId] = useState("");
  const [isLoadingConverter, setIsLoadingConverter] = useState(false);
  const { toast } = useToast();

  const fetchAccountInfo = async () => {
    if (!activeIdentityName) return;
    
    setIsLoading(true);
    try {
      // Get account ID for current identity
      const accountIdResult = await window.awesomeApi.ledgerGetAccountId(activeIdentityName);
      if (!accountIdResult.success) {
        throw new Error(accountIdResult.error);
      }

      // Get principal for current identity
      const principalResult = await window.awesomeApi.runDfxCommand("identity", "get-principal", [], [], "");
      if (typeof principalResult !== 'string') {
        throw new Error("Failed to get principal");
      }

      // Get balance for the account
      const balanceResult = await window.awesomeApi.ledgerGetBalance(accountIdResult.data, "local");
      
      setAccountInfo({
        accountId: accountIdResult.data,
        principal: principalResult.trim(),
        balance: balanceResult.success ? balanceResult.data : "0.00000000 ICP"
      });
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

  const handleCopyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: `${label} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleCustomPrincipalLookup = async () => {
    if (!customPrincipal.trim()) {
      toast({
        title: "Error",
        description: "Please enter a principal",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingConverter(true);
    try {
      const result = await window.awesomeApi.ledgerGetAccountId(customPrincipal, "principal");
      if (result.success) {
        setCustomAccountId(result.data);
        toast({
          title: "Success",
          description: "Account ID generated successfully",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to generate account ID: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoadingConverter(false);
    }
  };

  const refreshBalance = async () => {
    if (onRefresh) {
      onRefresh();
    } else if (accountInfo?.accountId) {
      setIsLoading(true);
      try {
        const balanceResult = await window.awesomeApi.ledgerGetBalance(accountInfo.accountId, "local");
        if (balanceResult.success) {
          setAccountInfo(prev => prev ? { ...prev, balance: balanceResult.data } : null);
          toast({
            title: "Success",
            description: "Balance refreshed successfully",
          });
        } else {
          throw new Error(balanceResult.error);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to refresh balance: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!propAccountId || !propBalance) {
      fetchAccountInfo();
    } else {
      // Use props if available
      const getPrincipal = async () => {
        try {
          const principalResult = await window.awesomeApi.runDfxCommand("identity", "get-principal", [], [], "");
          if (typeof principalResult === 'string') {
            setAccountInfo({
              accountId: propAccountId,
              principal: principalResult.trim(),
              balance: propBalance
            });
          }
        } catch (error) {
          console.error("Error getting principal:", error);
        }
      };
      getPrincipal();
    }
  }, [activeIdentityName, propAccountId, propBalance]);

  return (
    <div className="h-full">
      <ScrollArea className="h-full">
        <div className="space-y-6">
          {/* Current Identity Account Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Current Identity Account</CardTitle>
                  <CardDescription>
                    Account information for identity: {activeIdentityName}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {accountInfo ? (
                <>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Principal</Label>
                    <div className="flex items-center gap-2">
                      <Input value={accountInfo.principal} readOnly className="font-mono text-sm bg-muted/50" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyToClipboard(accountInfo.principal, "Principal")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Account ID</Label>
                    <div className="flex items-center gap-2">
                      <Input value={accountInfo.accountId} readOnly className="font-mono text-sm bg-muted/50" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyToClipboard(accountInfo.accountId, "Account ID")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">ICP Balance</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={refreshBalance}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center">
                          <Wallet className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="font-mono text-lg font-semibold">{accountInfo.balance}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center space-y-2">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading account information...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Principal to Account ID Converter */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Principal to Account ID Converter</CardTitle>
                  <CardDescription>
                    Convert any principal to its corresponding account identifier
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Principal</Label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Enter principal (e.g., rdmx6-jaaaa-aaaaa-aaadq-cai)"
                    value={customPrincipal}
                    onChange={(e) => setCustomPrincipal(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <Button 
                    onClick={handleCustomPrincipalLookup}
                    disabled={isLoadingConverter}
                  >
                    {isLoadingConverter ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Eye className="h-4 w-4 mr-2" />
                    )}
                    Convert
                  </Button>
                </div>
              </div>

              {customAccountId && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Generated Account ID</Label>
                  <div className="flex items-center gap-2">
                    <Input value={customAccountId} readOnly className="font-mono text-sm bg-muted/50" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyToClipboard(customAccountId, "Account ID")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add some bottom padding to ensure scrolling to bottom works */}
          <div className="h-8"></div>
        </div>
      </ScrollArea>
    </div>
  );
} 