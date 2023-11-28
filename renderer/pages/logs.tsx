import React from "react";
import Head from "next/head";
import LogsComponent from "@components/logs/Logs";

function Logs() {
  return (
    <React.Fragment>
      <Head>
        <title>Logs - DFX GUI</title>
      </Head>
      <LogsComponent />
    </React.Fragment>
  );
}

export default Logs;
