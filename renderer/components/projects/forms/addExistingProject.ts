import * as z from "zod";

export const addExistingProjectFormSchema = z.object({
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
});

export async function onAddExistingProjectFormSchema(
    data: z.infer<typeof addExistingProjectFormSchema>
) {
    try {
      //check if it is a dfx project
      const result = await window.awesomeApi.isDfxProject(data.path)

      if(result){
        await window.awesomeApi.manageProjects("add", {name: data.project_name, path: data.path})
      }
              
    } catch (error) {
      console.error(`Error: ${error}`); // log error
    }
} 