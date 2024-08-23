import {
  AnonymousIdentity,
  SignIdentity,
  fromHex,
  toHex,
} from "@dfinity/agent";
import { Ed25519KeyIdentity, Ed25519PublicKey } from "@dfinity/identity";
import { defineElement, IILoginButton } from "@dfinity/ii-login-button";

async function main() {
  // initialize the login button
  defineElement();

  /**
   * @type {IILoginButton}
   */
  const loginButton = document.querySelector("ii-login-button");
  loginButton.addEventListener("ready", () => {
    try {
      const { redirectUri, identity } = parseParams();

      loginButton.configure({
        createOptions: {
          identity,
        },
        loginOptions: {
          onSuccess: () => {
            const loginButton = document.querySelector("ii-login-button");
            const delegationIdentity = loginButton.identity;

            var delegationString = JSON.stringify(
              delegationIdentity.getDelegation().toJSON()
            );

            const encodedDelegation = encodeURIComponent(delegationString);
            const url = `dfx://${redirectUri}/?delegation=${encodedDelegation}`;
            console.log(`Redirecting to ${url}`);
            console.log(encodedDelegation);

            window.open(url, "_self");
          },
          onError: (error) => {
            console.log(error);
          },
        },
      });
    } catch (error) {
      console.log(error);
      // renderError(error);
    }
  });
}

class IncompleteEd25519KeyIdentity extends SignIdentity {
  constructor(publicKey) {
    super();
    this._publicKey = publicKey;
  }

  getPublicKey() {
    return this._publicKey;
  }
}

/**
 * Parses the query string parameters from the URL.
 * @returns {{redirectUri: string; identity: SignIdentity}} The parsed query string parameters.
 */
function parseParams() {
  const url = new URL(window.location.href);
  const redirectUri = decodeURIComponent(url.searchParams.get("redirect_uri"));
  const pubKey = url.searchParams.get("pubkey");

  if (!redirectUri || !pubKey) {
    renderError(new Error("Missing redirect_uri or pubkey in query string"));
    throw new Error("Missing redirect_uri or pubkey in query string");
  }
  const identity = new IncompleteEd25519KeyIdentity(
    Ed25519PublicKey.fromDer(fromHex(pubKey))
  );

  return { redirectUri, identity };
}

window.addEventListener("DOMContentLoaded", () => {
  main();
});

function renderError(error) {
  // if (document.querySelector("#error")) {
  //   document.querySelector("#error").remove();
  // }
  // const errorText = document.createElement("p");
  // errorText.style.color = "red";
  // errorText.id = "error";
  // errorText.innerText = error.message;
  // document.body.appendChild(errorText);
}
