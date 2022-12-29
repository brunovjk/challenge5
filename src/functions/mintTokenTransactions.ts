import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

/**
 * @description  transaction demo
 */
export async function transferDemo(
  connection: web3.Connection,
  from: web3.PublicKey,
  to: web3.PublicKey
): Promise<web3.Transaction> {
  var transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: from,
      toPubkey: to,
      lamports: 100000,
    })
  );
  // Setting the variables for the transaction
  transaction.feePayer = from;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash("max")
  ).blockhash;
  console.log(transaction);
  return transaction;
}
/**
 * @description  Create Mint Account transaction
 */
export async function buildCreateMintTransaction(
  connection: web3.Connection,
  payer: web3.PublicKey,
  decimals: number
): Promise<CreatedAccount> {
  const lamports = await token.getMinimumBalanceForRentExemptMint(connection);
  const accountKeypair = web3.Keypair.generate();
  const programId = token.TOKEN_PROGRAM_ID;

  let transaction = new web3.Transaction().add(
    web3.SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: accountKeypair.publicKey,
      space: token.MINT_SIZE,
      lamports,
      programId,
    }),
    token.createInitializeMintInstruction(
      accountKeypair.publicKey,
      decimals,
      payer,
      payer,
      programId
    )
  );
  // Setting the variables for the transaction
  transaction.feePayer = payer;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash("max")
  ).blockhash;
  transaction.partialSign(accountKeypair);
  const createdMint: CreatedAccount = {
    transaction: transaction,
    publicKey: accountKeypair.publicKey,
  };
  return createdMint;
}
/**
 * @description  Create Token Account transaction
 */
export async function buildCreateTokenAccountTransaction(
  connection: web3.Connection,
  payer: web3.PublicKey,
  mint: web3.PublicKey
): Promise<CreatedAccount> {
  const mintState = await token.getMint(connection, mint);
  const accountKeypair = await web3.Keypair.generate();
  const space = token.getAccountLenForMint(mintState);
  const lamports = await connection.getMinimumBalanceForRentExemption(space);
  const programId = token.TOKEN_PROGRAM_ID;

  let transaction = new web3.Transaction().add(
    web3.SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: accountKeypair.publicKey,
      space,
      lamports,
      programId,
    }),
    token.createInitializeAccountInstruction(
      accountKeypair.publicKey,
      mint,
      payer,
      programId
    )
  );

  // Setting the variables for the transaction
  transaction.feePayer = payer;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash("max")
  ).blockhash;
  transaction.partialSign(accountKeypair);
  const createdToken: CreatedAccount = {
    transaction: transaction,
    publicKey: accountKeypair.publicKey,
  };
  return createdToken;
}
/**
 * @description  Create Associated Token Account transaction
 */
export async function buildCreateAssociatedTokenAccountTransaction(
  connection: web3.Connection,
  payer: web3.PublicKey,
  mint: web3.PublicKey
): Promise<CreatedAccount> {
  const programId = token.TOKEN_PROGRAM_ID;

  const associatedTokenAddress = await token.getAssociatedTokenAddress(
    mint,
    payer,
    false,
    programId
  );

  let transaction = new web3.Transaction().add(
    token.createAssociatedTokenAccountInstruction(
      payer,
      associatedTokenAddress,
      payer,
      mint,
      programId
    )
  );

  // Setting the variables for the transaction
  transaction.feePayer = payer;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash("max")
  ).blockhash;
  const createdToken: CreatedAccount = {
    transaction: transaction,
    publicKey: associatedTokenAddress,
  };
  return createdToken;
}
/**
 * @description  Mint Tokens transaction
 */
export async function buildMintToTransaction(
  connection: web3.Connection,
  authority: web3.PublicKey,
  mint: web3.PublicKey,
  amount: number,
  destination: web3.PublicKey
): Promise<web3.Transaction> {
  let transaction = new web3.Transaction().add(
    token.createMintToInstruction(mint, destination, authority, amount)
  );

  // Setting the variables for the transaction
  transaction.feePayer = authority;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash("max")
  ).blockhash;
  return transaction;
}
/**
 * @description Transfer Tokens transaction
 */
export async function buildTransferTransaction(
  connection: web3.Connection,
  source: web3.PublicKey,
  destination: web3.PublicKey,
  owner: web3.PublicKey,
  amount: number
): Promise<web3.Transaction> {
  let transaction = new web3.Transaction().add(
    token.createTransferInstruction(source, destination, owner, amount)
  );

  // Setting the variables for the transaction
  transaction.feePayer = owner;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash("max")
  ).blockhash;
  return transaction;
}
/**
 * @description Burn Tokens transaction
 */
export async function buildBurnTransaction(
  account: web3.PublicKey,
  mint: web3.PublicKey,
  owner: web3.PublicKey,
  amount: number
): Promise<web3.Transaction> {
  const transaction = new web3.Transaction().add(
    token.createBurnInstruction(account, mint, owner, amount)
  );

  return transaction;
}
/**
 * @description Approve Delegate transaction
 */
export async function buildApproveTransaction(
  account: web3.PublicKey,
  delegate: web3.PublicKey,
  owner: web3.PublicKey,
  amount: number
): Promise<web3.Transaction> {
  const transaction = new web3.Transaction().add(
    token.createApproveInstruction(account, delegate, owner, amount)
  );

  return transaction;
}
/**
 * @description Revoke Delegate transaction
 */
export async function buildRevokeTransaction(
  account: web3.PublicKey,
  owner: web3.PublicKey
): Promise<web3.Transaction> {
  const transaction = new web3.Transaction().add(
    token.createRevokeInstruction(account, owner)
  );

  return transaction;
}
