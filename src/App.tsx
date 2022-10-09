import "./App.css";
import { useState, useEffect } from "react";

import { Network, APIProvider, getAlgodClient } from "beaker-ts/lib/clients";
import { useSessionWallet, DummySigner } from "beaker-ts/lib/web";
import { HelloBeaker } from "./hellobeaker_client";

import WalletSelector from "./AlgorandSessionWallet";
import { Box, Button, Input } from "@mui/material";

// Setup config for client/network
const apiProvider = APIProvider.Sandbox;
const network = Network.SandNet;

function App() {
  // Start with no app id for this demo, since we allow creation
  // Otherwise it'd come in as part of conf
  const [appId, setAppId] = useState<number>(0);

  // Init our algod client
  const algodClient = getAlgodClient(apiProvider, network);

  // Init our wallet, will try to get from session storage
  //   Internally it checks session storage to see if we've got
  //   an active session and initializes appropriate wallet
  //   given user preferences
  const { wallet, connected } = useSessionWallet(network);

  // Init our app client
  // Assumes we have a signer/address which may not be true
  const [appClient, setAppClient] = useState<HelloBeaker>(
    new HelloBeaker({
      client: algodClient,
      signer: DummySigner,
      sender: "",
      appId: appId,
    })
  );

  // If the wallet or app id change, we should
  // update our app client to reflect it
  //useEffect(() => {
  //  setAppClient(
  //    new HelloBeaker({
  //      client: algodClient,
  //      signer: wallet.signer(),
  //      sender: wallet.address(),
  //      appId: appId,
  //    })
  //  );
  //}, [algodClient, wallet, appId]);


  async function createApp() {
    const [appId, ,] = await appClient.create();
    setAppId(appId);
    alert(`Created app: ${appId}`);
  }

  async function greet() {
    const ta = document.getElementById("name") as HTMLTextAreaElement;
    const result = await appClient.hello({ name: ta.value });
    alert(result.value);
  }

  const action = !appId ? (
    <Button variant="outlined" onClick={createApp}>
      Create App
    </Button>
  ) : (
    <div>
      <Input type='text' id="name" placeholder="what is your name?"></Input>
      <hr />
      <Button variant="outlined" onClick={greet}>
        Greet
      </Button>
    </div>
  );

  return (
    <div className="App">
      <Box>
        <WalletSelector network={network} wallet={wallet} />
      </Box>
      <Box> {action} </Box>
    </div>
  );
}

export default App;
