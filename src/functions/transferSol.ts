import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
/**
 * @description  Trasnfer amount from "from" wallet and into "to" wallet
 */
export const transferSol = async (amount: any, from: any, to: any) => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  try {
    // Send SOL from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: new PublicKey(to),
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    // Sign transaction
    var signature = await sendAndConfirmTransaction(connection, transaction, [
      from,
    ]);
    return signature;
  } catch (error: any) {
    console.log(error);
    return error;
  }
};
