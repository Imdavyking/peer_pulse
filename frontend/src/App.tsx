import "./App.css";
import NavHeader from "./components/NavHeader";
import Router from "./router";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "aptos";

function App() {
  return (
    <>
      <AptosWalletAdapterProvider
        dappConfig={{ network: Network.DEVNET }}
        optInWallets={["Petra", "Pontem Wallet", "Nightly"]}
        autoConnect={true}
      >
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
