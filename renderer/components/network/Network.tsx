// Project Specific Page
import { useEffect, useState } from "react";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import Loading from "@components/common/loading";

export default function NetworkComponent() {
  const [networkJson, setNetworkJson] = useState(null);

  function splitPath(path) {
    // Find the index of the last occurrence of '/'
    var index = path.lastIndexOf("/");
    // Split the path into two parts
    var part1 = path.substring(0, index);
    var part2 = path.substring(index);
    return [part1, part2];
  }

  async function checkNetworkJson() {
    try {
      const result = await window.awesomeApi.runDfxCommand(
        "info",
        "networks-json-path",
        [],
        []
      );

      await readJson(result);
    } catch (error) {
      console.log("Error invoking remote method:", error);
    }
  }

  /// Function to read the JSON file
  const readJson = async (path: string) => {
    var parts = splitPath(path);

    try {
      if (parts) {
        const data = await window.awesomeApi.jsonRead(
          parts[0],
          "/networks.json"
        );

        if (data) {
          setNetworkJson(data);
        } else {
          await updateJson(parts[0], {
            local: {
              bind: "127.0.0.1:4943",
              type: "ephemeral",
              replica: {
                subnet_type: "application",
              },
            },
          });
        }
      }
    } catch (error) {
      console.error("Error reading networks.json:", error);
    }
  };

  // Function to update the JSON file
  const updateJson = async (path, newData) => {
    if (path) {
      const success = await window.awesomeApi.jsonWrite(
        path,
        "/networks.json",
        newData
      );
      if (success) {
        console.log("File updated successfully");
      }
    } else {
      console.error("Failed to update file");
    }
  };

  // Call updateJson when the JSONInput changes
  const handleJsonChange = async (newData) => {
    const result = await window.awesomeApi.runDfxCommand(
      "info",
      "networks-json-path",
      [],
      []
    );

    var parts = splitPath(result);

    if (newData.jsObject && parts[0]) {
      updateJson(parts[0], newData.jsObject);
    }
  };

  useEffect(() => {
    checkNetworkJson();
  }, []);

  return (
    <div>
      {networkJson ? (
        <JSONInput
          id="network_json"
          width="100%"
          height="calc(100vh - 100px)"
          placeholder={networkJson}
          locale={locale}
          onChange={handleJsonChange}
        />
      ) : (
        <Loading />
      )}
    </div>
  );
}
