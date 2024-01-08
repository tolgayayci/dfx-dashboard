import { useEffect, useState } from "react";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

export default function DfxComponent({ projectPath }) {
  const [dfxJson, setDfxJson] = useState(null);

  /// Function to read the JSON file
  const readJson = async () => {
    if (projectPath) {
      const data = await window.awesomeApi.jsonRead(projectPath, "/dfx.json");
      if (data) {
        setDfxJson(data);
      } else {
        console.error("Failed to read dfx.json from the provided path");
      }
    } else {
      console.error("No project path provided");
    }
  };

  // Function to update the JSON file
  const updateJson = async (newData) => {
    if (projectPath) {
      const success = await window.awesomeApi.jsonWrite(
        projectPath,
        "/dfx.json",
        newData
      );
      if (success) {
        console.log("File updated successfully");
      } else {
        console.error("Failed to update dfx.json at the provided path");
      }
    } else {
      console.error("No project path provided");
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
  }, [projectPath]); // Re-run when projectPath changes

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
        <div>No project path provided or failed to load data.</div>
      )}
    </div>
  );
}
