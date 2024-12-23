import stl from "./ChooseFarm.module.css";
import { FaFlaskVial } from "react-icons/fa6";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { ethers } from "ethers";
import { masterABI } from "../../../utils/MasterABI";

const ChooseFarm = ({
  poolData,
  setSelectingFarm,
  setPool,
  setContract,
  currentNetwork,
  pool: currentPool,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const changePool = (pool) => {
    const newContract = new ethers.Contract(
      pool.trainerContract,
      masterABI,
      new ethers.JsonRpcProvider(currentNetwork.rpcUrl)
    );

    setContract(newContract);
    setPool(pool);
    setSelectingFarm(false);
  };

  console.log(currentPool);

  return (
    <div className={stl.farmoverlay} onClick={() => setSelectingFarm(false)}>
      <div className={stl.poolList} onClick={(e) => e.stopPropagation()}>
        <IoCloseSharp
          className={stl.close}
          onClick={() => setSelectingFarm(false)}
        />
        <h2>
          {" "}
          <FaFlaskVial />
          Active Pokéfarms
        </h2>
        <span className={stl.currentPool}>
          Current Pool:{" "}
          {currentPool?.contractName?.split("-")[0] +
            " " +
            currentPool?.contractName?.split("-")[1]}
        </span>
        <ul className={stl.list}>
          {poolData.map((pool, index) => (
            <li
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onClick={() => changePool(pool)}
              style={{
                backgroundColor:
                  pool.contractName === currentPool.contractName
                    ? "#14008c"
                    : "",
              }}
            >
              <img
                src={pool.dexTokenAImgUrl}
                alt="Pair img"
                className={stl.pairLogo}
              />
              <div className={stl.col}>
                <span className={stl.poolName}>{pool.contractName}</span>
                <span className={stl.contractSpan}>{pool.trainerContract}</span>
              </div>
              {hoveredIndex === index && (
                <div className={stl.visitDiv}>
                  <FaLongArrowAltRight className={stl.arrow} />
                  <span>Visit Pool</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChooseFarm;
