import React from "react";
import { createRoot } from 'react-dom/client'
import { HttpAgent, Actor } from '@dfinity/agent';
import fetch from 'isomorphic-fetch';
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, idlFactory } from "../../declarations/backend";
import App from "./components/App";

const host = process.env.DFX_NETWORK === 'local' ? 'http://127.0.0.1:4943' : 'https://identity.ic0.app';
const HTTP_Agent = new HttpAgent({ fetch, host });

export let AUTH_PRINCIPAL = "";
export let AUTH_ACTOR;

let authClient;
const root = createRoot(document.getElementById("root"));

async function init() {
  if (process.env.DFX_NETWORK === "local")
    await HTTP_Agent.fetchRootKey();

  authClient = await AuthClient.create();

  if (await authClient.isAuthenticated())
    handleAuthenticated();
  else
    root.render(<App />);
};

init();

async function handleAuthenticated() {
  root.render(<App isLoading={true} />);
  try {
    const identity = await authClient.getIdentity();
    const principal = await identity.getPrincipal();
    AUTH_PRINCIPAL = principal.toString();

    HTTP_Agent.replaceIdentity(identity);

    AUTH_ACTOR = await Actor.createActor(idlFactory, {
      agent: HTTP_Agent,
      canisterId: canisterId,
    });
  } catch (error) {
    logout();
  }
  root.render(<App isLoading={false} />);
}

async function logout() {
  root.render(<App isLoading={true} />);

  await authClient.logout();
  const identity = await authClient.getIdentity();
  HTTP_Agent.replaceIdentity(identity);
  AUTH_PRINCIPAL = "";

  root.render(<App isLoading={false} />);
}

export const HANDLEAUTH = async () => {
  if (await authClient.isAuthenticated()) {
    logout();
  } else {
    await authClient.login({
      identityProvider: process.env.DFX_NETWORK === "local"
        ? `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/`  //For Chrome and Firefox
        // `http://localhost:4943/?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY}`  //For Safari
        : "https://identity.ic0.app",
      onSuccess: () => handleAuthenticated(),
    });
  }
}