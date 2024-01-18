import { useEffect, useState } from "react";

export default function useIdentity() {
  const [project, setProject] = useState(null);

  async function checkIdentities() {
    try {
      const result = await window.awesomeApi.manageIdentities("get");
      const identitiesData = result.map((project) => ({
        name: project.name,
        path: project.path,
        active: project.active, // Assuming 'active' property is part of your project data
      }));

      console.log("Identities:", identitiesData);

      // Find an active project
      const activeProject = identitiesData.find((project) => project.active);

      // Set the selected project to the active one if it exists, otherwise set to the first project
      if (activeProject) {
        setProject(activeProject);
      } else if (identitiesData.length > 0) {
        return;
      }
    } catch (error) {
      console.error("Error invoking remote method:", error);
    }
  }

  useEffect(() => {
    checkIdentities();
  }, []);

  return {
    project,
    setProject,
  };
}
