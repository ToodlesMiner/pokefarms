import stl from "./ChooseFarm.module.css";
import { FaFlaskVial } from "react-icons/fa6";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

const ChooseFarm = ({ poolData, setSelectingFarm, setPool, setMintRatio }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
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
        <ul className={stl.list}>
          {poolData.map((pool, index) => (
            <li
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onClick={() => {
                setPool(pool);
                setMintRatio(pool.mintRatio)
                setSelectingFarm(false);
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
