import * as web3 from "@solana/web3.js";
// import { updateMetada } from "./mintTokenTransactions";
import { sendTxUsingExternalSignature } from "./sendTxUsingExternalSignature";
/**
 * @description  Create Mint Account
 */
export const updateMintAccount = async (
  updateAuthority: string
): Promise<web3.Transaction | undefined> => {
  try {
    // const updateMintAccount_tx: web3.Transaction = await updateMetada(
    //   new web3.PublicKey(updateAuthority)
    // );
    // const tx_hash = await sendTxUsingExternalSignature(updateMintAccount_tx);
    // console.log(
    //   `Mint Account: https://solscan.io/tx/${tx_hash}?cluster=devnet`
    // );
    // return tx_hash;
  } catch (error) {
    return undefined;
  }
};
