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
  "d9a0133b75e87fb012f4a419d12f12951628dab2c97d78b104b9e8ae7b2f2aac";
export const MODULE_NAME = "peer_pulse";
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
export const WS_URL = import.meta.env.VITE_WS_URL;
export const CONNECT_WALLET_KEY_STORAGE = "connectedWallet";
