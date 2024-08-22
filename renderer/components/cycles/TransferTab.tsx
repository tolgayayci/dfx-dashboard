import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import ConfirmationDialog from "./ConfirmationDialog";
import { toast } from "@components/ui/use-toast";
import { SendHorizonal } from "lucide-react";

const transferSchema = z.object({
  to: z.string().nonempty("Recipient is required"),
  amount: z
    .string()
    .nonempty("Amount is required")
    .regex(/^\d+$/, "Must be a whole number"),
});

type TransferForm = z.infer<typeof transferSchema>;

interface TransferTabProps {
  onSuccess: () => void;
}

export default function TransferTab({ onSuccess }: TransferTabProps) {
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const form = useForm<TransferForm>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      to: "",
      amount: "",
    },
  });

  const onSubmit = (data: TransferForm) => {
    setShowConfirmation(true);
  };

  const handleTransfer = async () => {
    try {
      await window.awesomeApi.runDfxCommand("cycles", "transfer", [
        form.getValues("to"),
        form.getValues("amount"),
        "--network",
        "ic",
      ]);
      toast({
        title: "Success",
        description: "Successfully transferred cycles",
      });
      setShowConfirmation(false);
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error transferring cycles:", error);
      toast({
        title: "Error",
        description: "Failed to transfer cycles. Please try again.",
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
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To (Principal)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter recipient's principal"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <Button type="submit" className="w-full">
                <SendHorizonal className="mr-2 h-4 w-4" /> Transfer Cycles
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleTransfer}
        title="Transfer Cycles"
        message={`Are you sure you want to transfer ${form.getValues(
          "amount"
        )} cycles to ${form.getValues("to")}?`}
      />
    </>
  );
}
