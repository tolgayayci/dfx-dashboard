export function handleIdentities(store, action, identity) {
  let identities = store.get("identities", []);

  switch (action) {
    case "add":
      if (identity.isInternetIdentity) {
        if (
          identities.some(
            (i) =>
              i.internetIdentityPrincipal === identity.internetIdentityPrincipal
          )
        ) {
          throw new Error("Internet identity already exists");
        }
      } else {
        if (
          !identity.name ||
          identities.some((i) => i.name === identity.name)
        ) {
          throw new Error("Identity already exists or name is missing");
        }
      }
      identities.push(identity);
      break;

    case "update":
      const identityKey = identity.isInternetIdentity
        ? "internetIdentityPrincipal"
        : "name";
      const existingIdentityIndex = identities.findIndex(
        (i) => i[identityKey] === identity[identityKey]
      );
      if (existingIdentityIndex === -1) {
        throw new Error("Identity not found");
      }
      identities[existingIdentityIndex] = identity;
      break;

    case "delete":
      const keyToDelete = identity.isInternetIdentity
        ? "internetIdentityPrincipal"
        : "name";
      identities = identities.filter(
        (i) => i[keyToDelete] !== identity[keyToDelete]
      );
      break;

    case "get":
      if (identity) {
        const keyToFind = identity.isInternetIdentity
          ? "internetIdentityPrincipal"
          : "name";
        const requestedIdentity = identities.find(
          (i) => i[keyToFind] === identity[keyToFind]
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
