import React, { useState } from "react";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { useToast } from "@components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { Settings, RefreshCw, Zap, AlertTriangle, Gift, Edit3 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const setNameSchema = z.object({
  name: z.string().min(1, "Wallet name is required").max(50, "Name too long"),
});

const couponSchema = z.object({
  coupon: z.string().min(1, "Coupon code is required"),
});

type SetNameForm = z.infer<typeof setNameSchema>;
type CouponForm = z.infer<typeof couponSchema>;

interface WalletSettingsProps {
  network: string;
  walletName: string;
  onRefresh?: () => void;
}

export default function WalletSettings({ network, walletName, onRefresh }: WalletSettingsProps) {
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [isFaucetDialogOpen, setIsFaucetDialogOpen] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isRedeemingCoupon, setIsRedeemingCoupon] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SetNameForm>({
    resolver: zodResolver(setNameSchema),
    defaultValues: {
      name: walletName || "",
    },
  });

  const {
    register: registerCoupon,
    handleSubmit: handleSubmitCoupon,
    reset: resetCoupon,
    formState: { errors: couponErrors },
  } = useForm<CouponForm>({
    resolver: zodResolver(couponSchema),
  });

  const onSetName = async (data: SetNameForm) => {
    try {
      const result = await window.awesomeApi.walletSetName(data.name, { network });
      if (result.success) {
        toast({
          title: "Success",
          description: "Wallet name updated successfully",
          variant: "success",
        });
        setIsNameDialogOpen(false);
        reset();
        onRefresh?.();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update wallet name",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error setting wallet name:", error);
      toast({
        title: "Error",
        description: "Failed to update wallet name",
        variant: "destructive",
      });
    }
  };

  const upgradeWallet = async () => {
    setIsUpgrading(true);
    try {
      const result = await window.awesomeApi.walletUpgrade({ network });
      if (result.success) {
        toast({
          title: "Success",
          description: "Wallet upgraded successfully",
          variant: "success",
        });
        setIsUpgradeDialogOpen(false);
        onRefresh?.();
      } else {
        toast({
          title: "Upgrade Failed",
          description: result.error || "Failed to upgrade wallet",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error upgrading wallet:", error);
      toast({
        title: "Error",
        description: "Failed to upgrade wallet",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const onRedeemCoupon = async (data: CouponForm) => {
    setIsRedeemingCoupon(true);
    try {
      const result = await window.awesomeApi.walletRedeemFaucetCoupon(data.coupon, { network });
      if (result.success) {
        toast({
          title: "Success",
          description: "Coupon redeemed successfully",
          variant: "success",
        });
        setIsFaucetDialogOpen(false);
        resetCoupon();
        onRefresh?.();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to redeem coupon",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error redeeming coupon:", error);
      toast({
        title: "Error",
        description: "Failed to redeem coupon",
        variant: "destructive",
      });
    } finally {
      setIsRedeemingCoupon(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-l-4 border-gray-500 pl-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center dark:bg-gray-900 dark:border-gray-800">
            <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold">Wallet Settings</h3>
            <p className="text-xs text-muted-foreground">
              Manage your wallet configuration and operations.
            </p>
          </div>
        </div>
      </div>

      {/* Settings Items */}
      <div className="space-y-3">
        {/* Wallet Name */}
        <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-md bg-purple-50 flex items-center justify-center dark:bg-purple-950">
                <Edit3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Wallet Name</h4>
                <p className="text-xs text-muted-foreground font-mono">
                  {walletName || "Unnamed Wallet"}
                </p>
              </div>
            </div>
            <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit3 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Set Wallet Name</DialogTitle>
                  <DialogDescription>
                    Choose a name for your cycles wallet to easily identify it.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSetName)}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Wallet Name</Label>
                      <Input
                        id="name"
                        placeholder="My Cycles Wallet"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter className="mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsNameDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Updating..." : "Update Name"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Wallet Upgrade */}
        <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center dark:bg-blue-950">
                <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Upgrade Wallet</h4>
                <p className="text-xs text-muted-foreground">Update to latest Wasm module</p>
              </div>
            </div>
            <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Zap className="h-3 w-3 mr-1" />
                  Upgrade
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span>Upgrade Wallet</span>
                  </DialogTitle>
                  <DialogDescription>
                    This will upgrade your cycles wallet's Wasm module to the current version bundled with DFX.
                    This operation cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md dark:bg-yellow-900/20 dark:border-yellow-800">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Warning</h4>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        Make sure you understand the implications of upgrading your wallet.
                        Always backup important data before proceeding.
                      </p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsUpgradeDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={upgradeWallet}
                    disabled={isUpgrading}
                    variant="default"
                  >
                    {isUpgrading ? (
                      <>
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Upgrading...
                      </>
                    ) : (
                      <>
                        <Zap className="h-3 w-3 mr-1" />
                        Upgrade
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Redeem Faucet Coupon */}
        <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-md bg-green-50 flex items-center justify-center dark:bg-green-950">
                <Gift className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Redeem Faucet Coupon</h4>
                <p className="text-xs text-muted-foreground">Add cycles using a coupon code</p>
              </div>
            </div>
            <Dialog open={isFaucetDialogOpen} onOpenChange={setIsFaucetDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Gift className="h-3 w-3 mr-1" />
                  Redeem
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Redeem Faucet Coupon</DialogTitle>
                  <DialogDescription>
                    Enter your cycles faucet coupon code to add cycles to your wallet.
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
                    <div className="text-xs text-muted-foreground">
                      If you have no wallet set, redeeming a coupon will create a wallet for you.
                      If you already have a wallet, the coupon's cycles will be added to your existing wallet.
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
          </div>
        </div>
      </div>
    </div>
  );
} 