import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import ProjectDetail from "@components/projects/project-detail";

function CanisterDetailPage() {
  const router = useRouter();
  const { path, tab } = router.query;

  if (!router.isReady) {
    return <div>Loading...</div>;
  }

  const isOpenDfxTab = tab === "dfx";

  return (
    <React.Fragment>
      <Head>
        <title>Project - DFX Dashboard</title>
      </Head>
      <ProjectDetail projectPath={path as string} openDfxTab={isOpenDfxTab} />
    </React.Fragment>
  );
}

export default CanisterDetailPage;
