import "./App.css";
import { useState } from "react";

import { sandboxAlgod } from "beaker-ts/lib/clients";
import { SessionWallet } from "beaker-ts/lib/web";
import { HelloBeaker } from "./hellobeaker_client";

import WalletSelector from "./AlgorandSessionWallet";
import { Box, Button } from "@mui/material";

function App() {
  const [algodClient, setAlgodClient] = useState(sandboxAlgod());

  const [addr, setAddr] = useState<string | undefined>(undefined);
  const [sessionWallet, setSessionWallet] = useState<SessionWallet | undefined>(
    undefined
  );

  const [appClient, setAppClient] = useState<HelloBeaker | undefined>(
    undefined
  );
  const [appId, setAppId] = useState<number | undefined>(undefined);

  function updateWallet(sw?: SessionWallet): void {
    if (sw === undefined) {
      setAddr(undefined);
      setSessionWallet(undefined);
      setAppClient(undefined);
    } else {
      const addr = sw.getDefaultAccount();

      setAddr(addr);
      setSessionWallet(sw);
      setAppClient(
        new HelloBeaker({
          client: algodClient,
          sender: addr,
          signer: sw.getSigner(),
        })
      );
    }
  }

  async function createApp() {
    if (
      sessionWallet === undefined ||
      addr === undefined ||
      appClient === undefined
    )
      throw new Error("Wallet or app client undefined?");
    const [appId, ,] = await appClient.create();
    setAppId(appId);
    console.log(`Created app: ${appId}`);
  }

  async function greet() {
    if (appClient === undefined) return;

    const ta = document.getElementById("name") as HTMLTextAreaElement;
    const result = await appClient.hello({ name: ta.value });

    alert(result.value);
  }

  const action =
    appId === undefined ? (
      <Button variant="outlined" onClick={createApp}>
        Create App
      </Button>
    ) : (
      <div>
        <textarea id="name" placeholder="what is your name?"></textarea>
        <hr />
        <Button variant="outlined" onClick={greet}>
          Greet
        </Button>
      </div>
    );

  return (
    <div className="App">
      <Box>
        <WalletSelector
          network="testnet"
          sessionWallet={sessionWallet}
          updateWallet={updateWallet}
        ></WalletSelector>
      </Box>

      <Box>
        <h3>Logged in as: {addr}</h3>
        {action}
      </Box>
    </div>
  );
}

export default App;
