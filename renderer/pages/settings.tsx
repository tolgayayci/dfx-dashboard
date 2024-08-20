import React from "react";
import Head from "next/head";
import SettingsComponent from "@components/settings/Settings";
import { trackEvent } from "@aptabase/electron/renderer";

function Settings() {
  trackEvent("settings-page-viewed");

  return (
    <React.Fragment>
      <Head>
        <title>Settings - DFX Dashboard</title>
      </Head>
      <SettingsComponent />
    </React.Fragment>
  );
}

export default Settings;
