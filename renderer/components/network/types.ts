import * as z from "zod";

export const localSchema = z.object({
  bind: z.string().min(1, "Bind address is required"),
  type: z.string().min(1, "Type is required"),
  replica: z.object({
    subnet_type: z.string().min(1, "Subnet type is required"),
  }),
});

export const icSchema = z.object({
  providers: z
    .array(z.string().url("Invalid URL"))
    .min(1, "At least one provider is required"),
  type: z.string().min(1, "Type is required"),
});

export const customSchema = z.object({
  name: z.string().min(1, "Network name is required"),
  bind: z.string().min(1, "Bind address is required"),
  replica: z.object({
    subnet_type: z.string().min(1, "Subnet type is required"),
  }),
});

export type LocalNetworkData = z.infer<typeof localSchema>;
export type ICNetworkData = z.infer<typeof icSchema>;
export type CustomNetworkData = z.infer<typeof customSchema>;

export type NetworkData = {
  local?: LocalNetworkData;
  ic?: ICNetworkData;
  [key: string]: LocalNetworkData | ICNetworkData | undefined;
};

export type NetworkType = "local" | "ic" | "custom";
