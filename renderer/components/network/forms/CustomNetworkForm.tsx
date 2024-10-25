import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { customSchema, CustomNetworkData, NetworkData } from "../types";
import { updateJson, getNetworkJsonPath } from "../api";
import { useToast } from "@components/ui/use-toast";

type CustomNetworkFormProps = {
  networkData: NetworkData;
  setNetworkData: React.Dispatch<React.SetStateAction<NetworkData>>;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  editingNetwork: string | null;
};

export function CustomNetworkForm({
  networkData,
  setNetworkData,
  setIsDialogOpen,
  isSubmitting,
  setIsSubmitting,
  editingNetwork,
}: CustomNetworkFormProps) {
  const { control, handleSubmit, reset } = useForm<CustomNetworkData>({
    resolver: zodResolver(customSchema),
    defaultValues: {
      name: "",
      bind: "",
      replica: { subnet_type: "application" },
    },
  });

  const { toast } = useToast();

  useEffect(() => {
    if (editingNetwork && networkData[editingNetwork]) {
      reset({
        name: editingNetwork,
        ...networkData[editingNetwork],
      });
    }
  }, [editingNetwork, networkData, reset]);

  const onSubmit = async (data: CustomNetworkData) => {
    setIsSubmitting(true);
    const { name, ...networkConfig } = data;
    const updatedNetworkData = {
      ...networkData,
      [name]: networkConfig,
    };
    try {
      const path = await getNetworkJsonPath();
      if (path) {
        await updateJson(path, updatedNetworkData);
        setNetworkData(updatedNetworkData);
        setIsDialogOpen(false);
        toast({
          title: "Success",
          description: "Custom network configuration updated successfully.",
        });
      }
    } catch (error) {
      console.error("Failed to update network data:", error);
      toast({
        title: "Error",
        description: "Failed to update custom network configuration.",
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
          <Label htmlFor="name">Network Name</Label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input {...field} readOnly={!!editingNetwork} />
            )}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="bind">Bind</Label>
          <Controller
            name="bind"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="replica.subnet_type">Subnet Type</Label>
          <Controller
            name="replica.subnet_type"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subnet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="application">Application</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="verifiedapplication">Verified Application</SelectItem>
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
