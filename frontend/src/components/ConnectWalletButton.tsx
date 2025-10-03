import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const ConnectWalletButton = () => {
  const { connect, disconnect, account, wallets } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMainClick = () => {
    if (account) {
      disconnect();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleWalletClick = async (walletName: any) => {
    connect(walletName);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Main Button */}
      <button
        onClick={handleMainClick}
        className="px-5 py-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
      >
        {account ? "Disconnect Wallet" : "Connect Wallet"}
      </button>

      {/* Modal */}
      {isModalOpen && !account && (
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
                    className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium transition-colors"
                  >
                    {wallet.name}
                  </button>
                ))}
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-5 w-full px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectWalletButton;
