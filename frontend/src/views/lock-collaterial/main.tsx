import { useEffect, useState } from "react";
import { tokens } from "../../utils/constants";
import TokenDropdown from "../../components/TokenDropdown";
import NumberInput from "../../components/NumberInput";
import SubmitButton from "../../components/SubmitButton";
import { useWallet } from "../../context/WalletContext";
import {
  getUserBalance,
  lockCollateral,
} from "../../services/blockchain.services";
import { toast } from "react-toastify";

interface Token {
  name: string;
  address: string;
  image: string;
}

export default function LockCollaterial() {
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState<Token>(tokens[0]);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState("");
  const { account } = useWallet();

  useEffect(() => {
    (async () => {
      if (!account) return;
      const balance = await getUserBalance(account, selectedToken.address);

      if (typeof balance === "undefined") {
        return;
      }
      setBalance(balance.toString());
    })();
  }, [account, selectedToken, loading]);

  const handlePayLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!account) {
        toast.error("Please connect your wallet");
        return;
      }
      await lockCollateral({
        token: selectedToken.address,
        amount: +amount,
        account: account,
      });
      toast.success("Collateral locked successfully");
    } catch (error) {
      console.error("Error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Lock Collaterial</h2>
        <form onSubmit={handlePayLoan} className="space-y-4">
          <TokenDropdown
            label="Token"
            tokens={tokens}
            selectedToken={selectedToken}
            setSelectedToken={setSelectedToken}
            balance={balance}
          />
          <NumberInput
            label="Amount"
            placeholder="1000"
            defaultValue={amount}
            onChange={(value) => setAmount(value)}
          />
          <SubmitButton isSubmitting={loading} />
        </form>
      </div>
    </>
  );
}
