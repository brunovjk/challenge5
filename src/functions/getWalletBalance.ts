import {
  Connection,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
/**
 * @description  Get the wallet balance from a given public key
 */
export const getWalletBalance = async (PUBLIC_KEY: PublicKey) => {
  // Connect to the Devnet
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  try {
    // Request wallet balance
    const walletBalance = await connection.getBalance(
      new PublicKey(PUBLIC_KEY)
    );
    const walletBalancePerSol =
      parseInt(walletBalance.toString()) / LAMPORTS_PER_SOL;

    return walletBalancePerSol;
  } catch (err: any) {
    alert(err);
    console.log(err);
    return err;
  }
};
