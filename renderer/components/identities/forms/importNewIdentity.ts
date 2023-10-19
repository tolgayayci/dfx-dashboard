import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

export const importIdentityForm = useForm<z.infer<typeof importIdentityFormSchema>>({
    resolver: zodResolver(importIdentityFormSchema),
});

export async function onimportIdentityFormSubmit(
    data: z.infer<typeof importIdentityFormSchema>
) {
    try {
      // Here we call the exposed method from preload.js
      // const result = await window.versions.runDfxCommand(
      //   `new ${data.project_name} ${
      //     data.frontend_status ? "--frontend" : "--no-frontend"
      //   } ${data.dry_run ? "--dry-run" : ""}`
      // );
      console.log(data); // log the result from main process
    } catch (error) {
      console.error(`Error: ${error}`); // log error
    }
}