import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { ScrollArea } from "@components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { useToast } from "@components/ui/use-toast";
import { RefreshCw, Wallet as WalletIcon, Users, UserCheck, BookOpen, Settings, Send, AlertCircle, Gift, ExternalLink } from "lucide-react";
import useNetworkPreference from "renderer/hooks/useNetworkPreference";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Import wallet tab components
import ControllerManagement from "./controller-management";
import AddressBook from "./address-book";
import CustodianManagement from "./custodian-management";
import CycleTransfers from "./cycle-transfers";
import WalletSettings from "./wallet-settings";

// Utility function to format cycles in readable units
const formatCycles = (cycles: string): string => {
  if (!cycles || cycles === "0") return "0 cycles";
  
  const numCycles = parseInt(cycles);
  if (isNaN(numCycles)) return cycles;
  
  if (numCycles >= 1_000_000_000_000) {
    // Show as TC (Trillion) for amounts >= 1 trillion
    const tc = (numCycles / 1_000_000_000_000).toFixed(2);
    return `${tc} TC`;
  } else if (numCycles >= 1_000_000_000) {
    // Show as GC (Billion) only for amounts >= 1 billion but < 1 trillion
    const gc = (numCycles / 1_000_000_000).toFixed(2);
    return `${gc} GC`;
  } else if (numCycles >= 1_000_000) {
    const mc = (numCycles / 1_000_000).toFixed(2);
    return `${mc} MC`;
  } else if (numCycles >= 1_000) {
    const kc = (numCycles / 1_000).toFixed(2);
    return `${kc} KC`;
  } else {
    return `${numCycles} cycles`;
  }
};

const couponSchema = z.object({
  coupon: z.string().min(1, "Coupon code is required"),
});

type CouponForm = z.infer<typeof couponSchema>;

