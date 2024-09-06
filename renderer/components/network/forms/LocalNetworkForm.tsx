import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { localSchema, LocalNetworkData, NetworkData } from "../types";
import { updateJson, getNetworkJsonPath } from "../api";

type LocalNetworkFormProps = {
  networkData: NetworkData;
  setNetworkData: React.Dispatch<React.SetStateAction<NetworkData>>;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  editingNetwork: string | null;
};

export function LocalNetworkForm({
  networkData,
  setNetworkData,
  setIsDialogOpen,
  isSubmitting,
  setIsSubmitting,
  editingNetwork,
}: LocalNetworkFormProps) {
  const { control, handleSubmit, reset } = useForm<LocalNetworkData>({
    resolver: zodResolver(localSchema),
    defaultValues: networkData.local || {
      bind: "",
      type: "",
      replica: { subnet_type: "" },
    },
  });

  useEffect(() => {
    if (editingNetwork === "local" && networkData.local) {
      reset(networkData.local);
    }
  }, [editingNetwork, networkData.local, reset]);

  const onSubmit = async (data: LocalNetworkData) => {
    setIsSubmitting(true);
    const updatedNetworkData = {
      ...networkData,
      local: data,
    };
    const path = await getNetworkJsonPath();
    if (path) {
      await updateJson(path, updatedNetworkData);
      setNetworkData(updatedNetworkData);
    }
    setIsSubmitting(false);
    setIsDialogOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="bind">Bind</Label>
          <Controller
            name="bind"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="type">Type</Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="replica.subnet_type">Subnet Type</Label>
          <Controller
            name="replica.subnet_type"
            control={control}
            render={({ field }) => <Input {...field} />}
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