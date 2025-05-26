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
import { DollarSign, Gift, Loader2, RefreshCw } from "lucide-react";

const convertSchema = z.object({
  amount: z
    .string()
    .nonempty("Amount is required")
    .regex(/^\d+(\.\d+)?$/, "Must be a valid ICP amount"),
  subaccount: z.string().optional(),
  memo: z.string().optional(),
});

const faucetSchema = z.object({
  coupon: z
    .string()
    .nonempty("Coupon code is required")
    .min(1, "Coupon code cannot be empty"),
});

type ConvertForm = z.infer<typeof convertSchema>;
type FaucetForm = z.infer<typeof faucetSchema>;

interface FaucetOperationsProps {
  onSuccess: () => void;
}

export default function FaucetOperations({ onSuccess }: FaucetOperationsProps) {
  const [isConverting, setIsConverting] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const convertForm = useForm<ConvertForm>({
    resolver: zodResolver(convertSchema),
    defaultValues: {
      amount: "",
      subaccount: "",
      memo: "",
    },
  });

  const faucetForm = useForm<FaucetForm>({
    resolver: zodResolver(faucetSchema),
    defaultValues: {
      coupon: "",
    },
  });

  const onConvertSubmit = async (data: ConvertForm) => {
    setIsConverting(true);
    try {
      const options: any = { network: "ic" };
      
      if (data.subaccount) {
        options.subaccount = data.subaccount;
      }
      
      if (data.memo) {
        options.memo = data.memo;
      }

      const result = await window.awesomeApi.cyclesConvert(data.amount, options);

      if (result.success) {
        // Parse the result to extract cycle amount
        const lines = result.data.split("\n");
        let cycleAmount = "";
        for (const line of lines) {
          if (line.includes("cycles") && line.includes("converted")) {
            cycleAmount = line.trim();
            break;
          }
        }

        toast({
          title: "Conversion Successful",
          description: cycleAmount || `Successfully converted ${data.amount} ICP to cycles.`,
        });

        convertForm.reset();
        onSuccess();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error converting ICP to cycles:", error);
      toast({
        title: "Conversion Failed",
        description: "Failed to convert ICP to cycles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const onFaucetSubmit = async (data: FaucetForm) => {
    setIsRedeeming(true);
    try {
      const result = await window.awesomeApi.cyclesRedeemFaucetCoupon(data.coupon, {
        network: "ic",
      });

      if (result.success) {
        // Parse the result to extract cycle amount
        const lines = result.data.split("\n");
        let cycleAmount = "";
        for (const line of lines) {
          if (line.includes("cycles") && (line.includes("redeemed") || line.includes("received"))) {
            cycleAmount = line.trim();
            break;
          }
        }

        toast({
          title: "Coupon Redeemed",
          description: cycleAmount || "Successfully redeemed faucet coupon for cycles.",
        });

        faucetForm.reset();
        onSuccess();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error redeeming faucet coupon:", error);
      toast({
        title: "Redemption Failed",
        description: "Failed to redeem faucet coupon. Please check the coupon code and try again.",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="h-full">
      <Tabs defaultValue="convert" className="h-full flex flex-col">
        <TabsList className="flex-shrink-0 grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="convert" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Convert ICP
          </TabsTrigger>
          <TabsTrigger value="faucet" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Faucet Coupon
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full border rounded-md">
            <TabsContent value="convert" className="m-0 p-2">
              <Card className="border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Convert ICP to Cycles</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Convert your ICP tokens into cycles for computation
                  </p>
                </CardHeader>
                <CardContent>
                  <Form {...convertForm}>
                    <form
                      onSubmit={convertForm.handleSubmit(onConvertSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={convertForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount (ICP)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="1.0" />
                            </FormControl>
                            <FormDescription>
                              Amount of ICP to convert to cycles
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={convertForm.control}
                          name="subaccount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subaccount (optional)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Subaccount hex" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={convertForm.control}
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
                      </div>

                      <Button type="submit" disabled={isConverting} className="w-full">
                        {isConverting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="mr-2 h-4 w-4" />
                        )}
                        Convert to Cycles
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faucet" className="m-0 p-2">
              <Card className="border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Redeem Faucet Coupon</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Redeem a cycles faucet coupon for free cycles
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>How to get a faucet coupon:</strong>
                    </p>
                    <ol className="text-sm text-blue-700 dark:text-blue-300 mt-2 ml-4 list-decimal space-y-1">
                      <li>Visit the DFINITY Cycles Faucet website</li>
                      <li>Complete the verification process</li>
                      <li>Copy the coupon code provided</li>
                      <li>Paste it in the form below</li>
                    </ol>
                  </div>

                  <Form {...faucetForm}>
                    <form
                      onSubmit={faucetForm.handleSubmit(onFaucetSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={faucetForm.control}
                        name="coupon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Faucet Coupon Code</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter your faucet coupon code" />
                            </FormControl>
                            <FormDescription>
                              The coupon code from the DFINITY cycles faucet
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={isRedeeming} className="w-full">
                        {isRedeeming ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Gift className="mr-2 h-4 w-4" />
                        )}
                        Redeem Coupon
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