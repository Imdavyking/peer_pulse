import {
  getInjectedExtensions,
  connectInjectedExtension,
  InjectedExtension,
  InjectedPolkadotAccount,
} from "polkadot-api/pjs-signer";
import { CONNECT_WALLET_KEY_STORAGE } from "../utils/constants";

export const connectWallet = async () => {
  // Get the list of installed extensions
  const extensions: string[] = getInjectedExtensions();

  // Connect to an extension
  const selectedExtension: InjectedExtension = await connectInjectedExtension(
    extensions[0]
  );

  // Get accounts registered in the extension
  const accounts: InjectedPolkadotAccount[] = selectedExtension.getAccounts();

  // The signer for each account is in the `polkadotSigner` property of `InjectedPolkadotAccount`
  localStorage.setItem(CONNECT_WALLET_KEY_STORAGE, accounts[0].address);
  return accounts[0];
};

export const disconnectWallet = async () => {
  const extensions: string[] = getInjectedExtensions();

  // Connect to an extension
  const selectedExtension: InjectedExtension = await connectInjectedExtension(
    extensions[0]
  );

  selectedExtension.disconnect();
};

export function hasConnected() {
  const isConnectedBefore = localStorage.getItem(CONNECT_WALLET_KEY_STORAGE);

  return !!isConnectedBefore;
}
