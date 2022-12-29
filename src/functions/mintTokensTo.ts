import * as web3 from "@solana/web3.js";
import { buildMintToTransaction } from "./mintTokenTransactions";
import { sendTxUsingExternalSignature } from "./sendTxUsingExternalSignature";
/**
 * @description  Create Mint Account
 */
export const mintTokensTo = async (
  authority: web3.PublicKey,
  payer: web3.PublicKey,
  mintAccount: web3.PublicKey,
  amount: number,
  destination: web3.PublicKey
): Promise<web3.Transaction> => {
  const connection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "confirmed"
  );
  try {
    const createdMint: web3.Transaction = await buildMintToTransaction(
      connection,
      authority,
      mintAccount,
      amount,
      destination
    );

    const signature = await sendTxUsingExternalSignature(createdMint);
    console.log(
      `Minted tokens hash: https://solscan.io/tx/${signature}?cluster=devnet`
    );
    return signature;
  } catch (error: any) {
    return error;
  }
};
