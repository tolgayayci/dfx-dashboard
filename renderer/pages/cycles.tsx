import React from "react";
import Head from "next/head";
import Cycles from "@components/cycles/Cycles";
import { trackEvent } from "@aptabase/electron/renderer";

function CyclesPage() {
  trackEvent("cycles-page-viewed");

  return (
    <React.Fragment>
      <Head>
        <title>Cycles - DFX Dashboard</title>
      </Head>
      <Cycles />
    </React.Fragment>
  );
}

export default CyclesPage;
