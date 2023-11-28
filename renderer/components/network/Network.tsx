// Project Specific Page
import { useEffect, useState } from "react";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

export default function NetworkComponent() {
  const [networkJson, setNetworkJson] = useState(null);

  async function checkNetworkJson() {
    try {
      const result = await window.awesomeApi.runDfxCommand(
        "schema",
        null,
        ["--for"],
        ["networks"]
      );

      setNetworkJson(JSON.parse(result));

      // Update the "Identities" group with the identities directly
    } catch (error) {
      console.error("Error invoking remote method:", error);
    }
  }

  useEffect(() => {
    checkNetworkJson();
  }, []);

  return (
    <div>
      {networkJson ? (
        <div className="w-full">
          <JSONInput
            id="network_json"
            placeholder={networkJson}
            locale={locale}
            height="550px"
            width="100%"
          />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
