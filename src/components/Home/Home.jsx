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
  const [lp0Token, setLP0Token] = useState({});
  const [lp1Token, setLP1Token] = useState({});
  const [emissionRate, setEmissionRate] = useState(null);
  const [conversionRate, setConversionRate] = useState(null);

  // Initialize network & contract
  useEffect(() => {
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

  //Initialize app
  useEffect(() => {
    const initialize = async () => {
      const emission = Number(await contract.calculateRatio());
      const truncEmission = +emission.toString().slice(0, 3);
      setEmissionRate(truncEmission);

      // Token A
      const LP0Request = await fetch(
        `https://api.dexscreener.com/latest/dex/pairs/pulsechain/${pool.LP0}`
      );
      const LP0Response = await LP0Request.json();
      // console.log(LP0Response);
      setLP0Token(LP0Response.pairs[0]);

      // token B
      const LP1Request = await fetch(
        `https://api.dexscreener.com/latest/dex/pairs/pulsechain/${pool.LP1}`
      );
      const LP1Response = await LP1Request.json();
      setLP1Token(LP1Response.pairs[0]);

      const tokenAPrice = +LP0Response.pairs[0].priceUsd;
      const tokenBPrice = +LP1Response.pairs[0].priceUsd;
      setConversionRate(Math.floor(tokenAPrice / tokenBPrice));
    };
    initialize();
  }, [pool, contract]);

  return (
    <div className={stl.home}>
      <Nav user={user} setUser={setUser} currentNetwork={currentNetwork} />
      <img src="../Logo.png" alt="Mainlogo" className={stl.mainLogo} />
      {selectingFarm && (
        <ChooseFarm
          poolData={FARMS_CONFIG}
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
              lp0Token={lp0Token}
              lp1Token={lp1Token}
              pool={pool}
              setSelectingFarm={setSelectingFarm}
              emissionRate={emissionRate}
              contract={contract}
              user={user}
              conversionRate={conversionRate}
              setUser={setUser}
              currentNetwork={currentNetwork}
            />
          )}
          {activeMenu === "Stake" && (
            <Stake
              lp0Token={lp0Token}
              lp1Token={lp1Token}
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
