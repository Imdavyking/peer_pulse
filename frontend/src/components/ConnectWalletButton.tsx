import { useWallet } from "@aptos-labs/wallet-adapter-react";

const ConnectWalletButton = () => {
  const { connect, disconnect, account, wallets } = useWallet();

  if (!account && wallets) {
    return (
      <div>
        {wallets.map((wallet) => (
          <button key={wallet.name} onClick={() => connect(wallet.name)}>
            Connect {wallet.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div>
      <p>Connected: {account ? account.address : "No wallet"}</p>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
};

export default ConnectWalletButton;
