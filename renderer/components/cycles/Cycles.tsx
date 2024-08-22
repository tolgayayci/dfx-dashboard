import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { Loader2, RefreshCw } from "lucide-react";
import ConvertTab from "./ConvertTab";
import TransferTab from "./TransferTab";
import TopUpTab from "./TopUpTab";

export default function CyclesPage() {
  const [balance, setBalance] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allCanisters, setAllCanisters] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  const fetchCyclesBalance = async () => {
    setIsLoading(true);
    setError(null);
    setWarning(null);

    try {
      const result = await window.awesomeApi.runDfxCommand(
        "cycles",
        "balance",
        ["--network", "ic"]
      );

      const lines = result.split("\n");
      let balanceValue = "";

      for (const line of lines) {
        if (line.startsWith("WARN:")) {
          setWarning(line.substring(5).trim());
        } else if (line.includes("TC (trillion cycles)")) {
          balanceValue = line.trim();
        }
      }

      setBalance(balanceValue);
    } catch (err) {
      console.error("Error fetching cycles balance:", err);
      setError("Failed to fetch cycles balance. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCyclesBalance();
    // Assuming you have a method to fetch projects
    // fetchProjects().then(fetchedProjects => {
    //   setProjects(fetchedProjects);
    //   fetchedProjects.forEach(project => checkCanisters(project.path));
    // });
  }, []);

  return (
    <div>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-2">Cycles Balance</h2>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p>Fetching balance...</p>
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <p className="text-md">{balance || "No balance available"}</p>
              )}
            </div>
            <Button onClick={fetchCyclesBalance} disabled={isLoading}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="transfer" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="convert">Convert ICP</TabsTrigger>
          <TabsTrigger value="transfer">Transfer Cycles</TabsTrigger>
          <TabsTrigger value="topup">Top Up Canister</TabsTrigger>
        </TabsList>
        <TabsContent value="convert">
          <ConvertTab onSuccess={fetchCyclesBalance} />
        </TabsContent>
        <TabsContent value="transfer">
          <TransferTab onSuccess={fetchCyclesBalance} />
        </TabsContent>
        <TabsContent value="topup">
          <TabsContent value="topup">
            <TopUpTab onSuccess={fetchCyclesBalance} projects={projects} />
          </TabsContent>
        </TabsContent>
      </Tabs>
    </div>
  );
}
