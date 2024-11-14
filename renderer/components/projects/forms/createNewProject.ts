import * as z from "zod";

export const createNewProjectFormSchema = z.object({
  project_name: z
    .string()
    .min(3, {
      message: "Project name must be at least 3 characters long",
    })
    .max(255),
  path: z
    .string()
    .min(3, {
      message: "You must select a path",
    })
    .max(255),
  frontend: z
    .enum(["sveltekit", "vanilla", "vue", "react", "simple-assets", "none"])
    .optional(),
  type: z.enum(["motoko", "rust", "azle", "kybra"]).optional(),
  dry_run: z.boolean().optional(),
  verbose: z.boolean().optional(),
  quiet: z.boolean().optional(),
  extras: z
    .array(z.enum(["internet-identity", "bitcoin", "frontend-tests"]))
    .default([]),
});

export async function onCreateNewProjectForm(
  data: z.infer<typeof createNewProjectFormSchema>
) {
  try {
    const command = "new";
    const subcommand = null;
    const args = [data.project_name];
    const flags = [
      data.dry_run ? `--dry-run` : null,
      data.frontend ? `--frontend ${data.frontend}` : null,
      data.type ? `--type ${data.type}` : null,
      data.verbose ? `-v` : null,
      data.quiet ? `-q` : null,
      ...(data.extras ? data.extras.map((extra) => `--extras ${extra}`) : []),
    ].filter(Boolean); // This will remove any null values from the array

    const result = await window.awesomeApi
      .runDfxCommand(command, subcommand, args, flags, data.path)
      .then(async () => {
        await window.awesomeApi.manageProjects("add", {
          name: data.project_name,
          path: data.path + "/" + data.project_name,
        });
      });

    return result;
  } catch (error) {
    throw error;
  }
}
