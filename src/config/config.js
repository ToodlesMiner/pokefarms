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
      name: "Farm 1",
      tokenA: "0xTokenAAddress1",
      tokenB: "0xTokenBAddress1",
      trainerContract: "0xTrainerContract1",
      pool0: "0xPool0Address1",
      pool1: "0xPool1Address1",
      pool2: "0xPool2Address1",
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
  