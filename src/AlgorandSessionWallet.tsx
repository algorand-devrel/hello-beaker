import * as React from "react";
import { SessionWallet, ImplementedWallets } from "beaker-ts/lib/web";
import {
  Select,
  Button,
  Dialog,
  Box,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"

type AlgorandSessionWalletProps = {
  network: string;
  sessionWallet?: SessionWallet;
  updateWallet(sw?: SessionWallet): void;
};

export default function AlgorandSessionWallet(
  props: AlgorandSessionWalletProps
) {
  const [ selectorOpen, setSelectorOpen ] = React.useState<boolean>(false);
  const { sessionWallet, updateWallet } = props;

  React.useEffect(() => {
    if (sessionWallet?.connected()) return;

    let interval: any;
    sessionWallet?.connect().then((success) => {
      if (!success) return;
      // Check every 500ms to see if we've connected then kill the interval
      // This is most useful in the case of walletconnect where it may be several
      // seconds before the user connects
      interval = setInterval(() => {
        if (sessionWallet.connected()) {
          clearInterval(interval);
          updateWallet(sessionWallet);
        }
      }, 500);
    });
    return () => {
      clearInterval(interval);
    };
  }, [sessionWallet, updateWallet]);

  function disconnectWallet() {
    props.sessionWallet?.disconnect();
    props.updateWallet(undefined);
  }

  function handleChangeAccount(e: any) {
    const acctIdx = parseInt(e.target.value);
    console.log(`Selected: ${acctIdx}`);
    props.sessionWallet?.setAccountIndex(acctIdx);
    props.updateWallet(props.sessionWallet);
  }

  async function handleSelectedWallet(choice: string) {
    if (!(choice in ImplementedWallets)) {
      if (props.sessionWallet?.wallet !== undefined)
        props.sessionWallet.disconnect();
    }

    const sw = new SessionWallet(props.network, choice);

    // Try to connect, if it fails bail
    if (!(await sw.connect())) return sw.disconnect();

    props.updateWallet(sw);
  }

  const connected = props.sessionWallet?.connected();
  console.log("Connected? ", connected)
  const display = !connected ? (
    <Button
      color="warning"
      variant="outlined"
      onClick={() => {
        setSelectorOpen(!selectorOpen);
      }}
    >
      Connect Wallet
    </Button>
  ) : (
    <Box>
      <Select
        onChange={handleChangeAccount}
        defaultValue={sessionWallet?.accountIndex()}
      >
         {sessionWallet?.wallet.accounts.map((addr, idx) => {
           return (
             <option value={idx} key={idx}>{addr.slice(0, 8)}</option>
           );
         })}

      </Select>
      <Button endIcon={<CloseIcon />} color="warning" variant="outlined" onClick={disconnectWallet} />
    </Box>
  );


  return (
    <div>
      {display}
      <WalletSelectorDialog
        open={selectorOpen}
        handleSelection={handleSelectedWallet}
        onClose={()=>{setSelectorOpen(false)}}
      />
    </div>
  );
}

type WalletSelectorDialogProps = {
  open: boolean;
  handleSelection(value: string): void;
  onClose(): void;
};

function WalletSelectorDialog(props: WalletSelectorDialogProps) {
  function handleWalletSelected(e: any) {
    props.handleSelection(e.currentTarget.id);
    props.onClose()
  }

  const walletOptions = [];
  for (const [k, v] of Object.entries(ImplementedWallets)) {
    const imgSrc = v.img(false);
    const imgContent =
      imgSrc === "" ? (
        <div></div>
      ) : (
        <img alt="wallet-branding" className="wallet-branding" src={imgSrc} />
      );

    walletOptions.push(
      <li key={k}>
        <Button id={k} variant="outlined" onClick={handleWalletSelected}>
          {imgContent}
          <div className="wallet-option">
            <h5>{v.displayName()}</h5>
          </div>
        </Button>
      </li>
    );
  }

  return (
    <div>
      <Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle> Select Wallet </DialogTitle>
        <DialogContent>
          <ul className="wallet-option-list">{walletOptions}</ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}> cancel </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
