import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

/**
 * @description  Get the token balance from a given public key
 */
export const getTokenBalance = async (
  USER_PUBLIC_KEY: web3.PublicKey,
  TOKEN_ACCOUNT: web3.PublicKey
): Promise<number | undefined> => {
  // Connect to the Devnet
  const connection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "confirmed"
  );
  try {
    let balance: number = 0;
    const mintInfo: token.Mint = await token.getMint(connection, TOKEN_ACCOUNT);

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

      if (accountData.mint.toString() === mintInfo.address.toString())
        balance =
          balance + Number(accountData.amount) / 10 ** mintInfo.decimals;
    });

    return balance;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
