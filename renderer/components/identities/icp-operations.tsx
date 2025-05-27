"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { ScrollArea } from "@components/ui/scroll-area";
import { useToast } from "@components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@components/ui/form";
import { Send, Plus, Zap, Coins, Loader2 } from "lucide-react";

interface ICPOperationsProps {
  activeIdentityName: string;
  onSuccess?: () => void;
}

// Form schemas
const transferSchema = z.object({
  to: z.string().min(1, "Recipient account ID is required"),
  amount: z.string().min(1, "Amount is required"),
  memo: z.string().min(1, "Memo is required"),
  network: z.string().min(1, "Network is required"),
});

const createCanisterSchema = z.object({
  controller: z.string().min(1, "Controller principal is required"),
  amount: z.string().min(1, "Amount is required"),
  network: z.string().min(1, "Network is required"),
});

const topUpSchema = z.object({
  canisterId: z.string().min(1, "Canister ID is required"),
  amount: z.string().min(1, "Amount is required"),
  network: z.string().min(1, "Network is required"),
});

const fabricateCyclesSchema = z.object({
  canisterId: z.string().optional(),
  amount: z.string().min(1, "Amount is required"),
  amountType: z.enum(["cycles", "icp", "t"]),
  all: z.boolean().default(false),
});

export default function ICPOperations({ activeIdentityName, onSuccess }: ICPOperationsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const transferForm = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      to: "",
      amount: "",
      memo: "",
      network: "local",
    },
  });

  const createCanisterForm = useForm<z.infer<typeof createCanisterSchema>>({
    resolver: zodResolver(createCanisterSchema),
    defaultValues: {
      controller: "",
      amount: "",
      network: "local",
    },
  });

  const topUpForm = useForm<z.infer<typeof topUpSchema>>({
    resolver: zodResolver(topUpSchema),
    defaultValues: {
      canisterId: "",
      amount: "",
      network: "local",
    },
  });

  const fabricateCyclesForm = useForm<z.infer<typeof fabricateCyclesSchema>>({
    resolver: zodResolver(fabricateCyclesSchema),
    defaultValues: {
      canisterId: "",
      amount: "",
      amountType: "t",
      all: false,
    },
  });

  const onTransferSubmit = async (values: z.infer<typeof transferSchema>) => {
    setIsLoading(true);
    try {
      const result = await window.awesomeApi.ledgerTransferICP(
        values.to,
        values.amount,
        values.memo,
        values.network,
        activeIdentityName
      );
      
      if (result.success) {
        toast({
          title: "Transfer Successful",
          description: `ICP transferred successfully. Block height: ${result.data}`,
        });
        transferForm.reset();
        if (onSuccess) onSuccess();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: `Failed to transfer ICP: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onCreateCanisterSubmit = async (values: z.infer<typeof createCanisterSchema>) => {
    setIsLoading(true);
    try {
      const result = await window.awesomeApi.ledgerCreateCanister(
        values.controller,
        values.amount,
        values.network,
        activeIdentityName
      );
      
      if (result.success) {
        toast({
          title: "Canister Created",
          description: `Canister created successfully: ${result.data}`,
        });
        createCanisterForm.reset();
        if (onSuccess) onSuccess();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: `Failed to create canister: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onTopUpSubmit = async (values: z.infer<typeof topUpSchema>) => {
    setIsLoading(true);
    try {
      const result = await window.awesomeApi.ledgerTopUpCanister(
        values.canisterId,
        values.amount,
        values.network,
        activeIdentityName
      );
      
      if (result.success) {
        toast({
          title: "Top-up Successful",
          description: `Canister topped up successfully. Block height: ${result.data}`,
        });
        topUpForm.reset();
        if (onSuccess) onSuccess();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Top-up Failed",
        description: `Failed to top up canister: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onFabricateCyclesSubmit = async (values: z.infer<typeof fabricateCyclesSchema>) => {
    setIsLoading(true);
    try {
      const result = await window.awesomeApi.ledgerFabricateCycles(
        values.canisterId,
        values.amount,
        values.amountType,
        values.all
      );
      
      if (result.success) {
        toast({
          title: "Cycles Fabricated",
          description: "Cycles fabricated and deposited successfully",
        });
        fabricateCyclesForm.reset();
        if (onSuccess) onSuccess();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Fabrication Failed",
        description: `Failed to fabricate cycles: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full">
        <div className="space-y-6">
          {/* ICP Transfer */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Send className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Transfer ICP</CardTitle>
                  <CardDescription>
                    Transfer ICP tokens to another account identifier
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...transferForm}>
                <form onSubmit={transferForm.handleSubmit(onTransferSubmit)} className="space-y-4">
                  <FormField
                    control={transferForm.control}
                    name="to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Recipient Account ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter account identifier"
                            className="font-mono text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={transferForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Amount (ICP)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0.00000000"
                            type="number"
                            step="0.00000001"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={transferForm.control}
                    name="memo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Memo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Transaction memo (numeric)"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={transferForm.control}
                    name="network"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Network</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select network" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="local">Local</SelectItem>
                            <SelectItem value="ic">Internet Computer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Transferring...
                      </>
                    ) : (
                      "Transfer ICP"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Create Canister from ICP */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Plus className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Create Canister from ICP</CardTitle>
                  <CardDescription>
                    Convert ICP tokens to cycles and create a new canister
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...createCanisterForm}>
                <form onSubmit={createCanisterForm.handleSubmit(onCreateCanisterSubmit)} className="space-y-4">
                  <FormField
                    control={createCanisterForm.control}
                    name="controller"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Controller Principal</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter controller principal"
                            className="font-mono text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createCanisterForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Amount (ICP)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0.00000000"
                            type="number"
                            step="0.00000001"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createCanisterForm.control}
                    name="network"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Network</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select network" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="local">Local</SelectItem>
                            <SelectItem value="ic">Internet Computer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      "Create Canister"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Top Up Canister */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Top Up Canister</CardTitle>
                  <CardDescription>
                    Convert ICP tokens to cycles and top up an existing canister
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...topUpForm}>
                <form onSubmit={topUpForm.handleSubmit(onTopUpSubmit)} className="space-y-4">
                  <FormField
                    control={topUpForm.control}
                    name="canisterId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Canister ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter canister ID"
                            className="font-mono text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={topUpForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Amount (ICP)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0.00000000"
                            type="number"
                            step="0.00000001"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={topUpForm.control}
                    name="network"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Network</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select network" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="local">Local</SelectItem>
                            <SelectItem value="ic">Internet Computer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Topping Up...
                      </>
                    ) : (
                      "Top Up Canister"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Fabricate Cycles (Local Development) */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Coins className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Fabricate Cycles (Local Development)</CardTitle>
                  <CardDescription>
                    Create cycles out of thin air for local development
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...fabricateCyclesForm}>
                <form onSubmit={fabricateCyclesForm.handleSubmit(onFabricateCyclesSubmit)} className="space-y-4">
                  <FormField
                    control={fabricateCyclesForm.control}
                    name="all"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium">
                            Deposit to all canisters in project
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {!fabricateCyclesForm.watch("all") && (
                    <FormField
                      control={fabricateCyclesForm.control}
                      name="canisterId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Canister ID (optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter canister ID or leave empty for default"
                              className="font-mono text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={fabricateCyclesForm.control}
                    name="amountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Amount Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select amount type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cycles">Cycles</SelectItem>
                            <SelectItem value="icp">ICP</SelectItem>
                            <SelectItem value="t">Trillion Cycles (T)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={fabricateCyclesForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Amount ({fabricateCyclesForm.watch("amountType") === "cycles" ? "Cycles" : 
                                   fabricateCyclesForm.watch("amountType") === "icp" ? "ICP" : "Trillion Cycles"})
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={fabricateCyclesForm.watch("amountType") === "icp" ? "0.00000000" : "10"}
                            type="number"
                            step={fabricateCyclesForm.watch("amountType") === "icp" ? "0.00000001" : "1"}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Fabricating...
                      </>
                    ) : (
                      "Fabricate Cycles"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Add some bottom margin to ensure scrolling to bottom works */}
          <div className="h-8"></div>
        </div>
      </ScrollArea>
    </div>
  );
} 