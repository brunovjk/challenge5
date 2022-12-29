import { getProvider } from "./getProvider";
/**
 * @description prompts user to disconnect wallet if connected.
 */
export const disconnect = async () => {
  const provider = getProvider();
  try {
    const response = await provider?.disconnect();
    return response;
  } catch (err) {
    alert(err);
    return err;
    // { code: 4001, message: 'User rejected the request.' }
  }
};
