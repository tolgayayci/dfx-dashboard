import React, { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Layout from "@components/layout";
import DfxNotInstalled from "@components/common/dfx-not-installed";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const [isDfxInstalled, setIsDfxInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkIsDfxInstalled() {
      try {
        const result = await window.awesomeApi.isDfxInstalled();
        setIsDfxInstalled(result);
      } catch (error) {
        console.error(`Error: ${error}`);
        setIsDfxInstalled(false); // Assuming it's not installed in case of an error
      }
    }

    checkIsDfxInstalled();
  }, []);

  if (isDfxInstalled === null) {
    // Render a loading indicator or any other appropriate component while checking DFX installation
    return null;
  } else if (isDfxInstalled) {
    // Render the layout if DFX is installed
    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  } else {
    // Render a different page if DFX is not installed
    return <DfxNotInstalled />;
  }
}

export default MyApp;
