import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { ScrollArea } from "@components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
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
import { ArrowRightLeft, TrendingUp, Loader2 } from "lucide-react";

const transferSchema = z.object({
  to: z
    .string()
    .nonempty("Recipient principal is required")
    .regex(/^[a-z0-9-]+$/, "Must be a valid principal"),
  amount: z
    .string()
    .nonempty("Amount is required")
    .regex(/^\d+$/, "Must be a valid number of cycles"),
  memo: z.string().optional(),
  fromSubaccount: z.string().optional(),
  toSubaccount: z.string().optional(),
});

const topUpSchema = z.object({
  canister: z
    .string()
    .nonempty("Canister name or principal is required"),
  amount: z
    .string()
    .nonempty("Amount is required")
    .regex(/^\d+$/, "Must be a valid number of cycles"),
  fromSubaccount: z.string().optional(),
});

type TransferForm = z.infer<typeof transferSchema>;
type TopUpForm = z.infer<typeof topUpSchema>;

interface TransferOperationsProps {
  onSuccess: () => void;
}

export default function TransferOperations({ onSuccess }: TransferOperationsProps) {
  const [isTransferring, setIsTransferring] = useState(false);
  const [isToppingUp, setIsToppingUp] = useState(false);

  const transferForm = useForm<TransferForm>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      to: "",
      amount: "",
      memo: "",
      fromSubaccount: "",
      toSubaccount: "",
    },
  });

  const topUpForm = useForm<TopUpForm>({
    resolver: zodResolver(topUpSchema),
    defaultValues: {
      canister: "",
      amount: "",
      fromSubaccount: "",
    },
  });

  const onTransferSubmit = async (data: TransferForm) => {
    setIsTransferring(true);
    try {
      const options: any = { network: "ic" };
      
      if (data.memo) {
        options.memo = data.memo;
      }
      
      if (data.fromSubaccount) {
        options.fromSubaccount = data.fromSubaccount;
      }
      
      if (data.toSubaccount) {
        options.toSubaccount = data.toSubaccount;
      }

      const result = await window.awesomeApi.cyclesTransfer(data.to, data.amount, options);

      if (result.success) {
        toast({
          title: "Transfer Successful",
          description: `Successfully transferred ${data.amount} cycles to ${data.to}.`,
        });

        transferForm.reset();
        onSuccess();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error transferring cycles:", error);
      toast({
        title: "Transfer Failed",
        description: "Failed to transfer cycles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTransferring(false);
    }
  };

  const onTopUpSubmit = async (data: TopUpForm) => {
    setIsToppingUp(true);
    try {
      const options: any = { network: "ic" };
      
      if (data.fromSubaccount) {
        options.fromSubaccount = data.fromSubaccount;
      }

      const result = await window.awesomeApi.cyclesTopUp(data.canister, data.amount, options);

      if (result.success) {
        toast({
          title: "Top-up Successful",
          description: `Successfully topped up ${data.canister} with ${data.amount} cycles.`,
        });

        topUpForm.reset();
        onSuccess();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error topping up canister:", error);
      toast({
        title: "Top-up Failed",
        description: "Failed to top up canister. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsToppingUp(false);
    }
  };

  return (
    <div className="h-full">
      <Tabs defaultValue="transfer" className="h-full flex flex-col">
        <TabsList className="flex-shrink-0 grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="transfer" className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            Transfer Cycles
          </TabsTrigger>
          <TabsTrigger value="topup" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Top-up Canister
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full border rounded-md">
            <TabsContent value="transfer" className="m-0 p-2">
              <Card className="border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Transfer Cycles</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Send cycles to another principal's account
                  </p>
                </CardHeader>
                <CardContent>
                  <Form {...transferForm}>
                    <form
                      onSubmit={transferForm.handleSubmit(onTransferSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={transferForm.control}
                        name="to"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recipient Principal</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="raxcz-bidhr-evrzj-qyivt-nht5a-eltcc-24qfc-o6cvi-hfw7j-dcecz-kae"
                              />
                            </FormControl>
                            <FormDescription>
                              The principal to receive the cycles
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={transferForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount (cycles)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="1000000000" />
                            </FormControl>
                            <FormDescription>
                              Number of cycles to transfer
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={transferForm.control}
                          name="fromSubaccount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>From Subaccount (optional)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Subaccount hex" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={transferForm.control}
                          name="toSubaccount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>To Subaccount (optional)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Subaccount hex" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={transferForm.control}
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

                      <Button type="submit" disabled={isTransferring} className="w-full">
                        {isTransferring ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRightLeft className="mr-2 h-4 w-4" />
                        )}
                        Transfer Cycles
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="topup" className="m-0 p-2">
              <Card className="border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Top-up Canister</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Send cycles directly to a canister
                  </p>
                </CardHeader>
                <CardContent>
                  <Form {...topUpForm}>
                    <form
                      onSubmit={topUpForm.handleSubmit(onTopUpSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={topUpForm.control}
                        name="canister"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Canister</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="my_backend or bkyz2-fmaaa-aaaaa-qaaaq-cai"
                              />
                            </FormControl>
                            <FormDescription>
                              Canister name from your project or canister principal
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={topUpForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount (cycles)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="1000000000" />
                            </FormControl>
                            <FormDescription>
                              Number of cycles to send to the canister
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={topUpForm.control}
                        name="fromSubaccount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>From Subaccount (optional)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Subaccount hex" />
                            </FormControl>
                            <FormDescription>
                              Transfer cycles from this subaccount
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={isToppingUp} className="w-full">
                        {isToppingUp ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <TrendingUp className="mr-2 h-4 w-4" />
                        )}
                        Top-up Canister
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  );
} 