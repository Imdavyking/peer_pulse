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
  "ea400f4887007247400249f62cadd6c53c85c3c579b22cebda692bb0f52580b8";
export const MODULE_NAME = "peer_pulse";
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
export const WS_URL = import.meta.env.VITE_WS_URL;
export const CONNECT_WALLET_KEY_STORAGE = "connectedWallet";
