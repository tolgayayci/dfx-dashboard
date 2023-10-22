import * as z from "zod";
import axios from "axios";

export const renameIdentityFormSchema = z.object({
    from_identity_name: z
      .string()
      .min(3, {
        message: "Identity name must be at least 3 characters long",
      })
      .max(255),
    to_identity_name: z
      .string()
      .min(3, {
        message: "Identity name must be at least 3 characters long",
      })
      .max(255),
  });

export async function onimportIdentityFormSubmit(
    data: z.infer<typeof renameIdentityFormSchema>
) {
    try {
      const command = "identity"
      const subcommand = "rename"
      const options = {
        from_identity_name: data.from_identity_name,
        to_identity_name: data.to_identity_name
      }

      axios.post(
        `/api/${command}/?subcommand=${subcommand}&options=${JSON.stringify(options)}`
      )
     
    } catch (error) {
      console.error(`Error: ${error}`); // log error
    }
}