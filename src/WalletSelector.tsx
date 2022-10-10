import * as React from "react";
import {
  SessionWalletData,
  ImplementedWallets,
  SessionWalletManager,
} from "beaker-ts/lib/web";
import {
  Select,
  Button,
  Dialog,
  Box,
  DialogContent,
  DialogTitle,
  DialogActions,
  MenuItem,
  ButtonGroup,
  IconButton,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";
import CloseIcon from "@mui/icons-material/Close";
import { WalletName } from "beaker-ts/lib/web/session_wallet";

type WalletSelectorProps = {
  network: string;
  accountSettings: SessionWalletData;
  setAccountSettings: (swd: SessionWalletData) => void;
};

export default function WalletSelector(props: WalletSelectorProps) {
  const [selectorOpen, setSelectorOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { network, accountSettings, setAccountSettings } = props;

  //React.useEffect(() => {
  //  if (connected) return;

  //  let interval: any;
  //  wallet.connect().then((success) => {
  //    if (!success) return;
  //    // Check every 500ms to see if we've connected then kill the interval
  //    // This is most useful in the case of walletconnect where it may be several
  //    // seconds before the user connects
  //    interval = setInterval(() => {
  //      if (wallet.connected()) {
  //        clearInterval(interval);
  //        //updateWallet(sessionWallet);
  //      }
  //    }, 500);
  //  });
  //  return () => {
  //    clearInterval(interval);
  //  };
  //}, [wallet]);

  function disconnectWallet() {
    SessionWalletManager.disconnect(network);
    setAccountSettings(SessionWalletManager.read(network));
  }

  function handleChangeAccount(e: any) {
    const acctIdx = parseInt(e.target.value);
    SessionWalletManager.setAcctIdx(network, acctIdx);
    setAccountSettings(SessionWalletManager.read(network));
  }

  async function handleSelectedWallet(choice: string) {
    SessionWalletManager.setWalletPreference(network, choice as WalletName);
    setLoading(true)
    await SessionWalletManager.connect(network);
    setAccountSettings(SessionWalletManager.read(network));
    setLoading(false)
  }

  const display = !accountSettings.data.acctList.length ? (
    <LoadingButton
      variant="contained"
      loading={loading}
      color="secondary"
      onClick={() => {
        setSelectorOpen(!selectorOpen);
      }}
    >
      Connect Wallet
    </LoadingButton>
  ) : (
    <Box>
      <ButtonGroup variant="text">
        <Select
          onChange={handleChangeAccount}
          variant="standard"
          value={accountSettings.data.defaultAcctIdx}
        >
          {accountSettings.data.acctList.map((addr, idx) => {
            return (
              <MenuItem value={idx} key={idx}>
                {addr.slice(0, 8)}
              </MenuItem>
            );
          })}
        </Select>
        <IconButton onClick={disconnectWallet} size="small">
          <CloseIcon htmlColor="red" />
        </IconButton>
      </ButtonGroup>
    </Box>
  );

  return (
    <div>
      {display}
      <WalletSelectorDialog
        open={selectorOpen}
        handleSelection={handleSelectedWallet}
        onClose={() => {
          setSelectorOpen(false);
        }}
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
    props.onClose();
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
