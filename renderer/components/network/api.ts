import { NetworkData } from "./types";

export async function checkNetworkJson(
  setNetworkData: React.Dispatch<React.SetStateAction<NetworkData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  try {
    const result = await window.awesomeApi.runDfxCommand(
      "info",
      "networks-json-path",
      [],
      []
    );
    await readJson(result, setNetworkData, setIsLoading);
  } catch (error) {
    console.log("Error invoking remote method:", error);
    setIsLoading(false);
  }
}

export async function readJson(
  path: string,
  setNetworkData: React.Dispatch<React.SetStateAction<NetworkData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const parts = splitPath(path);
  try {
    if (parts) {
      const data = await window.awesomeApi.jsonRead(parts[0], "/networks.json");
      console.log(data);
      if (data) {
        setNetworkData(data);
        setIsLoading(false);
      } else {
        await createDefaultJson(parts[0], setNetworkData, setIsLoading);
      }
    }
  } catch (error) {
    console.error("Error reading networks.json:", error);
    setIsLoading(false);
  }
}

export async function createDefaultJson(
  path: string,
  setNetworkData: React.Dispatch<React.SetStateAction<NetworkData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const defaultData = {
    local: {
      bind: "127.0.0.1:4943",
      type: "ephemeral",
    },
    ic: {
      providers: ["https://icp0.io"],
      type: "persistent",
    },
  };
  await updateJson(path, defaultData);
  setNetworkData(defaultData);
  setIsLoading(false);
  await window.awesomeApi.reloadApplication();
}

export async function updateJson(path: string, newData: NetworkData) {
  if (path) {
    const success = await window.awesomeApi.jsonWrite(
      path,
      "/networks.json",
      newData
    );
    if (success) {
      console.log("File updated successfully");
      return true;
    }
  }
  console.error("Failed to update file");
  return false;
}

export async function getNetworkJsonPath() {
  const result = await window.awesomeApi.runDfxCommand(
    "info",
    "networks-json-path",
    [],
    []
  );
  return splitPath(result)[0];
}

function splitPath(path: string) {
  const index = path.lastIndexOf("/");
  const part1 = path.substring(0, index);
  const part2 = path.substring(index);
  return [part1, part2];
}
