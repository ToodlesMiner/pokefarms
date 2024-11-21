import { useState } from "react";
import stl from "./Stake.module.css";
import Vault1 from "./vault1/Vault1";
import Vault2 from "./vault2/Vault2";
import Vault3 from "./vault3/Vault3";

const Stake = ({
  mainToken,
  lpToken,
  pool,
  setSelectingFarm,
  contract,
  user,
}) => {
  const [activeTab, setActiveTab] = useState(1);
  return (
    <div className={stl.innerModal}>
      <div className={stl.vaultToggle}>
        <button
          className={activeTab === 1 ? stl.activeCta : ""}
          onClick={() => setActiveTab(1)}
        >
          {mainToken.baseToken.symbol}/PLS LP
        </button>
        <button
          className={activeTab === 2 ? stl.activeCta : ""}
          onClick={() => setActiveTab(2)}
        >
          {lpToken.baseToken.symbol}/PLS LP
        </button>
        <button
          className={activeTab === 3 ? stl.activeCta : ""}
          onClick={() => setActiveTab(3)}
        >
          {mainToken.baseToken.symbol}/{lpToken.baseToken.symbol} LP
        </button>
      </div>
      <div className={stl.vaultWrapper}>
        {activeTab === 1 && (
          <Vault1
            mainToken={mainToken}
            lpToken={lpToken}
            pool={pool}
            contract={contract}
            user={user}
          />
        )}
        {activeTab === 2 && (
          <Vault2
            mainToken={mainToken}
            lpToken={lpToken}
            pool={pool}
            contract={contract}
            user={user}
          />
        )}
        {activeTab === 3 && (
          <Vault3
            mainToken={mainToken}
            lpToken={lpToken}
            pool={pool}
            contract={contract}
            user={user}
          />
        )}
      </div>
    </div>
  );
};

export default Stake;
