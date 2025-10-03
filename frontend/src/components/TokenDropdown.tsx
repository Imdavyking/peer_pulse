import React from "react";

interface Token {
  name: string;
  address: string;
  image: string;
}

interface TokenDropdownProps {
  label?: string;
  tokens: Token[];
  selectedToken: Token;
  setSelectedToken: (token: Token) => void;
  balance: string; // 🔹 Add this
}

const TokenDropdown: React.FC<TokenDropdownProps> = ({
  label = "Select Token",
  tokens,
  selectedToken,
  setSelectedToken,
  balance, // 🔹 Destructure from props
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        onChange={(e) =>
          setSelectedToken(tokens.find((t) => t.address === e.target.value)!)
        }
        value={selectedToken.address}
        className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-500"
      >
        {tokens.map((token) => (
          <option key={token.address} value={token.address}>
            {token.name}
          </option>
        ))}
      </select>

      <div className="flex items-center mt-2 gap-2">
        <span className="text-sm text-gray-600">{balance}</span>
        <img
          src={selectedToken.image}
          alt={selectedToken.name}
          className="w-6 h-6"
        />
      </div>
    </div>
  );
};

export default TokenDropdown;
