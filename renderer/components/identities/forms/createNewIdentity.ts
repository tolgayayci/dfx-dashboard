import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const newIdentityFormSchema = z.object({
    identity_name: z
      .string()
      .min(3, {
        message: "Identity name must be at least 3 characters long",
      })
      .max(255),
    hsm_key_id: z
      .string()
      .min(3, {
        message: "Identity name must be at least 3 characters long",
      })
      .max(255),
    hsm_pkcs11_lib_path: z
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

  export const newIdentityForm = useForm<z.infer<typeof newIdentityFormSchema>>({
    resolver: zodResolver(newIdentityFormSchema),
  });

  export async function onNewIdentityFormSubmit(
    data: z.infer<typeof newIdentityFormSchema>
  ) {
    try {
      const command = "identity"
      const subcommand = "new"
      const options = {
        identity_name : data.identity_name,
        storage_mode: data.storage_mode,
        force: data.force,
        hsm_key_id: data.hsm_key_id,
        hsm_pkcs11_lib_path: data.hsm_pkcs11_lib_path
      }
      
      axios.get(
        `/api/${command}/?subcommand=${subcommand}&options=${options}`
      )
      // log the result from main process
    } catch (error) {
      console.error(`Error: ${error}`); // log error
    }
  } 