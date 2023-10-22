import axios from "axios";
import * as z from "zod";

export const importIdentityFormSchema = z.object({
    identity_name: z
      .string()
      .min(3, {
        message: "Identity name must be at least 3 characters long",
      })
      .max(255),
    pem_identity: z
      .string()
      .min(3, {
        message: "Identity name must be at least 3 characters long",
      })
      .max(255),
    storage_mode: z
      .string()
      .min(3, {
        message: "Identity name must be at least 3 characters long",
      })
      .max(255),
    force: z.boolean(),
  });

export async function onimportIdentityFormSubmit(
    data: z.infer<typeof importIdentityFormSchema>
) {
    try {

      const command = "identity"
      const subcommand = "import"

      const options = {
        identity_name: data.identity_name,
        pem_identity: data.pem_identity,
        flag_storage_mode: data.storage_mode,
        flag_force: data.force
      }

      axios.post(
        `/api/${command}/?subcommand=${subcommand}&options=${JSON.stringify(options)}`
      )
     
      console.log(data); // log the result from main process
    } catch (error) {
      console.error(`Error: ${error}`); // log error
    }
}