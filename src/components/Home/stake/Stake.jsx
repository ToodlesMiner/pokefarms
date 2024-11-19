import { useState } from "react";
import stl from "./Stake.module.css";

const Stake = () => {
  const [activeTab, setActiveTab] = useState("1");
  return (
    <div className={stl.innerModal}>
      <div className={stl.vaultToggle}>
        <button
          className={activeTab === "1" ? stl.activeCta : ""}
          onClick={() => setActiveTab("1")}
        >
          Blastoise/PLS LP
        </button>
        <button
          className={activeTab === "2" ? stl.activeCta : ""}
          onClick={() => setActiveTab("2")}
        >
          Squirtle/PLS LP
        </button>
        <button
          className={activeTab === "3" ? stl.activeCta : ""}
          onClick={() => setActiveTab("3")}
        >
          Blastoise/Squirtle LP
        </button>
      </div>
      <div className={stl.vaultWrapper}></div>
    </div>
  );
};

export default Stake;
