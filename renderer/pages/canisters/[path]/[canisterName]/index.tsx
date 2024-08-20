import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import CanisterDetail from "@components/canisters/canister/canister-detail";
import { trackEvent } from "@aptabase/electron/renderer";

function CanisterDetailPage() {
  trackEvent("canister-detail-page-viewed");

  return (
    <React.Fragment>
      <Head>
        <title>Canister - DFX Dashboard</title>
      </Head>
      <CanisterDetail />
    </React.Fragment>
  );
}

export default CanisterDetailPage;
