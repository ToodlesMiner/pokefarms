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
  const rawBalance = await tokenContract.balanceOf(walletAddress);
  const formattedBalance = (Number(rawBalance) / 1e18).toFixed(0);

  return Number(formattedBalance);
};

export default getTokenBalance;
