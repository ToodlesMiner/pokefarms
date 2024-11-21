import { ethers } from "ethers";

const tokenABI = [
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
];

const getPoolBalance = async (tokenAddress, walletAddress) => {
  const tokenContract = new ethers.Contract(
    tokenAddress,
    tokenABI,
    new ethers.JsonRpcProvider("https://rpc.pulsechain.com")
  );
  const rawBalance = await tokenContract.balanceOf(walletAddress);
  const formattedBalance = (Number(rawBalance) / 1e18).toFixed(0);

  return Number(formattedBalance);
};

export default getPoolBalance;
