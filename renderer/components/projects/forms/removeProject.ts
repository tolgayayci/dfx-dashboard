import * as z from "zod";

export const removeProjectFormSchema = z.object({
  from_project_name: z
    .string()
    .min(3, "Project name must be at least 3 characters long.")
    .max(50, "Project name must be at most 50 characters long."),
  to_project_name: z
    .string()
    .min(3, "Project name must be at least 3 characters long.")
    .max(50, "Project name must be at most 50 characters long.")
    .regex(
      /^[A-Za-z0-9.\-_@]+$/,
      "Only the characters ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.-_@0123456789 are valid in project names."
    ),
  path: z.string(),
});

export async function onRemoveProjectFormSubmit(
  data: z.infer<typeof removeProjectFormSchema>
) {
  try {
    console.log("remove project logic");

    // const result = await window.awesomeApi.runDfxCommand(command, subcommand, args)
  } catch (error) {
    console.error(`Error: ${error}`); // log error
  }
}
