import * as z from "zod";
import axios from "axios";

export const removeIdentityFormSchema = z.object({
    identity_name: z
      .string()
      .min(3, {
        message: "Identity name must be at least 3 characters long",
      })
      .max(255),
    drop_wallets: z
      .boolean().optional()
  });

export async function onimportIdentityFormSubmit(
    data: z.infer<typeof removeIdentityFormSchema>
) {
    try {
      const command = "identity"
      const subcommand = "remove"
      const options = {
        identity_name: data.identity_name,
        drop_wallets: data.drop_wallets
      }

      axios.post(
        `/api/${command}/?subcommand=${subcommand}&options=${JSON.stringify(options)}`
      )
     
    } catch (error) {
      console.error(`Error: ${error}`); // log error
    }
}