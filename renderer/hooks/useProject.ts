import { useEffect, useState } from "react";

export default function useProject() {
  const [project, setProject] = useState(null);

  async function checkProjects() {
    try {
      const result = await window.awesomeApi.manageProjects("get");
      const projectsData = result.map((project) => ({
        name: project.name,
        path: project.path,
        active: project.active, // Assuming 'active' property is part of your project data
      }));

      // Find an active project
      const activeProject = projectsData.find((project) => project.active);

      // Set the selected project to the active one if it exists, otherwise set to the first project
      if (activeProject) {
        setProject(activeProject);
      } else if (projectsData.length > 0) {
        return;
      }
    } catch (error) {
      console.error("Error invoking remote method:", error);
    }
  }

  useEffect(() => {
    checkProjects();
  }, []);

  return {
    project,
    setProject,
  };
}
