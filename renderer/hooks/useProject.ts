import { useEffect, useState } from "react";

export default function useProject(projectPath = null) {
  // Accept a projectName parameter
  const [project, setProject] = useState(null);

  async function checkProjects() {
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
    }
  }

  useEffect(() => {
    checkProjects();
  }, [projectPath]); // Re-run when projectName changes

  return {
    project,
    setProject,
  };
}
