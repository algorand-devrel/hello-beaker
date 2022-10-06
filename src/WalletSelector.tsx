import * as React from "react";

import { SessionWallet, ImplementedWallets } from "beaker-ts/lib/web";
import {
  Select,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogBody,
  useDisclosure,
  AlertDialogFooter,
  Box,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import {SmallCloseIcon} from "@chakra-ui/icons"

type AlgorandWalletConnectorProps = {
  network: string;
  sessionWallet?: SessionWallet;
  updateWallet(sw?: SessionWallet): void;
};

export default function WalletSelector(props: AlgorandWalletConnectorProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);

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

  async function handleSelectedWallet(e: any) {
    const choice = e.currentTarget.id;

    if (!(choice in ImplementedWallets)) {
      if (props.sessionWallet?.wallet !== undefined)
        props.sessionWallet.disconnect();
    }

    const sw = new SessionWallet(props.network, choice);

    // Try to connect, if it fails bail
    if (!(await sw.connect())) return sw.disconnect();

    props.updateWallet(sw);
    onClose();
  }

  function handleChangeAccount(e: any) {
    const acctIdx = parseInt(e.target.value);
    console.log(`Selected: ${acctIdx}`);
    props.sessionWallet?.setAccountIndex(acctIdx);
    props.updateWallet(props.sessionWallet);
  }

  const walletOptions = [];
  for (const [k, v] of Object.entries(ImplementedWallets)) {
    walletOptions.push(
      <li key={k}>
        <Button
          id={k}
          size="lg"
          variant="outline"
          onClick={handleSelectedWallet}
        >
          <div className="wallet-option">
            <img
              alt="wallet-branding"
              className="wallet-branding"
              src={v.img(false)}
            />
            <h5>{v.displayName()}</h5>
          </div>
        </Button>
      </li>
    );
  }

  if (!sessionWallet?.connected())
    return (
      <div>
        <Button colorScheme="yellow" variant="outline" onClick={onOpen}>
          Connect Wallet
        </Button>
        <AlertDialog
          isOpen={isOpen}
          onClose={onClose}
          leastDestructiveRef={cancelRef}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader> Select Wallet </AlertDialogHeader>

              <AlertDialogBody>
                <ul className="wallet-option-list">{walletOptions}</ul>
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  cancel
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </div>
    );

  return (
    <div>
      <Box flexFlow='right'>
        <Flex alignItems="right">
          <Select
            size="md"
            w="10em"
            onChange={handleChangeAccount}
            defaultValue={props.sessionWallet?.accountIndex()}
          >
            {sessionWallet?.wallet.accounts.map((addr, idx) => {
              return (
                <option value={idx} key={idx}>
                  {" "}
                  {addr.substr(0, 8)}...{" "}
                </option>
              );
            })}
          </Select>
          <IconButton
            colorScheme='red'
            variant="ghost"
            aria-label="disconnect wallet"
            onClick={disconnectWallet} 
            icon={ <SmallCloseIcon />}
            />
        </Flex>
      </Box>
    </div>
  );
}
