import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import {
  Aptos,
  AptosConfig,
  Network,
  NetworkToNetworkName,
} from "@aptos-labs/ts-sdk";
import { ACCOUNT, MODULE_NAME } from "../utils/constants";

const APTOS_NETWORK: Network = NetworkToNetworkName[Network.DEVNET];
const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);
export const getUserBalance = async (
  account: any,
  token: string
): Promise<number> => {
  let userBalance = 0;

  token;
  account;

  return userBalance;
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
