import React from "react";
import Head from "next/head";
import LogsComponent from "@components/logs/Logs";
import { trackEvent } from "@aptabase/electron/renderer";

function Logs() {
  trackEvent("logs-page-viewed");

  return (
    <React.Fragment>
      <Head>
        <title>Logs - DFX Dashboard</title>
      </Head>
      <LogsComponent />
    </React.Fragment>
  );
}

export default Logs;
