import Nav from "../nav/Nav";
import stl from "./Home.module.css";
import { useEffect, useState } from "react";
import { IoLayersOutline } from "react-icons/io5";
import { GiMiner } from "react-icons/gi";
import Mint from "./mint/Mint";
import Stake from "./stake/Stake";
import ChooseFarm from "./choosefarm/ChooseFarm";

const poolData = [
  {
    contractName: "Blastoise-Squirtle",
    parentContract: "0x09a454D9cfA1602F658b000d7e10d715D4A8D857",
    mainToken: "0x8b87e80f234b9b78b7d2e477fa41734bfb4871f3", // Blastoise
    lpToken: "0xcfe221ebc120c1f4e78f82a1f2f4762dd7d269d0", // Squirtle
    dexImgUrl:
      "https://dd.dexscreener.com/ds-data/tokens/pulsechain/0x31a4ffe71bfeadbda769d4a3e03bf4ae5c28ee31.png?size=lg&key=19ffe5",
  },
  {
    contractName: "Blastoise-Squirtle",
    parentContract: "0x09a454D9cfA1602F658b000d7e10d715D4A8D857",
    mainToken: "0x8b87e80f234b9b78b7d2e477fa41734bfb4871f3", // Blastoise
    lpToken: "0xcfe221ebc120c1f4e78f82a1f2f4762dd7d269d0", // Squirtle
    dexImgUrl:
      "https://dd.dexscreener.com/ds-data/tokens/pulsechain/0x31a4ffe71bfeadbda769d4a3e03bf4ae5c28ee31.png?size=lg&key=19ffe5",
  },
];

const Home = () => {
  const [pool, setPool] = useState(poolData[0]);
  const [selectingFarm, setSelectingFarm] = useState(true);

  const [activeMenu, setActiveMenu] = useState("Mint");
  const [mainToken, setMainToken] = useState({});
  const [lpToken, setLPToken] = useState({});

  //Initialize app
  useEffect(() => {
    const priceFetcher = async () => {
      const request = await fetch(
        "https://api.dexscreener.com/latest/dex/pairs/pulsechain/0x8b87e80f234b9b78b7d2e477fa41734bfb4871f3"
      );
      const response = await request.json();
      console.log(response.pairs[0]);
      setMainToken(response.pairs[0]);
      const request2 = await fetch(
        "https://api.dexscreener.com/latest/dex/pairs/pulsechain/0xcfe221ebc120c1f4e78f82a1f2f4762dd7d269d0"
      );
      const response2 = await request2.json();
      setLPToken(response2.pairs[0]);
    };
    priceFetcher();
  }, []);

  return (
    <div className={stl.home}>
      <Nav />
      <img src="../Logo.png" alt="Mainlogo" className={stl.mainLogo} />
      {selectingFarm && (
        <ChooseFarm
          poolData={poolData}
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
              mainToken={mainToken}
              lpToken={lpToken}
              setSelectingFarm={setSelectingFarm}
            />
          )}
          {activeMenu === "Stake" && <Stake />}
          <img
            src="../BLASTOISE.webp"
            alt="Blast"
            className={stl.blastCorner}
          />
        </div>
        {/* <iframe
          className={stl.frame}
          src="https://dex.9mm.pro/?chain=pulsechain"
          title="DEX on PulseChain"
        ></iframe> */}
      </div>
      <img src="../bg.png" alt="Forrest" className={stl.forrestBG} />
    </div>
  );
};

export default Home;
