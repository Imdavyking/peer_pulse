import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const ConnectWalletButton = () => {
  const { connect, disconnect, account, wallets } = useWallet();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);

  const shortenAddress = (addr: string) => {
    return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
  };

  const handleMainClick = () => {
    if (account) {
      setIsDisconnectModalOpen(true);
    } else {
      setIsConnectModalOpen(true);
    }
  };

  const handleWalletClick = async (walletName: any) => {
    connect(walletName);
    setIsConnectModalOpen(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setIsDisconnectModalOpen(false);
  };

  return (
    <>
      {/* Main Button */}
      <button
        onClick={handleMainClick}
        className="px-5 py-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition-transform cursor-pointer"
      >
        {account && account.address
          ? shortenAddress(account.address.toString())
          : "Connect Wallet"}
      </button>

      {/* Connect Modal */}
      {isConnectModalOpen && !account && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Select a Wallet
            </h2>
            <div className="flex flex-col space-y-3">
              {wallets &&
                wallets.map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={() => handleWalletClick(wallet.name)}
                    className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium transition-colors cursor-pointer"
                  >
                    {wallet.name}
                  </button>
                ))}
            </div>
            <button
              onClick={() => setIsConnectModalOpen(false)}
              className="mt-5 w-full px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Disconnect Confirmation Modal */}
      {isDisconnectModalOpen && account && account.address && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Disconnect Wallet
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to disconnect{" "}
              <span className="font-semibold">
                {shortenAddress(account.address.toString())}
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDisconnect}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors cursor-pointer"
              >
                Disconnect
              </button>
              <button
                onClick={() => setIsDisconnectModalOpen(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectWalletButton;
