import CONFIG, { farmsConfig } from "../../utils/config.js";
import Nav from "../nav/Nav";
import stl from "./Home.module.css";
import { useEffect, useState } from "react";
import { IoLayersOutline } from "react-icons/io5";
import { GiMiner } from "react-icons/gi";
import Mint from "./mint/Mint";
import Stake from "./stake/Stake";
import ChooseFarm from "./choosefarm/ChooseFarm";
import { ethers } from "ethers";
import { masterABI } from "../../utils/MasterABI";

const Home = () => {
  const [pool, setPool] = useState(farmsConfig[0]);
  const [selectingFarm, setSelectingFarm] = useState(false);
  const [user, setUser] = useState("");
  const [activeMenu, setActiveMenu] = useState("Mint");
  const [PairA, setPairA] = useState({});
  const [PairB, setPairB] = useState({});
  const [emissionRate, setEmissionRate] = useState(null);
  const [conversionRate, setConversionRate] = useState(null);
  const [network, setNetwork] = useState(null);

  // Function to detect the network and load corresponding contracts
  const detectNetwork = async () => {
    const provider = new ethers.JsonRpcProvider(CONFIG.mainnet.rpcUrl);
    const networkDetails = await provider.getNetwork();
    console.log("Detected Network:", JSON.stringify(networkDetails, null, 2));


    const isMainnet = networkDetails.chainId === Number(CONFIG.mainnet.chainId);
    const isTestnet = networkDetails.chainId === Number(CONFIG.testnet.chainId);

    if (isMainnet) {
      setNetwork("Mainnet");
      setPool(farmsConfig.find((farm) => farm.id === CONFIG.mainnet.chainId));
    } else if (isTestnet) {
      setNetwork("Testnet");
      setPool(farmsConfig.find((farm) => farm.id === CONFIG.testnet.chainId));
    } else {
      console.warn("Unknown network. Defaulting to Mainnet.");
      setNetwork("Unknown");
      setPool(farmsConfig[0]); // Default to the first pool
    }
  };

  useEffect(() => {
    detectNetwork();
  }, []);

  const contract = new ethers.Contract(
    pool.trainerContract,
    masterABI,
    new ethers.JsonRpcProvider(
      network === "Mainnet"
        ? CONFIG.mainnet.rpcUrl
        : CONFIG.testnet.rpcUrl
    )
  );

  // Initialize app
  useEffect(() => {
    const initialize = async () => {
      if (!network) return;

      try {
        const emission = Number(await contract.calculateRatio());
        const truncEmission = +emission.toString().slice(0, 3);
        setEmissionRate(truncEmission);

        // Token A
        const LP0Request = await fetch(
          `https://api.dexscreener.com/latest/dex/pairs/pulsechain/${pool.LP0}`
        );
        const LP0Response = await LP0Request.json();
        setPairA(LP0Response.pairs[0]);

        // Token B
        const LP1Request = await fetch(
          `https://api.dexscreener.com/latest/dex/pairs/pulsechain/${pool.LP1}`
        );
        const LP1Response = await LP1Request.json();
        setPairB(LP1Response.pairs[0]);

        const tokenAPrice = +LP0Response.pairs[0].priceUsd;
        const tokenBPrice = +LP1Response.pairs[0].priceUsd;
        setConversionRate(Math.floor(tokenAPrice / tokenBPrice));
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };

    initialize();
  }, [network]);

  useEffect(() => {
    console.log("LP0 Token:", PairA);
  }, [PairA]);

  return (
    <div className={stl.home}>
      <Nav user={user} setUser={setUser} />
      <img src="../Logo.png" alt="Mainlogo" className={stl.mainLogo} />
      {selectingFarm && (
        <ChooseFarm
          poolData={farmsConfig}
          setSelectingFarm={setSelectingFarm}
          setPool={setPool}
        />
      )}
      <div className={stl.mainApp}>
        <div className={stl.toggleBox}>
          <button
            className={activeMenu === "Mint" ? stl.activeButton : ""}
            onClick={() => setActiveMenu("Mint")}
          >
            <GiMiner className={stl.miner} />
            Mint
          </button>
          <button
            className={activeMenu === "Stake" ? stl.activeButton : ""}
            onClick={() => setActiveMenu("Stake")}
          >
            <IoLayersOutline className={stl.stake} />
            Stake
          </button>
        </div>
        <div className={stl.modal}>
          {activeMenu === "Mint" && (
            <Mint
              PairA={PairA}
              PairB={PairB}
              pool={pool}
              setSelectingFarm={setSelectingFarm}
              emissionRate={emissionRate}
              contract={contract}
              user={user}
              conversionRate={conversionRate}
              setUser={setUser}
            />
          )}
          {activeMenu === "Stake" && (
            <Stake
              PairA={PairA}
              PairB={PairB}
              pool={pool}
              user={user}
              contract={contract}
              setUser={setUser}
            />
          )}
        </div>
      </div>

      <img src="../bg.png" alt="Forrest" className={stl.forrestBG} />
    </div>
  );
};

export default Home;





// import CONFIG, { farmsConfig } from "../../config/config";
// import Nav from "../nav/Nav";
// import stl from "./Home.module.css";
// import { useEffect, useState } from "react";
// import { IoLayersOutline } from "react-icons/io5";
// import { GiMiner } from "react-icons/gi";
// import Mint from "./mint/Mint";
// import Stake from "./stake/Stake";
// import ChooseFarm from "./choosefarm/ChooseFarm";
// import { ethers } from "ethers";
// import { masterABI } from "../../utils/MasterABI";

// const Home = () => {
//   //const [pool, setPool] = useState(poolData[0]);
//   const [pool, setPool] = useState(farmsConfig[0]);
//   const [selectingFarm, setSelectingFarm] = useState(false);
//   const [user, setUser] = useState("");
//   const [activeMenu, setActiveMenu] = useState("Mint");
//   const [PairA, setPairA] = useState({});
//   const [PairB, setPairB] = useState({});
//   const [emissionRate, setEmissionRate] = useState(null);
//   const [conversionRate, setConversionRate] = useState(null);
//   const [network, setNetwork] = useState(null);

//   const contract = new ethers.Contract(
//     pool.trainerContract,
//     masterABI,
//     new ethers.JsonRpcProvider("https://rpc.pulsechain.com")
//   );

//   //Initialize app
//   useEffect(() => {
//     const initialize = async () => {
//       const emission = Number(await contract.calculateRatio());
//       const truncEmission = +emission.toString().slice(0, 3);
//       setEmissionRate(truncEmission);

//       // Token A
//       const LP0Request = await fetch(
//         `https://api.dexscreener.com/latest/dex/pairs/pulsechain/${pool.LP0}`
//       );
//       const LP0Response = await LP0Request.json();
//       console.log(LP0Response);
//       setPairA(LP0Response.pairs[0]);

//       // token B
//       const LP1Request = await fetch(
//         `https://api.dexscreener.com/latest/dex/pairs/pulsechain/${pool.LP1}`
//       );
//       const LP1Response = await LP1Request.json();
//       setPairB(LP1Response.pairs[0]);

//       const tokenAPrice = +LP0Response.pairs[0].priceUsd;
//       const tokenBPrice = +LP1Response.pairs[0].priceUsd;
//       console.log(tokenAPrice / tokenBPrice);
//       setConversionRate(Math.floor(tokenAPrice / tokenBPrice));
//     };
//     initialize();
//   }, []);

//   useEffect(() => {
//     console.log(PairA);
//   }, [PairA]);

//   return (
//     <div className={stl.home}>
//       <Nav user={user} setUser={setUser} />
//       <img src="../Logo.png" alt="Mainlogo" className={stl.mainLogo} />
//       {selectingFarm && (
//         <ChooseFarm
//           poolData={farmsConfig}
//           setSelectingFarm={setSelectingFarm}
//           setPool={setPool}
//         />
//       )}
//       <div className={stl.mainApp}>
//         <div className={stl.toggleBox}>
//           <button
//             className={activeMenu === "Mint" ? stl.activeButton : ""}
//             onClick={() => setActiveMenu("Mint")}
//           >
//             <GiMiner className={stl.miner} />
//             Mint
//           </button>
//           <button
//             className={activeMenu === "Stake" ? stl.activeButton : ""}
//             onClick={() => setActiveMenu("Stake")}
//           >
//             <IoLayersOutline className={stl.stake} />
//             Stake
//           </button>
//         </div>
//         <div className={stl.modal}>
//           {activeMenu === "Mint" && (
//             <Mint
//               PairA={PairA}
//               PairB={PairB}
//               pool={pool}
//               setSelectingFarm={setSelectingFarm}
//               emissionRate={emissionRate}
//               contract={contract}
//               user={user}
//               conversionRate={conversionRate}
//               setUser={setUser}
//             />
//           )}
//           {activeMenu === "Stake" && (
//             <Stake
//               PairA={PairA}
//               PairB={PairB}
//               pool={pool}
//               user={user}
//               contract={contract}
//               setUser={setUser}
//             />
//           )}
//           {/* <img
//             src="../Squirtlogo.webp"
//             alt="Blast"
//             className={stl.blastCorner}
//           /> */}
//         </div>
//         {/* <iframe
//           className={stl.frame}
//           src="https://dex.9mm.pro/?chain=pulsechain"
//           title="DEX on PulseChain"
//         ></iframe> */}
//       </div>

//       <img src="../bg.png" alt="Forrest" className={stl.forrestBG} />
//     </div>
//   );
// };

// export default Home;