import { useState, useEffect } from "react";

// A custom hook to fetch canister data based on a path and canister name
export default function useCanister(projectPath, canisterName) {
  const [canisterData, setCanisterData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchCanisterData() {
    setIsLoading(true);
    try {
      const result = await window.awesomeApi.listCanisters(projectPath);
      const canisters = result.canisters || {};

      // Find the specific canister by name
      const foundCanister = Object.keys(canisters).find(
        (key) => key === canisterName
      );

      if (foundCanister) {
        setCanisterData({ name: foundCanister, ...canisters[foundCanister] });
      } else {
        setCanisterData(null);
        setError(new Error("Canister not found"));
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch the canister data when the hook is used and the path or canister name changes
  useEffect(() => {
    if (projectPath && canisterName) {
      fetchCanisterData();
    }
  }, [projectPath, canisterName]);

  return { canisterData, isLoading, error };
}
