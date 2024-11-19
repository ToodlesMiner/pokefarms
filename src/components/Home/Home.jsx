import Nav from "../nav/Nav";
import stl from "./Home.module.css";
import { useEffect, useState } from "react";
import { IoLayersOutline } from "react-icons/io5";
import { GiMiner } from "react-icons/gi";
import Mint from "./mint/Mint";
import Stake from "./stake/Stake";

const Home = () => {
  const [activeMenu, setActiveMenu] = useState("Mint");
  const [blastoiseData, setBlastoiseData] = useState({});
  const [squirtleData, setSquirtleData] = useState({});

  useEffect(() => {
    const priceFetcher = async () => {
      const request = await fetch(
        "https://api.dexscreener.com/latest/dex/pairs/pulsechain/0x8b87e80f234b9b78b7d2e477fa41734bfb4871f3"
      );
      const response = await request.json();
      console.log(response.pairs[0]);
      setBlastoiseData(response.pairs[0]);
      const request2 = await fetch(
        "https://api.dexscreener.com/latest/dex/pairs/pulsechain/0xcfe221ebc120c1f4e78f82a1f2f4762dd7d269d0"
      );
      const response2 = await request2.json();
      setSquirtleData(response2.pairs[0]);
    };
    priceFetcher();
  }, []);

  return (
    <div className={stl.home}>
      <Nav />
      <img src="../Logo.png" alt="Mainlogo" className={stl.mainLogo} />

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
            <Mint blastoiseData={blastoiseData} squirtleData={squirtleData} />
          )}
          {activeMenu === "Stake" && <Stake />}
          <img
            src="../Blastoise.webp"
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
