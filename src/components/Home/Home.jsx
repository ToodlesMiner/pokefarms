import Nav from "../nav/Nav";
import stl from "./Home.module.css";
import { useState } from "react";
import { IoLayersOutline } from "react-icons/io5";
import { GiMiner } from "react-icons/gi";
import Mint from "./mint/Mint";
import Stake from "./stake/Stake";

const Home = () => {
  const [activeMenu, setActiveMenu] = useState("Mint");
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
          {activeMenu === "Mint" && <Mint />}
          {activeMenu === "Stake" && <Stake />}
          <img
            src="../Blastoise.webp"
            alt="Blast"
            className={stl.blastCorner}
          />
        </div>
        <iframe
          className={stl.frame}
          src="https://dex.9mm.pro/?chain=pulsechain"
          title="DEX on PulseChain"
        ></iframe>
      </div>
      <img src="../bg.png" alt="Forrest" className={stl.forrestBG} />
    </div>
  );
};

export default Home;
