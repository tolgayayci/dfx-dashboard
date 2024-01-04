// Project Specific Page
import { useEffect, useState } from "react";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

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
      console.error("Error invoking remote method:", error);
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
          console.log("File read successfully", data);
          setNetworkJson(data);
        } else {
          console.log("File not found, will creating new file");
          // const schema = await window.awesomeApi.runDfxCommand(
          //   "schema",
          //   "",
          //   ["--for"],
          //   ["networks"]
          // );

          await updateJson(parts[0], {});
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
    const projects = await window.awesomeApi.manageProjects("get");
    let activeProject = projects.find((p) => p.active);

    if (newData.jsObject && activeProject.path) {
      updateJson(activeProject.path, newData.jsObject);
    }
  };

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
            height="530px"
            width="100%"
            onChange={handleJsonChange}
          />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
