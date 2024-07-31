import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import CanisterDetail from "@components/canisters/canister/canister-detail";

function CanisterDetailPage() {
  const router = useRouter();
  const { projectPath, canisterName } = router.query;

  return (
    <React.Fragment>
      <Head>
        <title>Canister - {canisterName} - DFINITY DFX</title>
      </Head>
      <CanisterDetail
        projectPath={projectPath as string}
        canisterName={canisterName as string}
      />
    </React.Fragment>
  );
}

export default CanisterDetailPage;
