export const NETWORKS = [
  {
    chainId: "369", // Pulsechain Mainnet
    rpcUrl: "https://rpc.pulsechain.com",
  },
  {
    chainId: "943", // Pulsechain Testnet
    rpcUrl: "https://rpc.v4.testnet.pulsechain.com",
  },
];

export const FARMS_CONFIG = [
  {
    contractName: "Blastoise-Squirtle",
    tokenA: {
      address: "0x31A4ffe71bFEADBDa769d4a3E03Bf4aE5c28EE31",
      name: "Blastoise",
    },
    tokenB: {
      address: "0x44de2D9EB4f3CB4131287D5C76C88c275139DA57",
      name: "Squirtle",
    },
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
    contractName: "Squirtle-Wartortle",
  tokenA: {
    address: "0x44de2D9EB4f3CB4131287D5C76C88c275139DA57",
    name: "Squirtle",
  },
  tokenB: {
    address: "0xeE9Dc6BD7058C823FD6c26FA3bE2b1a10471a293",
    name: "Wartortle",
  },
  trainerContract: "0xDBF6d72251869f47D8912Cb63Ba06f4c75e4F8A3",
  LP0: "0xCFE221EBC120c1F4e78f82a1F2F4762DD7d269d0",
  LP1: "0x706D506D9C22aeA107a46eFA7D7818cDc562b6F9",
  LP2: "0xe0989CB00ef99E26B94C702A769f0c248e8B2636",
  dexTokenAImgUrl:
    "https://dd.dexscreener.com/ds-data/tokens/pulsechain/0x44de2D9EB4f3CB4131287D5C76C88c275139DA57.png?size=lg&key=19ffe5",
  dexTokenBImgUrl:
    "https://dd.dexscreener.com/ds-data/tokens/pulsechain/0xeE9Dc6BD7058C823FD6c26FA3bE2b1a10471a293.png?size=lg&key=19ffe5",
  },
  // Add more farms as needed
];
