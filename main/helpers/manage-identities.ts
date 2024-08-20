export function handleIdentities(store, action, identity?, newIdentity?) {
  let identities = store.get("identities", []);

  switch (action) {
    case "add":
      // This case might not be needed if you're always rebuilding the list
      // But keep it for potential manual additions
      if (!identity.name || identities.some((i) => i.name === identity.name)) {
        throw new Error("Identity already exists or name is missing");
      }
      identities.push(identity);
      break;

    case "rename":
      const existingIdentityIndex = identities.findIndex(
        (i) => i.name === identity.name
      );
      if (existingIdentityIndex === -1) {
        throw new Error("Identity to rename not found");
      }
      if (identities.some((i) => i.name === newIdentity.name)) {
        throw new Error("New identity name already exists");
      }
      identities[existingIdentityIndex] = {
        ...identities[existingIdentityIndex],
        name: newIdentity.name,
      };
      break;

    case "delete":
      // This case might not be needed if you're always rebuilding the list
      // But keep it for potential manual deletions
      identities = identities.filter((i) => i.name !== identity.name);
      break;

    case "get":
      if (identity.name) {
        const requestedIdentity = identities.find(
          (i) => i.name === identity.name
        );
        return requestedIdentity || null;
      }
      return identities;

    case "list":
      // Return all identities
      return identities;

    default:
      throw new Error("Invalid action");
  }

  store.set("identities", identities);
  return identities;
}
