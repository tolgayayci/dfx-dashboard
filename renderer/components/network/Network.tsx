import { useEffect, useState } from "react";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import Loading from "@components/common/loading";
import { AlertCircle } from "lucide-react";

export default function NetworkComponent() {
  const [networkJson, setNetworkJson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  function splitPath(path) {
    var index = path.lastIndexOf("/");
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
      setIsLoading(false);
    }
  }

  const readJson = async (path) => {
    var parts = splitPath(path);
    try {
      if (parts) {
        const data = await window.awesomeApi.jsonRead(
          parts[0],
          "/networks.json"
        );
        if (data) {
          setNetworkJson(data);
          setIsLoading(false);
        } else {
          await createDefaultJson(parts[0]);
        }
      }
    } catch (error) {
      console.error("Error reading networks.json:", error);
      setIsLoading(false);
    }
  };

  const createDefaultJson = async (path) => {
    const defaultData = {
      local: {
        bind: "127.0.0.1:4943",
        type: "ephemeral",
        replica: {
          subnet_type: "application",
        },
      },
    };
    await updateJson(path, defaultData);
    await window.awesomeApi.reloadApplication();
  };

  const updateJson = async (path, newData) => {
    if (path) {
      const success = await window.awesomeApi.jsonWrite(
        path,
        "/networks.json",
        newData
      );
      if (success) {
        setNetworkJson(newData);
        setIsLoading(false);
        console.log("File updated successfully");
      }
    } else {
      console.error("Failed to update file");
      setIsLoading(false);
    }
  };

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
      {isLoading ? (
        <Loading />
      ) : networkJson ? (
        <JSONInput
          id="network_json"
          width="100%"
          height="calc(100vh - 100px)"
          placeholder={networkJson}
          locale={locale}
          onChange={handleJsonChange}
        />
      ) : (
        <div className="h-[85vh] flex flex-col items-center justify-center">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />{" "}
          <div className="text-md font-semibold text-gray-800">
            Error loading network configuration
          </div>
        </div>
      )}
    </div>
  );
}
