import * as z from "zod";

export const newIdentityFormSchema = z.object({
  identity_name: z
    .string()
    .min(3, "Identity name must be at least 3 characters long.")
    .max(255, "Identity name must be at most 255 characters long.")
    .regex(
      /^[A-Za-z0-9.\-_@]+$/,
      "Only the characters ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.-_@0123456789 are valid in identity names."
    ),
  hsm_key_id: z
    .string()
    .min(3, "HSM key ID must be at least 3 characters long.")
    .max(255, "HSM key ID must be at most 255 characters long.")
    .optional(),
  hsm_pkcs11_lib_path: z
    .string()
    .min(3, "HSM PKCS#11 library path must be at least 3 characters long.")
    .max(255, "HSM PKCS#11 library path must be at most 255 characters long.")
    .optional(),
  storage_mode: z
    .string()
    .min(3, "Storage mode must be at least 3 characters long.")
    .max(255, "Storage mode must be at most 255 characters long.")
    .optional(),
  force: z.boolean().optional(),
});

export async function onNewIdentityFormSubmit(
  data: z.infer<typeof newIdentityFormSchema>
) {
  try {
    const command = "identity";
    const subcommand = "new";
    const args = [data.identity_name];
    const flags = [
      data.hsm_key_id ? `hsm-key-id=${data.hsm_key_id}` : null,
      data.hsm_pkcs11_lib_path
        ? `hsm-pkcs11-lib-path=${data.hsm_pkcs11_lib_path}`
        : null,
      data.storage_mode ? `storage-mode=${data.storage_mode}` : null,
      data.force === true ? "force" : null,
    ].filter(Boolean);

    await window.awesomeApi.runDfxCommand(command, subcommand, args, flags);

    const principaldata = await window.awesomeApi.runDfxCommand(
      "identity",
      "get-principal",
      ["--identity"],
      [data.identity_name]
    );

    await window.awesomeApi.manageIdentities("add", {
      name: data.identity_name,
      isInternetIdentity: false,
      principal: principaldata,
    });

    await window.awesomeApi.reloadApplication();
  } catch (error) {
    throw error;
  }
}
