import { ethers } from "ethers";

const tokenABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const getTokenBalance = async (tokenAddress, walletAddress) => {
  const tokenContract = new ethers.Contract(
    tokenAddress,
    tokenABI,
    new ethers.JsonRpcProvider("https://rpc.pulsechain.com")
  );
  // Fetch balance and decimals
  const rawBalance = await tokenContract.balanceOf(walletAddress);

  const formattedBalance = Number((Number(rawBalance) / 1e18).toFixed(0));
  return formattedBalance;
};

export default getTokenBalance;
