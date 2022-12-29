import * as web3 from "@solana/web3.js";
import { buildCreateAssociatedTokenAccountTransaction } from "./mintTokenTransactions";
import { sendTxUsingExternalSignature } from "./sendTxUsingExternalSignature";
/**
 * @description  Create Mint Account
 */
export const createAssociatedTokenAccount = async (
  connectedWallet: web3.PublicKey,
  mint: web3.PublicKey
): Promise<web3.PublicKey> => {
  const connection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "confirmed"
  );
  try {
    const createdAssociatedAccount: CreatedAccount =
      await buildCreateAssociatedTokenAccountTransaction(
        connection,
        connectedWallet,
        mint
      );

    await sendTxUsingExternalSignature(createdAssociatedAccount.transaction);
    console.log(
      `Token Account: https://solscan.io/token/${createdAssociatedAccount.publicKey}?cluster=devnet`
    );
    return createdAssociatedAccount.publicKey;
  } catch (error: any) {
    return error;
  }
};
