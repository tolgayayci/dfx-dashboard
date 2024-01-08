import { useEffect, useState } from "react";

export default function useProject(projectPath = null) {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state

  async function checkProjects() {
    setIsLoading(true); // Set loading to true when starting to fetch data
    try {
      const result = await window.awesomeApi.manageProjects("get");
      const projectsData = result.map((project) => ({
        name: project.name,
        path: project.path,
        active: project.active,
      }));

      let selectedProject;

      // If a projectName is provided, try to find that specific project
      if (projectPath) {
        selectedProject = projectsData.find(
          (project) => project.path === projectPath
        );
      }

      // If no projectName was provided or the specified project wasn't found, use the active project
      if (!selectedProject) {
        const activeProject = projectsData.find((project) => project.active);
        selectedProject = activeProject;
      }

      // Set the selected project if it exists, otherwise null
      setProject(selectedProject || null);
    } catch (error) {
      console.error("Error invoking remote method:", error);
      setProject(null); // Ensure project is set to null in case of error
    } finally {
      setIsLoading(false); // Set loading to false when the fetch is complete or has failed
    }
  }

  useEffect(() => {
    checkProjects();
  }, [projectPath]); // Re-run when projectPath changes

  return {
    project,
    setProject,
    isLoading, // Return isLoading as part of the hook's result
  };
}
