import React from "react";
import Head from "next/head";
import CanistersComponent from "@components/canisters/Canisters";

function Canisters() {
  return (
    <React.Fragment>
      <Head>
        <title>Canisters - DFINITY DFX</title>
      </Head>
      <CanistersComponent />
    </React.Fragment>
  );
}

export default Canisters;
