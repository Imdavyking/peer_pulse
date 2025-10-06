import "./App.css";
import NavHeader from "./components/NavHeader";
import Router from "./router";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

function App() {
  return (
    <>
      <AptosWalletAdapterProvider
        optInWallets={["Petra", "Petra"]}
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
