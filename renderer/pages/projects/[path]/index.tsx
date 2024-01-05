import { useRouter } from "next/router";
import useProject from "renderer/hooks/useProject";
export default function ProjectDetails() {
  const router = useRouter();
  const { path } = router.query;

  const project = useProject(path);
  console.log(project);
  return <h2>Project Details {path}</h2>;
}
