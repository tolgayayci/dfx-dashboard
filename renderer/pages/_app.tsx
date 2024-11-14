import React, { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Layout from "@components/layout";
import DfxNotInstalled from "@components/common/dfx-not-installed";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  // const [isDfxInstalled, setIsDfxInstalled] = useState<boolean | null>(null);

  // useEffect(() => {
  //   async function checkIsDfxInstalled() {
  //     try {
  //       const result = await window.awesomeApi.isDfxInstalled();
  //       setIsDfxInstalled(result);
  //       if (result) {
  //         const ee = await window.awesomeApi.runDfxCommand(
  //           "identity",
  //           "list",
  //           [],
  //           []
  //         );
  //       }
  //     } catch (error) {
  //       setIsDfxInstalled(false);
  //     }
  //   }

  //   if (typeof window !== "undefined") {
  //     checkIsDfxInstalled();
  //   }
  // }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
