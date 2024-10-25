import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { icSchema, ICNetworkData, NetworkData } from "../types";
import { updateJson, getNetworkJsonPath } from "../api";
import { useToast } from "@components/ui/use-toast";

type ICNetworkFormProps = {
  networkData: NetworkData;
  setNetworkData: React.Dispatch<React.SetStateAction<NetworkData>>;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  editingNetwork: string | null;
};

export function ICNetworkForm({
  networkData,
  setNetworkData,
  setIsDialogOpen,
  isSubmitting,
  setIsSubmitting,
  editingNetwork,
}: ICNetworkFormProps) {
  const { control, handleSubmit, reset, watch } = useForm<ICNetworkData>({
    resolver: zodResolver(icSchema),
    defaultValues: networkData.ic || {
      providers: [""],
      type: "ephemeral",
    },
  });

  const { toast } = useToast();

  useEffect(() => {
    if (editingNetwork === "ic" && networkData.ic) {
      reset(networkData.ic);
    }
  }, [editingNetwork, networkData.ic, reset]);

  const onSubmit = async (data: ICNetworkData) => {
    setIsSubmitting(true);
    const updatedNetworkData = {
      ...networkData,
      ic: data,
    };
    try {
      const path = await getNetworkJsonPath();
      if (path) {
        await updateJson(path, updatedNetworkData);
        setNetworkData(updatedNetworkData);
        setIsDialogOpen(false);
        toast({
          title: "Success",
          description: "IC network configuration updated successfully.",
        });
      }
    } catch (error) {
      console.error("Failed to update network data:", error);
      toast({
        title: "Error",
        description: "Failed to update IC network configuration.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="providers">Providers (comma-separated)</Label>
          <Controller
            name="providers"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value.join(", ")}
                onChange={(e) =>
                  field.onChange(
                    e.target.value.split(",").map((item) => item.trim())
                  )
                }
              />
            )}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="type">Type</Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ephemeral">Ephemeral</SelectItem>
                  <SelectItem value="persistent">Persistent</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : editingNetwork ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </form>
  );
}
