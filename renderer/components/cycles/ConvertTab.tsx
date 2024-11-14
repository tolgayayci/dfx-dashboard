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
import { DollarSign } from "lucide-react";

const convertSchema = z.object({
  amount: z
    .string()
    .nonempty("Amount is required")
    .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
});

type ConvertForm = z.infer<typeof convertSchema>;

interface ConvertTabProps {
  onSuccess: () => void;
}

export default function ConvertTab({ onSuccess }: ConvertTabProps) {
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const form = useForm<ConvertForm>({
    resolver: zodResolver(convertSchema),
    defaultValues: {
      amount: "",
    },
  });

  const onSubmit = (data: ConvertForm) => {
    setShowConfirmation(true);
  };

  const handleConvert = async () => {
    try {
      await window.awesomeApi.runDfxCommand("cycles", "convert", [
        "--amount",
        form.getValues("amount"),
        "--network",
        "ic",
      ]);
      toast({
        title: "Success",
        description: "Successfully converted ICP to cycles",
      });
      setShowConfirmation(false);
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error converting ICP to cycles:", error);
      toast({
        title: "Error",
        description: "Failed to convert ICP to cycles. Please try again.",
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (ICP)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter ICP amount" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                <DollarSign className="mr-2 h-4 w-4" /> Convert to Cycles
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConvert}
        title="Convert ICP to Cycles"
        message={`Are you sure you want to convert ${form.getValues(
          "amount"
        )} ICP to cycles?`}
      />
    </>
  );
}
