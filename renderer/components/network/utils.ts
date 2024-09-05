import { NetworkData } from "./types";

export function sortAndFilterNetworks(
  networkData: NetworkData,
  searchTerm: string,
  sortColumn: "name" | "type",
  sortDirection: "asc" | "desc"
) {
  return Object.entries(networkData)
    .filter(
      ([name, details]) =>
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (details.type &&
          details.type.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort(([aName, aDetails], [bName, bDetails]) => {
      const aValue = sortColumn === "name" ? aName : aDetails.type || "";
      const bValue = sortColumn === "name" ? bName : bDetails.type || "";
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
}
