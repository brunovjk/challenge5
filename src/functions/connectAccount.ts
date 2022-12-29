import * as web3 from "@solana/web3.js";
import { getProvider } from "./getProvider";
/**
 * @description Return user to connect wallet if it exists.
 */
export const connectAccount = async (): Promise<web3.PublicKey | undefined> => {
  try {
    const provider = getProvider();
    if (provider !== undefined) {
      const publicKey = await provider.connect();
      if (publicKey !== undefined) {
        console.log("Wallet connected:", publicKey.publicKey.toString());
        return publicKey.publicKey;
      }
      return undefined;
    }
  } catch (err) {
    alert(err);
    return undefined;
  }
};
