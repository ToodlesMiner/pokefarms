// config.js

export const CONFIG = {
  mainnet: {
    chainId: "369", // PulseChain Mainnet
    rpcUrl: "https://rpc.pulsechain.com",
  },
  testnet: {
    chainId: "943", // PulseChain Testnet
    rpcUrl: "https://rpc.v4.testnet.pulsechain.com",
  },
};

// Function to get the network based on the chain ID
export const getNetworkDetails = (chainId) => {
  if (chainId === CONFIG.mainnet.chainId) {
    return {
      name: "PulseChain Mainnet",
      rpcUrl: CONFIG.mainnet.rpcUrl,
    };
  } else if (chainId === CONFIG.testnet.chainId) {
    return {
      name: "PulseChain Testnet",
      rpcUrl: CONFIG.testnet.rpcUrl,
    };
  } else {
    return {
      name: "Unknown Network",
      rpcUrl: "",
    };
  }
};

// Example farm configurations (keep your existing farm configurations)
export const farmsConfig = [
  {
    id: 369,
    contractName: "Blastoise-Squirtle",
    tokenA: "0x31A4ffe71bFEADBDa769d4a3E03Bf4aE5c28EE31",
    tokenB: "0x44de2D9EB4f3CB4131287D5C76C88c275139DA57",
    trainerContract: "0x09a454D9cfA1602F658b000d7e10d715D4A8D857",
    LP0: "0x8b87e80f234B9B78b7d2E477fA41734BFB4871f3",
    LP1: "0xCFE221EBC120c1F4e78f82a1F2F4762DD7d269d0",
    LP2: "0x678de045552Fe88a9851fef48e52240C9e924690",
    dexTokenAImgUrl:
      "https://dd.dexscreener.com/ds-data/tokens/pulsechain/0x31A4ffe71bFEADBDa769d4a3E03Bf4aE5c28EE31.png?size=lg&key=19ffe5",
    dexTokenBImgUrl:
      "https://dd.dexscreener.com/ds-data/tokens/pulsechain/0x44de2d9eb4f3cb4131287d5c76c88c275139da57.png?size=lg&key=61cf87",
  },
  {
    id: 369,
    contractName: "Squirtle-Wartortle",
    tokenA: "0x44de2D9EB4f3CB4131287D5C76C88c275139DA57",
    tokenB: "0xeE9Dc6BD7058C823FD6c26FA3bE2b1a10471a293",
    trainerContract: "0xDBF6d72251869f47D8912Cb63Ba06f4c75e4F8A3",
    LP0: "0xCFE221EBC120c1F4e78f82a1F2F4762DD7d269d0",
    LP1: "0x706D506D9C22aeA107a46eFA7D7818cDc562b6F9",
    LP2: "0xe0989CB00ef99E26B94C702A769f0c248e8B2636",
    dexTokenAImgUrl:
      "https://dd.dexscreener.com/ds-data/tokens/pulsechain/0x44de2D9EB4f3CB4131287D5C76C88c275139DA57.png?size=lg&key=19ffe5",
    dexTokenBImgUrl:
      "https://dd.dexscreener.com/ds-data/tokens/pulsechain/0xeE9Dc6BD7058C823FD6c26FA3bE2b1a10471a293.png?size=lg&key=61cf87",
  },
  {
    id: 943,
    contractName: "Blastoise-Wartortle",
    tokenA: "0xD219e00d0bbf6bFB74009654BB6f51b1AC9d16C7",
    tokenB: "0xd47D188e308E7624C77a86352D43F49Bbe569931",
    trainerContract: "0xEFf44Bd01CAC819e8Ea31F1eE8ca6c52c58d1506",
    LP0: "0x9e742F08B56103349B35F27412A08528552D3017",
    LP1: "0x0AfBaD8b99Deab75b423AAD0808254bf943777b8",
    LP2: "0x594c4c0EC9E5982d786213429f28362Bc1eb8104",
    dexTokenAImgUrl:
      "https://dd.dexscreener.com/ds-data/tokens/pulsechain/0x31A4ffe71bFEADBDa769d4a3E03Bf4aE5c28EE31.png?size=lg&key=19ffe5",
    dexTokenBImgUrl:
      "https://dd.dexscreener.com/ds-data/tokens/pulsechain/0x44de2d9eb4f3cb4131287d5c76c88c275139da57.png?size=lg&key=61cf87",
  },
  // Add more farms as needed
];

export default CONFIG;
