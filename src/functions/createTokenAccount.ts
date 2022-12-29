import * as web3 from "@solana/web3.js";
import { buildCreateTokenAccountTransaction } from "./mintTokenTransactions";
import { sendTxUsingExternalSignature } from "./sendTxUsingExternalSignature";
/**
 * @description  Create Mint Account
 */
export const createTokenAccount = async (
  publicKey: string,
  mint: web3.PublicKey
): Promise<web3.PublicKey> => {
  const connection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "confirmed"
  );
  try {
    const createdMint: CreatedAccount =
      await buildCreateTokenAccountTransaction(
        connection,
        new web3.PublicKey(publicKey),
        mint
      );

    await sendTxUsingExternalSignature(createdMint.transaction);
    // console.log(
    //   `Token Account: https://solscan.io/token/${createdMint.publicKey}?cluster=devnet`
    // );
    return createdMint.publicKey;
  } catch (error: any) {
    return error;
  }
};
