const CONFIG = {
    mainnet: {
      chainId: "369", // Pulsechain Mainnet
      rpcUrl: "https://rpc.pulsechain.com",
    },
    testnet: {
      chainId: "943", // Pulsechain Testnet
      rpcUrl: "https://rpc.v4.testnet.pulsechain.com",
    },
  };

  export const farmsConfig = [
    {
      id: 1,
      name: "Blastoise-Squirtle",
      tokenA: "0x31A4ffe71bFEADBDa769d4a3E03Bf4aE5c28EE31",
      tokenB: "0x44de2D9EB4f3CB4131287D5C76C88c275139DA57",
      trainerContract: "0x09a454D9cfA1602F658b000d7e10d715D4A8D857",
      pool0: "0x8b87e80f234B9B78b7d2E477fA41734BFB4871f3",
      pool1: "0xCFE221EBC120c1F4e78f82a1F2F4762DD7d269d0",
      pool2: "0x678de045552Fe88a9851fef48e52240C9e924690",
    },
    {
      id: 2,
      name: "Farm 2",
      tokenA: "0xTokenAAddress2",
      tokenB: "0xTokenBAddress2",
      trainerContract: "0xTrainerContract2",
      pool0: "0xPool0Address2",
      pool1: "0xPool1Address2",
      pool2: "0xPool2Address2",
    },
    // Add more farms as needed
  ];
  
  export default CONFIG;
  