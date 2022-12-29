import {
  Connection,
  PublicKey,
  Keypair,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

/**
 * @description  Create new wallet Keypair.generate()
 */
const createWallet = async () => {
  try {
    const wallet = Keypair.generate();
    console.log("Created account:", wallet.publicKey.toString());

    return [wallet, wallet.publicKey.toString()];
  } catch (err: any) {
    console.log(err);
    return err;
  }
};
/**
 * @description  airdrop two SOL wallet publicKey
 */
const airdropTwo = async (publicKey: string) => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  try {
    // Aidrop 2 SOL to Sender wallet
    const fromAirDropSignature = await connection.requestAirdrop(
      new PublicKey(publicKey),
      2 * LAMPORTS_PER_SOL
    );

    // Latest blockhash (unique identifer of the block) of the cluster
    let latestBlockHash = await connection.getLatestBlockhash();

    // Confirm transaction using the last valid block height (refers to its time)
    // to check for transaction expiration
    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: fromAirDropSignature,
    });

    console.log("Airdrop completed for the Sender account");
    return fromAirDropSignature;
  } catch (err: any) {
    alert(err);
    console.log(err);
  }
};
/**
 * @description  Create and airdrop two SOL created wallet
 */
export const createAndAirdropWallet = async () => {
  try {
    const [wallet, publicKey] = await createWallet();
    const airdropHash = await airdropTwo(wallet.publicKey);

    return [wallet, publicKey, airdropHash];
  } catch (err: any) {
    console.log(err);
    alert(err);
    return err;
  }
};
