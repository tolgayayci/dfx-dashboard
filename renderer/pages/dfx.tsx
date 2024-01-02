import React from "react";
import Head from "next/head";
import DfxComponent from "@components/dfx/Dfx";

function Dfx() {
  return (
    <React.Fragment>
      <Head>
        <title>dfx.json - DFX GUI</title>
      </Head>
      <DfxComponent />
    </React.Fragment>
  );
}

export default Dfx;
