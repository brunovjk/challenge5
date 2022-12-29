import React from "react";
import "./Web3.css";
import { useEffect, useState } from "react";
import {
  getProvider,
  connectAccount,
  disconnect,
  getWalletBalance,
  createAndAirdropWallet,
  transferSol,
} from "../functions";
import * as web3 from "@solana/web3.js";

import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

function Web3() {
  // create state variable for the provider
  const [provider, setProvider] = useState<PhantomProvider | undefined>(
    undefined
  );
  // create state variable for the created wallet key
  const [createdWallet, setCreatedWallet] = useState({
    account: undefined,
    publicKey: undefined,
    balance: undefined,
  });
  const [connectedWallet, setConnectedWallet] = useState<
    ConnectedWallet | undefined
  >();
  // create state variable for handling last transaction hash
  const [lastHash, setLastHash] = useState();
  // create state variable control loading button
  const [loading, setLoading] = useState({
    create: false,
    connect: false,
    disconnect: false,
    transfer: false,
  });
  // this is the function that runs whenever the component updates (e.g. render, refresh)
  useEffect(() => {
    const provider = getProvider();

    // if the phantom provider exists, set this as the provider
    if (provider) {
      setProvider(provider);
      provider.on("accountChanged", async () => {
        const balance: number | undefined = await getWalletBalance(
          provider.publicKey
        );
        if (balance !== undefined) {
          setConnectedWallet({
            publicKey: provider.publicKey,
            balance: balance,
          });
        }
      });
    } else setProvider(undefined);
  }, []);
  /**
   * @description prompts user to connect wallet if it exists.
   * This function is called when the connect wallet button is clicked
   */
  const connectWallet = async () => {
    setLoading({ ...loading, connect: true });
    try {
      const publicKey: web3.PublicKey | undefined = await connectAccount();
      if (publicKey !== undefined) {
        const balance = await getWalletBalance(publicKey);
        setConnectedWallet({
          publicKey: publicKey,
          balance: balance,
        });
      }
    } catch (err) {
      alert(err);
      console.log("Connect error:", err);
      // { code: 4001, message: 'User rejected the request.' }
    }
    setLoading({ ...loading, connect: false });
  };
  /**
   * @description prompts user to disconnect wallet if connected.
   * This function is called when the disconnect wallet button is clicked
   */
  const disconnectWallet = async () => {
    setLoading({ ...loading, disconnect: true });

    try {
      await disconnect();
      setConnectedWallet({
        publicKey: undefined,
        balance: undefined,
      });
    } catch (err) {
      alert(err);
      console.log("Disconnect error:", err);
      // { code: 4001, message: 'User rejected the request.' }
    }
    setLoading({ ...loading, disconnect: false });
  };
  /**
   * @description prompts user to disconnect wallet if connected.
   * This function is called when the Create new wallet button is clicked
   */
  const createWallet = async () => {
    setLoading({ ...loading, create: true });

    try {
      const [wallet, publicKey, airdropHash] = await createAndAirdropWallet();
      const balance = await getWalletBalance(publicKey);
      setLastHash(airdropHash);
      setCreatedWallet({
        account: wallet,
        publicKey: publicKey,
        balance: balance,
      });
    } catch (err) {
      alert(err);
      console.log("Disconnect error:", err);
      // { code: 4001, message: 'User rejected the request.' }
    }
    setLoading({ ...loading, create: false });
  };
  /**
   * @description prompts user to disconnect wallet if connected.
   * This function is called when the Create new wallet button is clicked
   */
  const transferCreatedToConnected = async () => {
    setLoading({ ...loading, transfer: true });

    if (
      createdWallet.account !== undefined &&
      connectedWallet?.publicKey !== undefined &&
      createdWallet.publicKey !== undefined &&
      createdWallet.balance !== undefined &&
      createdWallet.balance > 0
    ) {
      try {
        const transferHash = await transferSol(
          (await getWalletBalance(createdWallet.publicKey)) / 2, // amount
          createdWallet.account, // from
          connectedWallet.publicKey // to
        );
        setLastHash(transferHash);
        setCreatedWallet({
          ...createdWallet,
          balance: await getWalletBalance(createdWallet.publicKey),
        });
        setConnectedWallet({
          ...connectedWallet,
          balance: await getWalletBalance(connectedWallet.publicKey),
        });
      } catch (err) {
        alert(err);
        console.log("Disconnect error:", err);
        // { code: 4001, message: 'User rejected the request.' }
      }
    }

    setLoading({ ...loading, transfer: false });
  };
  // HTML code for the app
  return (
    <div>
      {/*
       * Created Wallet Component
       */}
      <div className="Component">
        <div className="Address Component">
          {createdWallet.publicKey !== undefined
            ? createdWallet.publicKey
            : "----"}
        </div>
        <div className="BalanceAndButton Component">
          <div className="Balance marginInline">
            <div className="Balance-number">
              {createdWallet.balance !== undefined
                ? createdWallet.balance
                : "--"}{" "}
              SOL
            </div>
            <div className="Balance subtitle">Balance</div>
          </div>
          <button
            className={`Button marginInline ${loading.create && "disabled"}`}
            onClick={createWallet}
          >
            {!loading.create ? "Create a new Solana account" : "Creating..."}
          </button>
        </div>
      </div>
      {/*
       * Connected Wallet Component
       */}
      <div className="Component">
        {provider ? (
          <>
            <div className="Address Component">
              {connectedWallet?.publicKey !== undefined
                ? connectedWallet.publicKey.toString()
                : "----"}
            </div>

            <div className="BalanceAndButton Component ">
              <div className="Balance marginInline">
                <div className="Balance-number">
                  {connectedWallet?.balance !== undefined
                    ? connectedWallet.balance.toString()
                    : "--"}{" "}
                  SOL
                </div>
                <div className="Balance subtitle">Balance</div>
              </div>
              {connectedWallet?.publicKey !== undefined ? (
                <button
                  className={`Button marginInline ${
                    loading.disconnect && "disabled"
                  }`}
                  onClick={disconnectWallet}
                >
                  {!loading.disconnect
                    ? "Disconnect Wallet"
                    : "Disconnecting..."}
                </button>
              ) : (
                <button
                  className={`Button marginInline ${
                    loading.connect && "disabled"
                  }`}
                  onClick={connectWallet}
                >
                  {!loading.connect
                    ? "Connect to Phantom Wallet"
                    : "Connecting..."}
                </button>
              )}
            </div>
          </>
        ) : (
          <p>
            No provider found. Install{" "}
            <a href="https://phantom.app/">Phantom Browser extension</a>
          </p>
        )}
      </div>
      {/*
       * Transfer Button
       */}
      <div className="Component">
        <button
          className={`Button ${
            (connectedWallet?.publicKey === undefined ||
              createdWallet.account === undefined ||
              createdWallet.balance === undefined ||
              createdWallet.balance === 0 ||
              loading.transfer) &&
            "disabled"
          }`}
          onClick={transferCreatedToConnected}
        >
          {!loading.transfer
            ? "Transfer 1/2 Created Wallet`s balance to Connected Wallet"
            : "Transfering..."}
        </button>
      </div>
      {/*
       * Last Hash Component
       */}
      <div className="Component">
        <div className="Hash-title subtitleLarge">Last Transaction Hash</div>
        <div className="Hash-number wrap Component ">
          <div className="marginInline">{lastHash ? lastHash : "----"}</div>
        </div>
      </div>
    </div>
  );
}

export default Web3;
