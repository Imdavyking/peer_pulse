import { useEffect, useState } from "react";
import { ACCOUNT, MODULE_NAME, tokens } from "../../utils/constants";
import { toast } from "react-toastify";
import { aptos, getUserBalance } from "../../services/blockchain.services";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

import SubmitButton from "../../components/SubmitButton";
import NumberInput from "../../components/NumberInput";
import TokenDropdown from "../../components/TokenDropdown";
export default function CreateLoan() {
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [creatingLoan, setCreatingLoan] = useState(false);
  const [balance, setBalance] = useState("");
  const { account, signAndSubmitTransaction } = useWallet();

  useEffect(() => {
    (async () => {
      if (!account) return;
      const balance = await getUserBalance(account, selectedToken.address);
      setBalance(balance.toString());
    })();
  }, [account, selectedToken, creatingLoan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!duration) {
      toast.error("Please enter a valid duration");
      return;
    }

    onSubmit({
      token: selectedToken.address,
      amount,
      duration,
    });
  };

  const onSubmit = async (data: {
    token: string;
    amount: string;
    duration: string;
  }) => {
    try {
      const { token, amount, duration } = data;
      if (!token) {
        toast.error("Please select a token");
        return;
      }
      setCreatingLoan(true);

      if (!account) {
        toast.error("Please connect your wallet");
        return;
      }

      const transactionResponse = await signAndSubmitTransaction({
        sender: account.address.toString(),
        data: {
          function: `${ACCOUNT}::${MODULE_NAME}::create_loan`,
          typeArguments: [],
          functionArguments: [
            token,
            Math.trunc(+amount * 10 ** 8),
            BigInt(Math.trunc(+duration * 86400)).toString(),
          ],
        },
      });

      await aptos.waitForTransaction({
        transactionHash: transactionResponse.hash,
      });

      toast.success("Loan offer created successfully!");
      setAmount("");
      setDuration("");
    } catch (error) {
      console.error("Error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred");
      }
    } finally {
      setCreatingLoan(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Create Loan Offer</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Token Dropdown */}

        <TokenDropdown
          label="Loan Token"
          tokens={tokens}
          selectedToken={selectedToken}
          setSelectedToken={(token) => {
            setSelectedToken(token);
          }}
          balance={balance}
        />

        <NumberInput
          defaultValue={duration}
          label="Duration(days)"
          placeholder="Enter Duration in days"
          onChange={setDuration}
        />
        <NumberInput
          defaultValue={amount}
          onChange={setAmount}
          label="Amount"
          placeholder="Enter Amount"
        />
        <SubmitButton isSubmitting={creatingLoan} />
      </form>
    </div>
  );
}
