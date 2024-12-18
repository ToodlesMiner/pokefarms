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
      mintingCost: (emission) => {
        const truncEmission = +emission.toString().slice(0, 3);  // Truncate to 8 digits for Squirtle-Wartortle
        return truncEmission;
      }
  },
  {
    contractName: "Squirtle-Wartortle",
  tokenA: {
    address: "0x44de2D9EB4f3CB4131287D5C76C88c275139DA57",
    name: "Squirtle",
  },
  tokenB: {
    address: "0xF830a25dbcf0A420C3c97e9ff1e353488a935645",
    name: "Wartortle",
  },
  trainerContract: "0xA761cF14cAC5D97ee9F9564A38e1e707F8cc7b4C",
  LP0: "0xCFE221EBC120c1F4e78f82a1F2F4762DD7d269d0",
  LP1: "0x01609637D9Fb1f39cEd2C6059fb2867f9dCD90A1",
  LP2: "0xCA68536810302bd9518860405c502a3D9E686c22",
  dexTokenAImgUrl:
    "https://dd.dexscreener.com/ds-data/tokens/pulsechain/0x44de2D9EB4f3CB4131287D5C76C88c275139DA57.png?size=lg&key=19ffe5",
  dexTokenBImgUrl:
    "../wartortle.png",

    mintingCost: (emission) => {
      const truncEmission = "0.0"+emission.toString().slice(0, 4);  // Truncate to 8 digits for Squirtle-Wartortle
      return truncEmission;
    }
  },
  // Add more farms as needed, may need to add difrent parms for tokens that have stronger ratios.
];
