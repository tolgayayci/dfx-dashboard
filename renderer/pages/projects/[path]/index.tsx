import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import ProjectDetail from "@components/projects/project-detail";

function CanisterDetailPage() {
  const router = useRouter();
  const { path } = router.query;

  if (!router.isReady) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      <Head>
        <title>Project - DFX GUI</title>
      </Head>
      <ProjectDetail projectPath={path as string} />
    </React.Fragment>
  );
}

export default CanisterDetailPage;
