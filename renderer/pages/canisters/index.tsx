import React from "react";
import Head from "next/head";
import CanistersComponent from "@components/canisters/Canisters";
import { trackEvent } from "@aptabase/electron/renderer";

function Canisters() {
  trackEvent("canisters-page-viewed");

  return (
    <React.Fragment>
      <Head>
        <title>Canisters - DFX Dashboard</title>
      </Head>
      <CanistersComponent />
    </React.Fragment>
  );
}

export default Canisters;
