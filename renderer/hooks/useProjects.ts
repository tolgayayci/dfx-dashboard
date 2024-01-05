import { useEffect, useState } from "react";

export default function useProjects() {
  const [projects, setProjects] = useState([]);

  async function fetchProjects() {
    try {
      const result = await window.awesomeApi.manageProjects("get");
      const projectsData = result.map((project) => ({
        name: project.name,
        path: project.path,
        active: project.active,
      }));

      // Set the state with the fetched projects
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  // Call fetchProjects when the component using this hook mounts
  useEffect(() => {
    fetchProjects();
  }, []); // The empty array ensures this effect runs once on mount

  return projects; // Return the list of projects
}
