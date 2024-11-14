import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useProjects from "renderer/hooks/useProjects";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import ConfirmationDialog from "./ConfirmationDialog";
import { toast } from "@components/ui/use-toast";
import { Upload, Loader2 } from "lucide-react";

const topUpSchema = z
  .object({
    canisterType: z.enum(["select", "custom"]),
    selectedCanister: z.string().optional(),
    customCanisterId: z.string().optional(),
    amount: z
      .string()
      .min(1, "Amount is required")
      .regex(/^\d+$/, "Must be a whole number"),
  })
  .refine(
    (data) => {
      if (data.canisterType === "select") {
        return !!data.selectedCanister;
      } else {
        return !!data.customCanisterId;
      }
    },
    {
      message: "Please select a canister or enter a custom canister ID",
      path: ["canisterType"],
    }
  );

type TopUpForm = z.infer<typeof topUpSchema>;

interface Canister {
  name: string;
  projectName: string;
  path: string;
}

interface TopUpTabProps {
  onSuccess: () => void;
}

export default function TopUpTab({ onSuccess }: TopUpTabProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [allCanisters, setAllCanisters] = useState<Canister[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const projects = useProjects();

  const form = useForm<TopUpForm>({
    resolver: zodResolver(topUpSchema),
    defaultValues: {
      canisterType: "select",
      selectedCanister: "",
      customCanisterId: "",
      amount: "",
    },
  });

  async function checkCanisters(projectPath: string) {
    try {
      const result = await window.awesomeApi.listCanisters(projectPath);
      const canistersArray = Object.keys(result.canisters).map((key) => ({
        name: key,
        ...result.canisters[key],
        projectName: projects.find((p) => p.path === projectPath)?.name,
        path: projectPath,
      }));
      setAllCanisters((prevCanisters) => {
        const newCanisters = canistersArray.filter(
          (newCanister) =>
            !prevCanisters.some(
              (prevCanister) =>
                prevCanister.name === newCanister.name &&
                prevCanister.projectName === newCanister.projectName
            )
        );
        return [...prevCanisters, ...newCanisters];
      });
    } catch (error) {
      console.log("Error invoking remote method:", error);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    setAllCanisters([]);
    const fetchCanisters = async () => {
      for (const project of projects) {
        await checkCanisters(project.path);
      }
      setIsLoading(false);
    };
    fetchCanisters();
  }, [projects]);

  const onSubmit = (data: TopUpForm) => {
    setShowConfirmation(true);
  };

  const handleTopUp = async () => {
    const canisterId =
      form.getValues("canisterType") === "select"
        ? form.getValues("selectedCanister")
        : form.getValues("customCanisterId");

    try {
      await window.awesomeApi.runDfxCommand("cycles", "top-up", [
        canisterId,
        form.getValues("amount"),
        "--network",
        "ic",
      ]);
      toast({
        title: "Success",
        description: "Successfully topped up canister",
      });
      setShowConfirmation(false);
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error topping up canister:", error);
      toast({
        title: "Error",
        description: "Failed to top up canister. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="canisterType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Canister Selection</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="select" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Select from list
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="custom" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Enter custom ID
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("canisterType") === "select" ? (
                <FormField
                  control={form.control}
                  name="selectedCanister"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canister</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                isLoading
                                  ? "Loading canisters..."
                                  : "Select a canister"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoading ? (
                            <div className="flex items-center justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="ml-2">Loading canisters...</span>
                            </div>
                          ) : allCanisters.length > 0 ? (
                            allCanisters.map((c) => (
                              <SelectItem
                                key={`${c.name}-${c.projectName}`}
                                value={c.name}
                              >
                                {c.name} ({c.projectName})
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-center text-sm text-gray-500">
                              No canisters found
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="customCanisterId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Canister ID</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter canister ID" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (Cycles)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter cycles amount" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
                    Canisters
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" /> Top Up Canister
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleTopUp}
        title="Top Up Canister"
        message={`Are you sure you want to top up canister ${
          form.getValues("canisterType") === "select"
            ? form.getValues("selectedCanister")
            : form.getValues("customCanisterId")
        } with ${form.getValues("amount")} cycles?`}
      />
    </>
  );
}
