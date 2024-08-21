export function handleIdentities(store, action, identity?, newIdentity?) {
  let identities = store.get("identities", []);

  switch (action) {
    case "add":
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
      return identities;

    case "select":
      if (!identity.name) {
        throw new Error("Identity name is required for selection");
      }
      identities = identities.map((i) => ({
        ...i,
        isActive: i.name === identity.name,
      }));
      break;

    case "update":
      if (!identity.name) {
        throw new Error("Identity name is required for update");
      }
      const updateIndex = identities.findIndex((i) => i.name === identity.name);
      if (updateIndex === -1) {
        throw new Error("Identity to update not found");
      }
      identities[updateIndex] = {
        ...identities[updateIndex],
        ...newIdentity,
      };
      break;

    default:
      throw new Error("Invalid action");
  }

  store.set("identities", identities);
  return identities;
}
