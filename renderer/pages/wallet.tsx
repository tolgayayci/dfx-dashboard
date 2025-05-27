import React from "react";
import Head from "next/head";
import WalletComponent from "@components/wallet/Wallet";
import { trackEvent } from "@aptabase/electron/renderer";

function WalletPage() {
  trackEvent("wallet-page-viewed");

  return (
    <React.Fragment>
      <Head>
        <title>Wallet - DFX Dashboard</title>
      </Head>
      <WalletComponent />
    </React.Fragment>
  );
}

export default WalletPage; 