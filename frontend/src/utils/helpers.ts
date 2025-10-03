import { decodeAddress } from "@polkadot/util-crypto";
import { Binary } from "polkadot-api";
import { ss58Address } from "@polkadot-labs/hdkd-helpers";
import { ethers } from "ethers";
import { keccak256 } from "ethers";
const SS58_PREFIX = 42;

export function bigintToFixedSizeArray4(
  value: bigint
): [bigint, bigint, bigint, bigint] {
  const mask = (1n << 64n) - 1n;

  const part0 = value & mask;
  const part1 = (value >> 64n) & mask;
  const part2 = (value >> 128n) & mask;
  const part3 = (value >> 192n) & mask;

  return [part0, part1, part2, part3];
}

export function fixedSizeArray4ToBigint(
  arr: [bigint, bigint, bigint, bigint]
): bigint {
  return (
    (arr[0] & ((1n << 64n) - 1n)) |
    ((arr[1] & ((1n << 64n) - 1n)) << 64n) |
    ((arr[2] & ((1n << 64n) - 1n)) << 128n) |
    ((arr[3] & ((1n << 64n) - 1n)) << 192n)
  );
}

export const isHex = (str: string) => {
  return typeof str === "string" && /^0x[0-9a-fA-F]+$/.test(str);
};

export function ss58ToH160(accountSS58Address: string): Binary {
  // Decode the SS58 address to a Uint8Array public key
  const publicKey = decodeAddress(accountSS58Address);

  // Step 2: Hash with keccak256
  const hashed = keccak256(publicKey); // hex string (0x-prefixed, 64 chars)

  // Step 3: Take last 20 bytes (40 hex characters)
  const ethAddress = "0x" + hashed.slice(-40); // Ethereum H160 address

  console.log({ ethAddress });

  return new Binary(ethers.getBytes(ethAddress));
}

export function convertPublicKeyToSs58(publickey: Uint8Array) {
  return ss58Address(publickey, SS58_PREFIX);
}
