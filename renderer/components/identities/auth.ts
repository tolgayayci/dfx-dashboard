import { AuthClient } from "@dfinity/auth-client";

export async function loginWithII() {
  return new Promise(async (resolve, reject) => {
    const authClient = await AuthClient.create();

    authClient.login({
      identityProvider: "https://identity.ic0.app",
      onSuccess: async () => {
        try {
          const result = await handleAuthenticated(authClient);
          resolve(result);
        } catch (error) {
          console.error("Error in handleAuthenticated", error);
          reject(error);
        }
      },
      onError: (err) => {
        console.error("Error logging in", err);
        reject(err);
      },
    });
  });
}

export async function handleAuthenticated(authClient: AuthClient) {
  const identity = await authClient.getIdentity();

  try {
    const serializedInternetIdentity = JSON.stringify(
      identity,
      (key, value) => {
        if (typeof value === "bigint") {
          return value.toString();
        } else {
          return value;
        }
      }
    );

    const internetIdentity = {
      name: identity.getPrincipal().toText(),
      isInternetIdentity: true,
      internetIdentity: serializedInternetIdentity,
    };

    const result = await window.awesomeApi.manageIdentities(
      "add",
      internetIdentity
    );

    return result;
  } catch (error) {
    console.error("Error saving identity", error);
  }
}
