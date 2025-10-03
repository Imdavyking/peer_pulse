import "./App.css";
import NavHeader from "./components/NavHeader";
import { AptosWalletProvider } from "./context/WalletContext";
import Router from "./router";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <AptosWalletProvider>
        <ToastContainer />
        <BrowserRouter>
          <NavHeader />
          <Router />
        </BrowserRouter>
      </AptosWalletProvider>
    </>
  );
}

export default App;
