import { useState, useEffect, useRef } from "react";
import { toHex } from "@dfinity/agent";
import {
  Ed25519KeyIdentity,
  DelegationChain,
  DelegationIdentity,
  isDelegationValid,
} from "@dfinity/identity";

export function useAuth() {
  const [baseKey, setBaseKey] = useState<Ed25519KeyIdentity | undefined>(
    undefined
  );
  const [isReady, setIsReady] = useState<boolean>(false);
  const [identity, setIdentity] = useState<DelegationIdentity | null>(null);
  const [lastHandledData, setLastHandledData] = useState<any>(null);
  const lastHandledDataRef = useRef(lastHandledData);

  useEffect(() => {
    (async () => {
      const storedKeyResponse = await window.awesomeApi.getKeyValue("baseKey");

      if (storedKeyResponse.success && storedKeyResponse.value) {
        setBaseKey(Ed25519KeyIdentity.fromJSON(storedKeyResponse.value));
      } else {
        const key = Ed25519KeyIdentity.generate();
        setBaseKey(key);
        await window.awesomeApi.setKeyValue(
          "baseKey",
          JSON.stringify(key.toJSON())
        );
      }

      const storedDelegationResponse = await window.awesomeApi.getKeyValue(
        "delegation"
      );

      if (storedDelegationResponse.success && storedDelegationResponse.value) {
        const chain = DelegationChain.fromJSON(
          JSON.parse(storedDelegationResponse.value)
        );

        if (isDelegationValid(chain)) {
          //@ts-ignore
          const id = new DelegationIdentity(
            Ed25519KeyIdentity.fromJSON(storedKeyResponse.value),
            DelegationChain.fromJSON(JSON.parse(storedDelegationResponse.value))
          );
          setIdentity(id);
        } else {
          await window.awesomeApi.deleteKeyValue("delegation");
        }
      }

      setIsReady(true);
    })();
  }, []);

  useEffect(() => {
    lastHandledDataRef.current = lastHandledData;
  }, [lastHandledData]);

  useEffect(() => {
    if (identity) return;

    const handleDelegation = async (delegationParam) => {
      const chain = DelegationChain.fromJSON(
        JSON.parse(decodeURIComponent(delegationParam))
      );

      try {
        await window.awesomeApi.setKeyValue(
          "delegation",
          JSON.stringify(chain.toJSON())
        );

        const id = DelegationIdentity.fromDelegation(baseKey, chain);
        setIdentity(id);

        const serializedInternetIdentity = JSON.stringify(id, (key, value) => {
          return typeof value === "bigint" ? value.toString() : value;
        });

        const internetIdentity = {
          name: id.getPrincipal().toString(),
          isInternetIdentity: true,
          internetIdentity: serializedInternetIdentity,
        };

        const identities = await window.awesomeApi.manageIdentities("list", "");
        const identityExists = identities.some(
          (identity) => identity.name === internetIdentity.name
        );

        if (!identityExists) {
          const result = await window.awesomeApi.manageIdentities(
            "add",
            internetIdentity
          );
          console.log("Identity added:", result);
          await window.awesomeApi.reloadApplication();
        } else {
          console.log("Identity already exists, not adding again.");
        }
      } catch (error) {
        console.error("Error handling delegation or adding identity:", error);
      }
    };

    const delegateUpdateCallback = (data) => {
      if (data !== lastHandledDataRef.current) {
        handleDelegation(data);
      }
    };

    window.awesomeApi.onUpdateDelegate(delegateUpdateCallback);

    return () => {
      window.awesomeApi.offUpdateDelegate(delegateUpdateCallback);
    };
  }, [lastHandledData]);

  const login = async () => {
    if (!baseKey) {
      return;
    }
    const derKey = toHex(baseKey.getPublicKey().toDer());
    const url = new URL("https://v73c4-7qaaa-aaaak-qdbvq-cai.icp0.io/");

    url.searchParams.set("pubkey", derKey);

    const modifiedUrl = url.toString();

    window.awesomeApi.openExternalLink(modifiedUrl);
  };

  const logout = async () => {
    setIdentity(null);
    await window.awesomeApi.deleteKeyValue("delegation");
  };

  return {
    baseKey,
    setBaseKey,
    identity,
    isReady,
    login,
    logout,
  };
}
