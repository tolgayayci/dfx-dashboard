import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { ScrollArea } from "@components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@components/ui/form";
import { toast } from "@components/ui/use-toast";
import { CheckCircle, Loader2, Eye } from "lucide-react";

const approveSchema = z.object({
  spender: z
    .string()
    .nonempty("Spender principal is required")
    .regex(/^[a-z0-9-]+$/, "Must be a valid principal"),
  amount: z
    .string()
    .nonempty("Amount is required")
    .regex(/^\d+$/, "Must be a valid number of cycles"),
  memo: z.string().optional(),
  expiresAt: z.string().optional(),
});

type ApproveForm = z.infer<typeof approveSchema>;

interface BalanceOperationsProps {
  balance: string | null;
  isLoadingBalance: boolean;
  onRefreshBalance: () => void;
}

export default function BalanceOperations({
  balance,
  isLoadingBalance,
  onRefreshBalance,
}: BalanceOperationsProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [preciseBalance, setPreciseBalance] = useState<string | null>(null);
  const [isLoadingPrecise, setIsLoadingPrecise] = useState(false);

  const approveForm = useForm<ApproveForm>({
    resolver: zodResolver(approveSchema),
    defaultValues: {
      spender: "",
      amount: "",
      memo: "",
      expiresAt: "",
    },
  });

  const fetchPreciseBalance = async () => {
    setIsLoadingPrecise(true);
    try {
      const result = await window.awesomeApi.cyclesBalance({
        network: "ic",
        precise: true,
      });

      if (result.success) {
        const lines = result.data.split("\n");
        for (const line of lines) {
          if (line.includes("cycles.")) {
            setPreciseBalance(line.trim());
            break;
          }
        }

        toast({
          title: "Precise Balance Retrieved",
          description: "Exact cycle count has been fetched.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching precise balance:", error);
      toast({
        title: "Error",
        description: "Failed to fetch precise balance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPrecise(false);
    }
  };

  const onApproveSubmit = async (data: ApproveForm) => {
    setIsApproving(true);
    try {
      const options: any = { network: "ic" };
      
      if (data.memo) {
        options.memo = data.memo;
      }
      
      if (data.expiresAt) {
        options.expiresAt = data.expiresAt;
      }

      const result = await window.awesomeApi.cyclesApprove(data.spender, data.amount, options);

      if (result.success) {
        toast({
          title: "Approval Successful",
          description: `Successfully approved ${data.spender} to spend ${data.amount} cycles.`,
        });

        approveForm.reset();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error approving cycles:", error);
      toast({
        title: "Approval Failed",
        description: "Failed to approve cycles spending. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full border rounded-md">
        <div className="space-y-6 p-2">
          {/* Precise Balance Section */}
          {balance && (
            <Card className="border-0 shadow-none">
              <CardHeader>
                <CardTitle className="text-lg">Precise Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    View exact cycle count with full precision
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchPreciseBalance}
                    disabled={isLoadingPrecise}
                  >
                    {isLoadingPrecise ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Eye className="h-4 w-4 mr-2" />
                    )}
                    Show Precise
                  </Button>
                </div>
                {preciseBalance && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <p className="font-mono text-sm">{preciseBalance}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Approve Spending Section */}
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Approve Spending</CardTitle>
              <p className="text-sm text-muted-foreground">
                Allow another principal to spend cycles on your behalf
              </p>
            </CardHeader>
            <CardContent>
              <Form {...approveForm}>
                <form
                  onSubmit={approveForm.handleSubmit(onApproveSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={approveForm.control}
                    name="spender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spender Principal</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="raxcz-bidhr-evrzj-qyivt-nht5a-eltcc-24qfc-o6cvi-hfw7j-dcecz-kae"
                          />
                        </FormControl>
                        <FormDescription>
                          The principal that will be allowed to spend cycles
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={approveForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (cycles)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="1000000000" />
                        </FormControl>
                        <FormDescription>
                          Number of cycles to approve for spending
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={approveForm.control}
                      name="memo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Memo (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Transaction memo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={approveForm.control}
                      name="expiresAt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expires At (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Timestamp in nanoseconds" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={isApproving} className="w-full">
                    {isApproving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Approve Spending
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
} 