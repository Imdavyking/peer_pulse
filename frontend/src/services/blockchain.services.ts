import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import {
  Aptos,
  AptosConfig,
  Network,
  NetworkToNetworkName,
} from "@aptos-labs/ts-sdk";
import { ACCOUNT, ACCOUNT_ADDR, MODULE_NAME, tokens } from "../utils/constants";
import { AccountInfo } from "@aptos-labs/wallet-adapter-core";

const APTOS_NETWORK: Network = NetworkToNetworkName[Network.DEVNET];
const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);
export const getUserBalance = async (
  account: AccountInfo,
  token: string
): Promise<number> => {
  if (token == tokens[0].address) {
    const isRegistered = await aptos
      .getAccountResource({
        accountAddress: account.address,
        resourceType: `0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>`,
      })
      .catch(() => null);

    if (!isRegistered) {
      return 0; // Account not registered for the token, return 0 balance
    }

    const balance = await aptos.getAccountCoinAmount({
      accountAddress: account.address,
      coinType: "0x1::aptos_coin::AptosCoin",
    });
    return balance;
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
    functionArguments: [ACCOUNT_ADDR, lender, token],
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
    functionArguments: [ACCOUNT_ADDR, borrower, token],
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
    functionArguments: [ACCOUNT_ADDR, borrower, token],
  };
  const output = await aptos.view({ payload });
  return (output[0]?.toString() ?? "0").toString();
};
