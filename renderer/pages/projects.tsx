import React from "react";
import Head from "next/head";
import ProjectsComponent from "@components/projects/Project";

function Projects() {
  return (
    <React.Fragment>
      <Head>
        <title>Projects - DFX GUI</title>
      </Head>
      <ProjectsComponent />
    </React.Fragment>
  );
}

export default Projects;
