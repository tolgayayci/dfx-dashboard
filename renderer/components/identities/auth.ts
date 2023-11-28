import { AuthClient } from "@dfinity/auth-client";

export async function loginWithII() {
  const authClient = await AuthClient.create();

  authClient.login({
    identityProvider: "https://identity.ic0.app",
    onSuccess: async () => {
      console.log("login success");
      const identity = authClient.getIdentity();

      // Here you call manageIdentities to add the new identity
      try {
        const result = await window.awesomeApi.manageIdentities("add", {
          name: "", // As the name can be empty for internet identities
          isInternetIdentity: true,
          internetIdentityPrincipal: identity.getPrincipal().toString(),
        });
        console.log("Identity added", result);
      } catch (error) {
        console.error("Error adding identity:", error);
      }
    },
    onError: (err) => {
      console.log("login error", err);
    },
  });

  console.log("loginWithII", authClient.getIdentity());

  return {
    identity: authClient.getIdentity(),
    isLogged: authClient.isAuthenticated(),
  };
}
