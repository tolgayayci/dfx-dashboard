import { useState, useEffect } from "react";

// A custom hook to fetch canister data based on a path and canister name
export default function useCanister(projectPath, canisterName) {
  const [canisterData, setCanisterData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchCanisterData() {
    setIsLoading(true);
    try {
      // Check if this is an NNS canister
      if (projectPath === 'nns') {
        // Fetch NNS canisters
        const [localResult, icResult] = await Promise.all([
          window.awesomeApi.listNNSCanisters('local'),
          window.awesomeApi.listNNSCanisters('ic')
        ]);

        let foundCanister = null;

        // Search in local NNS canisters
        if (localResult.success) {
          foundCanister = localResult.data.find(canister => canister.name === canisterName);
        }

        // Search in IC NNS canisters if not found in local
        if (!foundCanister && icResult.success) {
          foundCanister = icResult.data.find(canister => 
            canister.name === canisterName || canister.name === `${canisterName} (IC)`
          );
        }

        if (foundCanister) {
          setCanisterData({
            ...foundCanister,
            type: 'nns',
            projectName: 'Network Nervous System'
          });
        } else {
          setCanisterData(null);
          setError(new Error("NNS Canister not found"));
        }
      } else {
        // Handle regular user canisters
        const result = await window.awesomeApi.listCanisters(projectPath);
        const canisters = result.canisters || {};

        // Find the specific canister by name
        const foundCanister = Object.keys(canisters).find(
          (key) => key === canisterName
        );

        if (foundCanister) {
          setCanisterData({ 
            name: foundCanister, 
            ...canisters[foundCanister],
            type: 'user'
          });
        } else {
          setCanisterData(null);
          setError(new Error("Canister not found"));
        }
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
