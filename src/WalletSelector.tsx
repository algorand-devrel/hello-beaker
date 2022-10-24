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
import { useConnectWallet, useWallet } from "@txnlab/use-wallet";

type WalletSelectorProps = {
  network: string;
};

export default function WalletSelector(props: WalletSelectorProps) {
  const [selectorOpen, setSelectorOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const { disconnect, activeAccount, accounts, selectActiveAccount } =
    useConnectWallet();

  async function disco() {
    if (activeAccount === null) return;
    await disconnect(activeAccount.providerId);
  }

  async function handleChangeAccount(e: any) {
    if (activeAccount === null) return;
    const newAddress: string = e.target.value;
    selectActiveAccount(activeAccount?.providerId, newAddress);
  }

  const display = !activeAccount ? (
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
      <ButtonGroup>
        <Select
          onChange={handleChangeAccount}
          variant="outlined"
          value={activeAccount.address}
        >
          {accounts.map((acct) => {
            return (
              <MenuItem value={acct.address} key={acct.address}>
                {acct.address.slice(0, 8)}
              </MenuItem>
            );
          })}
        </Select>
        <IconButton onClick={disco} size="small">
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
        onClose={() => {
          setSelectorOpen(false);
        }}
      />
    </div>
  );
}

type WalletSelectorDialogProps = {
  open: boolean;
  onClose(): void;
};

function WalletSelectorDialog(props: WalletSelectorDialogProps) {
  const { providers, reconnectProviders } = useConnectWallet();

  // Reconnect the session when the user returns to the dApp
  React.useEffect(() => {
    reconnectProviders();
  }, []);

  // Use these properties to display connected accounts to users.
  // They are reactive and presisted to local storage.
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle> Select Wallet </DialogTitle>
      <DialogContent>
        <ul style={{ listStyle: "none" }}>
          {providers.map((provider) => (
            <li key={"provider-" + provider.id} style={{ margin: "0.25em" }}>
              <Button
                variant="outlined"
                onClick={() => {
                  provider.connect();
                  props.onClose();
                }}
                disabled={provider.isConnected}
              >
                <img
                  style={{ height: "30px", width: "30px", margin: "0.5em" }}
                  src={provider.icon}
                />
                <h5>{provider.name} </h5>
              </Button>
            </li>
          ))}
        </ul>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}> Cancel </Button>
      </DialogActions>
    </Dialog>
  );
}
