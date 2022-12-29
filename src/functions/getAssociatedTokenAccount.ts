import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

/**
 * @description  Get the token balance from a given public key
 */
export const getAssociatedTokenAccount = async (
  USER_PUBLIC_KEY: web3.PublicKey,
  MINT_ACCOUNT: web3.PublicKey
): Promise<web3.PublicKey | undefined> => {
  // Connect to the Devnet
  const connection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "confirmed"
  );
  try {
    const mintInfo: token.Mint = await token.getMint(connection, MINT_ACCOUNT);
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      USER_PUBLIC_KEY,
      {
        programId: token.TOKEN_PROGRAM_ID,
      }
    );

    tokenAccounts.value.forEach((tokenAccount) => {
      const accountData: token.RawAccount = token.AccountLayout.decode(
        tokenAccount.account.data
      );

      // if (accountData.mint.toString() === mintInfo.address.toString())
      console.log("Teste:", accountData);
    });

    return mintInfo.address;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
