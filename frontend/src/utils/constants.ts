// import usdc from "../assets/images/usdc.png";
import aptos from "../assets/images/aptos.png";

export const tokens = [
  {
    name: "APT",
    address: "0x1",
    image: aptos,
  },
  // {
  //   name: "USDC",
  //   address: "0x2222222222222222222222222222222222222222",
  //   image: usdc,
  // },
];
export const ACCOUNT =
  "dff05cc824da2a56ba5b92c776502e93bb5cfbd984bf4110a0d7fb4c0de13a85";
export const ACCOUNT_ADDR =
  "0xbc63d9c135d5a9fb61aa80093b884d5fe4605c565a80338d034bae331be5ebf5";
export const MODULE_NAME = "peer_pulse";
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
export const WS_URL = import.meta.env.VITE_WS_URL;
export const CONNECT_WALLET_KEY_STORAGE = "connectedWallet";
