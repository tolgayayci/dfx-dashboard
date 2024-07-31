import { useState, useEffect } from "react";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { AlertCircle, Loader2, ArrowUpIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@components/ui/dialog";

export default function TopUpModal({
  canisterName,
  projectPath,
}: {
  canisterName: string;
  projectPath: string;
}) {
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpStatus, setTopUpStatus] = useState(null);
  const [identityCyclesBalance, setIdentityCyclesBalance] = useState(null);
  const [canisterCyclesBalance, setCanisterCyclesBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkBalances = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Check identity cycles balance
      const identityOutput = await window.awesomeApi.runDfxCommand(
        "cycles",
        "balance",
        [],
        ["--network", "ic"],
        projectPath
      );
      const identityMatch = identityOutput.match(/(\d+) cycles/);
      if (identityMatch) {
        setIdentityCyclesBalance(BigInt(identityMatch[1]));
      }

      // Check canister cycles balance
      const canisterOutput = await window.awesomeApi.runDfxCommand(
        "canister",
        "status",
        [canisterName],
        ["--network", "ic"],
        projectPath
      );
      const balanceMatch = canisterOutput.match(/Balance: ([\d_]+) Cycles/);
      if (balanceMatch) {
        const balanceString = balanceMatch[1].replace(/_/g, "");
        setCanisterCyclesBalance(BigInt(balanceString));
      } else {
        throw new Error("Couldn't find canister balance in the output");
      }
    } catch (error) {
      console.error("Failed to fetch balances:", error);
      setError(`Error fetching balances: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showTopUpModal) {
      checkBalances();
    }
  }, [showTopUpModal]);

  const handleTopUp = async () => {
    if (!identityCyclesBalance || identityCyclesBalance < BigInt(topUpAmount)) {
      setTopUpStatus({
        type: "error",
        message: "Insufficient cycles in your identity balance.",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const output = await window.awesomeApi.runDfxCommand(
        "cycles",
        "top-up",
        [topUpAmount, canisterName],
        ["--network", "ic"],
        projectPath
      );
      setTopUpStatus({
        type: "success",
        message: "Top-up successful: " + output,
      });
      // Refresh balances after successful top-up
      await checkBalances();
    } catch (error) {
      setTopUpStatus({
        type: "error",
        message: "Top-up failed: " + error.message,
      });
      setError(`Error topping up canister: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = () => {
    if (isLoading) {
      return (
        <div className="h-full">
          <div className="border border-gray-200 rounded-lg p-8 w-full h-full flex justify-center items-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="h-full">
          <div className="border border-red-200 bg-red-50 rounded-lg p-4 w-full h-full flex justify-center items-center">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {canisterCyclesBalance !== null && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700 font-semibold">
              Canister Cycle Balance:{" "}
              <span className="font-bold text-blue-800">
                {canisterCyclesBalance.toLocaleString()} Cycles
              </span>
            </p>
          </div>
        )}
        {identityCyclesBalance !== null && (
          <p>
            Your Identity Cycle Balance:{" "}
            {identityCyclesBalance.toLocaleString()} cycles
          </p>
        )}
        <div className="flex space-x-4 items-center">
          <Input
            type="number"
            placeholder="Amount of cycles"
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            className="flex-grow"
          />
          <Button
            onClick={handleTopUp}
            className="whitespace-nowrap px-6 py-2 font-md"
          >
            Top Up
          </Button>
        </div>
        {topUpStatus && (
          <Alert
            variant={topUpStatus.type === "success" ? "default" : "destructive"}
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {topUpStatus.type === "success" ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription>{topUpStatus.message}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  return (
    <Dialog open={showTopUpModal} onOpenChange={setShowTopUpModal}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ArrowUpIcon className="w-5 h-5 mr-2" />
          Top Up
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[calc(70vw-106px)]">
        <DialogHeader className="mb-2">
          <DialogTitle>Top Up "{canisterName}"</DialogTitle>
        </DialogHeader>
        {modalContent()}
      </DialogContent>
    </Dialog>
  );
}
