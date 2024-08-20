import React from "react";
import Head from "next/head";
import NetworkComponent from "@components/network/Network";
import { trackEvent } from "@aptabase/electron/renderer";

function Network() {
  trackEvent("network-page-viewed");

  return (
    <React.Fragment>
      <Head>
        <title>Network - DFX Dashboard</title>
      </Head>
      <NetworkComponent />
    </React.Fragment>
  );
}

export default Network;