export default function Wallet() {
  const [walletBalance, setWalletBalance] = useState<string>("");
  const [walletName, setWalletName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);
  const [walletError, setWalletError] = useState<string>("");
  const { toast } = useToast();
  const { networkPreference, isLoading: networkLoading } = useNetworkPreference();
  const [isFaucetDialogOpen, setIsFaucetDialogOpen] = useState(false);
  const [isRedeemingCoupon, setIsRedeemingCoupon] = useState(false);

  const {
    register: registerCoupon,
    handleSubmit: handleSubmitCoupon,
    reset: resetCoupon,
    formState: { errors: couponErrors },
  } = useForm<CouponForm>({
    resolver: zodResolver(couponSchema),
  });

  const fetchWalletInfo = async (showToastOnError = false) => {
    if (!showToastOnError) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setWalletError("");
    
    try {
      // Fetch wallet balance
      const balanceResult = await window.awesomeApi.walletGetBalance({
        network: networkPreference,
        precise: true
      });

      if (balanceResult.success) {
        setWalletBalance(balanceResult.data || "0");
        setHasWallet(true);
      } else {
        // Check if it's a wallet not found error
        if (balanceResult.error?.includes("Certificate verification failed") || 
            balanceResult.error?.includes("Failed to construct wallet canister caller")) {
          setHasWallet(false);
          setWalletError("No wallet found on this network. You may need to create a wallet first.");
          if (showToastOnError) {
            toast({
              title: "No Wallet Found",
              description: "No cycles wallet was found on this network",
              variant: "warning",
            });
          }
        } else {
          setHasWallet(false);
          setWalletError(balanceResult.error || "Failed to fetch wallet balance");
          if (showToastOnError) {
            toast({
              title: "Error",
              description: "Failed to fetch wallet balance",
              variant: "destructive",
            });
          }
        }
      }

      // Only fetch name if balance was successful
      if (balanceResult.success) {
        const nameResult = await window.awesomeApi.walletGetName({
          network: networkPreference
        });

        if (nameResult.success) {
          // Clean up the wallet name - if it contains dfx command text, show "No Name"
          const rawName = nameResult.data || "";
          if (rawName.includes("dfx wallet set-name") || rawName.includes("Name hasn't been set")) {
            setWalletName("No Name");
          } else {
            setWalletName(rawName || "No Name");
          }
        } else {
          setWalletName("No Name");
        }
      }
    } catch (error) {
      console.error("Error fetching wallet info:", error);
      setHasWallet(false);
      setWalletError("Failed to connect to wallet");
      if (showToastOnError) {
        toast({
          title: "Connection Error",
          description: "Failed to connect to wallet",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchWalletInfo(true); // Show toast on manual refresh errors
  };

  useEffect(() => {
    // Only fetch wallet info when network preference is loaded
    if (!networkLoading && networkPreference) {
      fetchWalletInfo(false); // Don't show toast on initial load
    }
  }, [networkPreference, networkLoading]);

  const onRedeemCoupon = async (data: CouponForm) => {
    setIsRedeemingCoupon(true);
    try {
      const result = await window.awesomeApi.walletRedeemFaucetCoupon(data.coupon, { 
        network: networkPreference,
        yes: true // Non-interactive mode
      });
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Coupon redeemed successfully! Wallet created.",
          variant: "success",
        });
        setIsFaucetDialogOpen(false);
        resetCoupon();
        // Refresh wallet info after successful redemption
        setTimeout(() => fetchWalletInfo(true), 2000);
      } else {
        throw new Error(result.error || "Failed to redeem coupon");
      }
    } catch (error) {
      console.error("Error redeeming coupon:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to redeem coupon",
        variant: "destructive",
      });
    } finally {
      setIsRedeemingCoupon(false);
    }
  };

  // Show loading state while network preference is loading or initial wallet fetch
  if (networkLoading || (isLoading && hasWallet === null)) {
    return (
      <div className="h-[calc(100vh-26px)] flex flex-col">
        {/* Header with loading state */}
        <div className="flex-shrink-0 mb-4">
          <div className="bg-card border rounded-lg p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center dark:bg-blue-900 dark:border-blue-800">
                  <WalletIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-base font-semibold">Wallet Management</h2>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-muted-foreground">Loading...</p>
                    <Badge variant="outline" className="text-xs">
                      {networkPreference || "..."}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={true}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-3 w-3 animate-spin" />
                <span className="text-xs">Loading</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Loading content */}
        <div className="flex-1 min-h-0">
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center dark:bg-blue-900 dark:border-blue-800 mx-auto mb-4">
                <RefreshCw className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Checking Wallet</h3>
              <p className="text-sm text-muted-foreground">
                Connecting to cycles wallet on the network...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show wallet setup message if no wallet is found
  if (hasWallet === false) {
    return (
      <div className="h-full flex flex-col p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center dark:bg-blue-900 dark:border-blue-800">
              <WalletIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Wallet Management</h2>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-muted-foreground">No wallet found</p>
                <Badge variant="outline" className="text-xs">
                  {networkPreference}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="text-xs">Retry</span>
          </Button>
        </div>

        {/* No wallet message */}
        <div className="flex-1 min-h-0">
          <Card className="h-full flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-16 w-16 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Cycles Wallet Found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {walletError || "No cycles wallet was found for your current identity on this network. You need to create or deploy a wallet to manage cycles."}
            </p>
            
            <div className="space-y-4 w-full max-w-md">
              {networkPreference === 'local' ? (
                <>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">For Local Development</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                      In local development, a cycles wallet is automatically created when you deploy canisters.
                    </p>
                    <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                      <p><strong>Option 1:</strong> Run <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">dfx deploy</code> in a project</p>
                      <p><strong>Option 2:</strong> Run <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">dfx canister create --all</code> in a project</p>
                    </div>
                  </div>
                  
                  <Dialog open={isFaucetDialogOpen} onOpenChange={setIsFaucetDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Gift className="h-4 w-4 mr-2" />
                        Redeem Faucet Coupon
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Redeem Faucet Coupon</DialogTitle>
                        <DialogDescription>
                          If you have a cycles faucet coupon, you can redeem it to create a wallet with cycles.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmitCoupon(onRedeemCoupon)}>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="coupon">Coupon Code</Label>
                            <Input
                              id="coupon"
                              placeholder="ABCDE-ABCDE-ABCDE"
                              {...registerCoupon("coupon")}
                            />
                            {couponErrors.coupon && (
                              <p className="text-sm text-red-500 mt-1">
                                {couponErrors.coupon.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <DialogFooter className="mt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsFaucetDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isRedeemingCoupon}>
                            {isRedeemingCoupon ? "Redeeming..." : "Redeem Coupon"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg dark:bg-orange-900/20 dark:border-orange-800">
                    <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">For Mainnet/IC Network</h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                      On the Internet Computer mainnet, you need to manually create a cycles wallet.
                    </p>
                    <div className="text-xs text-orange-600 dark:text-orange-400 space-y-1">
                      <p><strong>Method 1:</strong> Use a faucet coupon (easiest)</p>
                      <p><strong>Method 2:</strong> Convert ICP tokens to cycles</p>
                      <p><strong>Method 3:</strong> Use NNS dapp to create wallet</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <Dialog open={isFaucetDialogOpen} onOpenChange={setIsFaucetDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <Gift className="h-4 w-4 mr-2" />
                          Redeem Faucet Coupon
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Redeem Faucet Coupon</DialogTitle>
                          <DialogDescription>
                            Enter your cycles faucet coupon code. This will create a new wallet for you if you don't have one.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmitCoupon(onRedeemCoupon)}>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="coupon">Coupon Code</Label>
                              <Input
                                id="coupon"
                                placeholder="ABCDE-ABCDE-ABCDE"
                                {...registerCoupon("coupon")}
                              />
                              {couponErrors.coupon && (
                                <p className="text-sm text-red-500 mt-1">
                                  {couponErrors.coupon.message}
                                </p>
                              )}
                            </div>
                          </div>
                          <DialogFooter className="mt-6">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsFaucetDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" disabled={isRedeemingCoupon}>
                              {isRedeemingCoupon ? "Redeeming..." : "Redeem Coupon"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => window.awesomeApi.openExternalLink("https://faucet.dfinity.org")}
                      className="w-full"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Get Faucet Coupon
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => window.awesomeApi.openExternalLink("https://nns.ic0.app")}
                      className="w-full"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open NNS Dapp
                    </Button>
                  </div>
                </>
              )}
              
              <div className="pt-4 border-t">
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>Need help?</strong></p>
                  <p>• Check the <a href="https://internetcomputer.org/docs/building-apps/canister-management/cycles-wallet" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">cycles wallet documentation</a></p>
                  <p>• Visit the <a href="https://forum.dfinity.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">developer forum</a></p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-26px)] flex flex-col">
      {/* Header with wallet info */}
      <div className="flex-shrink-0 mb-4">
        <div className="bg-card border rounded-lg p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center dark:bg-blue-900 dark:border-blue-800">
                <WalletIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold">
                  {walletName && walletName !== "No Name" ? walletName : "Wallet Management"}
                </h2>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-muted-foreground">
                    Balance: {walletBalance ? formatCycles(walletBalance) : "Loading..."}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {networkPreference}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="text-xs">Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="flex-1 min-h-0">
        <Tabs defaultValue="controllers" className="h-full flex flex-col">
          <TabsList className="flex-shrink-0 grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="controllers" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Controllers</span>
            </TabsTrigger>
            <TabsTrigger value="custodians" className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Custodians</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Address Book</span>
            </TabsTrigger>
            <TabsTrigger value="transfers" className="flex items-center space-x-2">
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Transfers</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-h-0">
            <TabsContent value="controllers" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <ScrollArea className="h-full">
                <div className="p-1">
                  <ControllerManagement 
                    network={networkPreference}
                    onRefresh={() => fetchWalletInfo(true)}
                  />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="custodians" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <ScrollArea className="h-full">
                <div className="p-1">
                  <CustodianManagement 
                    network={networkPreference}
                    onRefresh={() => fetchWalletInfo(true)}
                  />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="addresses" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <ScrollArea className="h-full">
                <div className="p-1">
                  <AddressBook 
                    network={networkPreference}
                  />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="transfers" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <ScrollArea className="h-full">
                <div className="p-1">
                  <CycleTransfers 
                    network={networkPreference}
                    walletBalance={walletBalance}
                    onRefresh={() => fetchWalletInfo(true)}
                  />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="settings" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <ScrollArea className="h-full">
                <div className="p-1">
                  <WalletSettings 
                    network={networkPreference}
                    walletName={walletName}
                    onRefresh={() => fetchWalletInfo(true)}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
} 