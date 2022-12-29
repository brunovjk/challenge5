import * as web3 from "@solana/web3.js";
import { buildCreateMintTransaction } from "./mintTokenTransactions";
import { sendTxUsingExternalSignature } from "./sendTxUsingExternalSignature";
/**
 * @description  Create Mint Account
 */
export const createMintAccount = async (
  publicKey: any
): Promise<web3.PublicKey> => {
  const connection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "confirmed"
  );
  try {
    const createdMint: CreatedAccount = await buildCreateMintTransaction(
      connection,
      new web3.PublicKey(publicKey),
      9
    );

    await sendTxUsingExternalSignature(createdMint.transaction);
    console.log(
      `Mint Account: https://solscan.io/token/${createdMint.publicKey}?cluster=devnet`
    );
    return createdMint.publicKey;
  } catch (error: any) {
    return error;
  }
};
