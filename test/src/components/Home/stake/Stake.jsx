import connectWallet from "/src/components/nav/Nav.jsx";
import { useEffect, useState } from "react";
import stl from "./Stake.module.css";
import Vault1 from "./vault1/Vault1";
import Vault2 from "./vault2/Vault2";
import Vault3 from "./vault3/Vault3";
import { BsBank } from "react-icons/bs";
import { getInnerPoolBalance } from "../../../utils/contractUtils";

const Stake = ({ PairA, PairB, pool, contract, user}) => {
  const [activeTab, setActiveTab] = useState(1);
  const [reservesAmount, setReservesAmount] = useState(0);

  useEffect(() => {
    const init = async () => {
      const poolReserves = await getInnerPoolBalance(pool.tokenA, pool.tokenB);
      setReservesAmount(poolReserves);
    };
    init();
  }, []);
  return (
    <div className={stl.innerModal}>
      <div className={stl.vaultToggle}>
        <button
          className={activeTab === 1 ? stl.activeCta : ""}
          onClick={() => setActiveTab(1)}
        >
          {PairA?.baseToken?.symbol}/PLS LP
        </button>
        <button
          className={activeTab === 2 ? stl.activeCta : ""}
          onClick={() => setActiveTab(2)}
        >
          {PairB?.baseToken?.symbol}/PLS LP
        </button>
        <button
          className={activeTab === 3 ? stl.activeCta : ""}
          onClick={() => setActiveTab(3)}
        >
          {PairA?.baseToken?.symbol}/{PairB?.baseToken?.symbol} LP
        </button>
      </div>
      <div className={stl.vaultWrapper}>
        {activeTab === 1 && (
          <Vault1
            PairA={PairA}
            pool={pool}
            contract={contract}
            user={user}
            connectWallet={connectWallet}
          />
        )}
        {activeTab === 2 && (
          <Vault2
            PairB={PairB}
            PairA={PairA}
            pool={pool}
            contract={contract}
            user={user}
            connectWallet={connectWallet}
          />
        )}
        {activeTab === 3 && (
          <Vault3
            PairA={PairA}
            PairB={PairB}
            pool={pool}
            contract={contract}
            user={user}
            connectWallet={connectWallet}
          />
        )}
        <div className={stl.vaultStats}>
          <div>
            <BsBank />
            <span className={stl.reserves}>Reserves</span>
          </div>
          <div className={stl.col}>
            <span>Balance</span>
            <span className={stl.valueSpan}>
              {reservesAmount.toLocaleString()} {PairA?.baseToken?.symbol}
            </span>
          </div>
          <div className={stl.col}>
            <span>USD Value</span>
            <span className={stl.valueSpan}>
              $
              {(reservesAmount * +PairA.priceUsd).toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stake;
