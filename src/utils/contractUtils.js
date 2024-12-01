import { ethers } from "ethers";

// ERC20 ABI (Minimal, only includes totalSupply)
const ERC20_ABI = ["function totalSupply() view returns (uint256)"];

const tokenABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const getPoolBalance = async (contract, rpcUrl) => {
  try {
    const tokenContract = new ethers.Contract(
      contract,
      ERC20_ABI,
      new ethers.JsonRpcProvider(rpcUrl)
    );

    const rawSupply = await tokenContract.totalSupply();
    const totalSupply = +(Number(rawSupply) / 1e18).toFixed(0);
    return totalSupply;
  } catch (error) {
    console.error("Error fetching max supply:", error);
  }
};

const getTokenBalance = async (tokenAddress, walletAddress, rpcUrl) => {
  const tokenContract = new ethers.Contract(
    tokenAddress,
    tokenABI,
    new ethers.JsonRpcProvider(rpcUrl)
  );
  // Fetch balance and decimals
  const rawBalance = await tokenContract.balanceOf(walletAddress);

  const formattedBalance = Number((Number(rawBalance) / 1e18).toFixed(0));
  return formattedBalance || 0;
};

const getInnerPoolBalance = async (tokenAddress, targetAddress, rpcUrl) => {
  try {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ["function balanceOf(address owner) view returns (uint256)"],
      new ethers.JsonRpcProvider(rpcUrl)
    );

    // Fetch balance and decimals
    const rawBalance = await tokenContract.balanceOf(targetAddress);

    const formattedBalance = Number((Number(rawBalance) / 1e18).toFixed(0));
    return formattedBalance;
  } catch (err) {
    console.error(err);
  }
};

export { getPoolBalance, getTokenBalance, getInnerPoolBalance };
