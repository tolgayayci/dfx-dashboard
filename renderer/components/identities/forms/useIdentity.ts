import * as z from "zod";
import axios from "axios";

export const useIdentityFormSchema = z.object({
    identity_name: z
      .string()
      .min(3, {
        message: "Identity name must be at least 3 characters long",
      })
      .max(255),
  });

export async function onimportIdentityFormSubmit(
    data: z.infer<typeof useIdentityFormSchema>
) {
    try {
      const command = "identity"
      const subcommand = "use"
      const options = {
        identity_name: data.identity_name
      }

      axios.post(
        `/api/${command}/?subcommand=${subcommand}&options=${JSON.stringify(options)}`
      )
     
    } catch (error) {
      console.error(`Error: ${error}`); // log error
    }
}