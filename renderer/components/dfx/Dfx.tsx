// Project Specific Page
import { useEffect, useState } from "react";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

export default function DfxComponent() {
  const [dfxJson, setDfxJson] = useState(null);

  /// Function to read the JSON file
  const readJson = async () => {
    const projects = await window.awesomeApi.manageProjects("get");
    let activeProject = projects.find((p) => p.active);

    if (activeProject.path) {
      const data = await window.awesomeApi.jsonRead(
        activeProject.path,
        "/dfx.json"
      );
      if (data) {
        setDfxJson(data);
      }
    } else {
      console.error("Failed to read dfx.json");
    }
  };

  // Function to update the JSON file
  const updateJson = async (newData) => {
    const projects = await window.awesomeApi.manageProjects("get");
    let activeProject = projects.find((p) => p.active);
    if (activeProject.path) {
      const success = await window.awesomeApi.jsonWrite(
        activeProject.path,
        "/dfx.json",
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
  const handleJsonChange = (newData) => {
    console.log(newData);
    if (newData.jsObject) {
      updateJson(newData.jsObject);
    }
  };

  useEffect(() => {
    readJson();
  }, []);

  return (
    <div>
      {dfxJson ? (
        <div className="w-full">
          <JSONInput
            id="dfx_json"
            placeholder={dfxJson}
            locale={locale}
            height="525px"
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
