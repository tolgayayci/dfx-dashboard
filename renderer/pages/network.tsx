import React from "react";
import Head from "next/head";
import NetworkComponent from "@components/network/Network";

function Network() {
  return (
    <React.Fragment>
      <Head>
        <title>Network - DFINITY DFX</title>
      </Head>
      <NetworkComponent />
    </React.Fragment>
  );
}

export default Network;
