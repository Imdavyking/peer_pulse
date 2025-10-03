import "./App.css";
import NavHeader from "./components/NavHeader";
import Router from "./router";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { RiseWallet } from "@rise-wallet/wallet-adapter";

const wallets = [
  new PetraWallet(),
  new MartianWallet(),
  new PontemWallet(),
  new RiseWallet(),
];
function App() {
  return (
    <>
      <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
        <ToastContainer />
        <BrowserRouter>
          <NavHeader />
          <Router />
        </BrowserRouter>
      </AptosWalletAdapterProvider>
    </>
  );
}

export default App;
