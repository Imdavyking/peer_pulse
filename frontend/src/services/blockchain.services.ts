import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import {
  Aptos,
  AptosConfig,
  Network,
  NetworkToNetworkName,
} from "@aptos-labs/ts-sdk";
import { ACCOUNT, MODULE_NAME, tokens } from "../utils/constants";
import { AccountInfo } from "@aptos-labs/wallet-adapter-core";

const APTOS_NETWORK: Network = NetworkToNetworkName[Network.DEVNET];
const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);
export const getUserBalance = async (
  account: AccountInfo,
  token: string
): Promise<number> => {
  if (token == tokens[0].address) {
    try {
      const balance = await aptos.getBalance({
        accountAddress: account.address,
        asset: "0x1::aptos_coin::AptosCoin",
      });
      return balance / 10 ** 8;
    } catch (error) {
      return 0;
    }
  }

  return 0;
};

export const getLiquidity = async ({
  lender,
  token,
}: {
  lender: string;
  token: string;
}) => {
  const payload: InputViewFunctionData = {
    function: `${ACCOUNT}::${MODULE_NAME}::get_liquidity`,
    typeArguments: [],
    functionArguments: [lender, token],
  };
  const output = await aptos.view({ payload });
  return (output[0]?.toString() ?? "0").toString();
};

export const getCollaterial = async ({
  borrower,
  token,
}: {
  borrower: string;
  token: string;
}) => {
  const payload: InputViewFunctionData = {
    function: `${ACCOUNT}::${MODULE_NAME}::get_collateral`,
    typeArguments: [],
    functionArguments: [borrower, token],
  };
  const output = await aptos.view({ payload });
  return (output[0]?.toString() ?? "0").toString();
};
export const getDebt = async ({
  borrower,
  token,
}: {
  borrower: string;
  token: string;
}) => {
  const payload: InputViewFunctionData = {
    function: `${ACCOUNT}::${MODULE_NAME}::get_debt`,
    typeArguments: [],
    functionArguments: [borrower, token],
  };
  const output = await aptos.view({ payload });
  return (output[0]?.toString() ?? "0").toString();
};
