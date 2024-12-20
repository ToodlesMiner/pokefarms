import { NETWORKS, FARMS_CONFIG } from "../../utils/config";
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

const initContract = new ethers.Contract(
  FARMS_CONFIG[0].trainerContract,
  masterABI,
  new ethers.JsonRpcProvider(NETWORKS[0].rpcUrl)
);

const Home = () => {
  const [pool, setPool] = useState(FARMS_CONFIG[0]); // Default Blastoise - Squirtle
  const [currentNetwork, setCurrentNetwork] = useState(NETWORKS[0]); // Default Mainnet
  const [selectingFarm, setSelectingFarm] = useState(false);
  const [contract, setContract] = useState(initContract);
  const [user, setUser] = useState("");
  const [activeMenu, setActiveMenu] = useState("Mint");
  const [pairA, setpairA] = useState({});
  const [pairB, setpairB] = useState({});
  const [mintRatio, setMintRatio] = useState(null);
  const [marketRatio, setmarketRatio] = useState(null);

  // Initialize network & contract
  useEffect(() => {
    if (!window.ethereum) return;
    const chainInit = async () => {
      const chainId = Number(
        await window.ethereum.request({
          method: "eth_chainId",
        })
      );

      // Testnet
      if (chainId === 943) {
        setCurrentNetwork(NETWORKS[1]);
      } else {
        // Mainnet
        setCurrentNetwork(NETWORKS[0]);
      }
    };

    chainInit();
  }, []);

  // Update contract intance on network change
  useEffect(() => {
    const newContract = new ethers.Contract(
      pool.trainerContract,
      masterABI,
      new ethers.JsonRpcProvider(currentNetwork.rpcUrl)
    );

    setContract(newContract);
  }, [currentNetwork]);

  const mintCostConversion = (pool, emission) => {
    const poolName = pool.contractName;

    if (poolName === "Blastoise-Squirtle") {
      return Number(emission.toString().slice(0, 3)); // Truncate to 8 digits for Squirtle-Wartortle
    }
    if (poolName === "Squirtle-Wartortle") {
      return Number("0.00" + emission.toString().slice(0, 4)); // Truncate to 8 digits for Squirtle-Wartortle
    }
  };

  //Initialize app
  useEffect(() => {
    const initialize = async () => {
      const emission = Number(await contract.calculateRatio());
      const mintingCost = mintCostConversion(pool, emission);
      console.log(mintingCost);
      setMintRatio(mintingCost);

      // Token A
      const pairArequest = await fetch(
        `https://api.dexscreener.com/latest/dex/pairs/pulsechain/${pool.LP0}`
      );
      const pairAresponse = await pairArequest.json();
      setpairA(pairAresponse.pairs[0]);

      // Token B
      const pairBrequest = await fetch(
        `https://api.dexscreener.com/latest/dex/pairs/pulsechain/${pool.LP1}`
      );
      const pairBresponse = await pairBrequest.json();
      setpairB(pairBresponse.pairs[0]);

      const ratioRequest = await fetch(
        `https://api.dexscreener.com/latest/dex/pairs/pulsechain/${pool.LP2}`
      );
      const ratioResponse = await ratioRequest.json();
      setmarketRatio(ratioResponse.pairs[0].priceNative);
    };
    initialize();
  }, [pool, contract]);

  return (
    <div className={stl.home}>
      <Nav
        user={user}
        setUser={setUser}
        currentNetwork={currentNetwork}
        pool={pool}
        setSelectingFarm={setSelectingFarm}
      />
      <img src="../Logo.png" alt="Mainlogo" className={stl.mainLogo} />
      {selectingFarm && (
        <ChooseFarm
          poolData={FARMS_CONFIG}
          setSelectingFarm={setSelectingFarm}
          setPool={setPool}
          setContract={setContract}
          currentNetwork={currentNetwork}
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
              pairA={pairA}
              pairB={pairB}
              pool={pool}
              setSelectingFarm={setSelectingFarm}
              mintRatio={mintRatio}
              contract={contract}
              user={user}
              marketRatio={marketRatio}
              setUser={setUser}
              currentNetwork={currentNetwork}
            />
          )}
          {activeMenu === "Stake" && (
            <Stake
              pairA={pairA}
              pairB={pairB}
              pool={pool}
              user={user}
              contract={contract}
              setUser={setUser}
              currentNetwork={currentNetwork}
            />
          )}
        </div>
      </div>

      <img src="../bg.png" alt="Forrest" className={stl.forrestBG} />
    </div>
  );
};

export default Home;
