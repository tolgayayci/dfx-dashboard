export function handleIdentities(store, action, identity) {
    let identities = store.get('identities', []);
  
      switch (action) {
        case 'add':
          if (identities.some(i => i.name === identity.name)) {
            throw new Error('Identity already exists');
          }
          identities.push(identity);
          break;
  
        case 'update':
          const existingIdentityIndex = identities.findIndex(i => i.name === identity.name);
          if (existingIdentityIndex === -1) {
            throw new Error('Identity not found');
          }
          identities[existingIdentityIndex] = identity;
          break;
  
        case 'delete':
          identities = identities.filter(i => i.name !== identity.name);
          break;
  
        case 'get':
          if (identity && identity.name) {
            const requestedIdentity = identities.find(i => i.name === identity.name);
            return requestedIdentity || null;
          }
          return identities;
  
        default:
          throw new Error('Invalid action');
      }
  
      store.set('identities', identities);
      return identities;
}