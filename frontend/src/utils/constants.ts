// import usdc from "../assets/images/usdc.png";
import polkadot from "../assets/images/polkadot.png";
import { ethers } from "ethers";
export const tokens = [
  {
    name: "DOT",
    address: ethers.ZeroAddress,
    image: polkadot,
  },
  // {
  //   name: "USDC",
  //   address: "0x2222222222222222222222222222222222222222",
  //   image: usdc,
  // },
];
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
export const WS_URL = import.meta.env.VITE_WS_URL;
export const CONNECT_WALLET_KEY_STORAGE = "connectedWallet";
