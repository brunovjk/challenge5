import * as web3 from "@solana/web3.js";
import { getProvider } from "./getProvider";

export const sendTxUsingExternalSignature = async (
  transaction: web3.Transaction
): Promise<web3.Transaction> => {
  const provider = getProvider();
  const connection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "confirmed"
  );

  // Sign and send transaction
  const { signature }: any = await provider?.signAndSendTransaction(
    transaction
  );
  // Latest blockhash (unique identifer of the block) of the cluster
  let latestBlockHash = await connection.getLatestBlockhash();

  // Confirm transaction using the last valid block height (refers to its time)
  // to check for transaction expiration
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: signature,
  });
  await connection.getSignatureStatus(signature);
  return signature;
};
