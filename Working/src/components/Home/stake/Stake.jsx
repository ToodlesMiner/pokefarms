import { useEffect, useState } from "react";
import stl from "./Stake.module.css";
import Vault1 from "./vault1/Vault1";
import Vault2 from "./vault2/Vault2";
import Vault3 from "./vault3/Vault3";
import { BsBank } from "react-icons/bs";
import { getInnerPoolBalance } from "../../../utils/contractUtils";

const Stake = ({ mainToken, lpToken, pool, contract, user, setUser }) => {
  const [activeTab, setActiveTab] = useState(1);
  const [reservesAmount, setReservesAmount] = useState(0);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request wallet connection
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        // Set the first account as the connected wallet
        setUser(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask to connect.");
    }
  };

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
          {mainToken?.baseToken?.symbol}/PLS LP
        </button>
        <button
          className={activeTab === 2 ? stl.activeCta : ""}
          onClick={() => setActiveTab(2)}
        >
          {lpToken?.baseToken?.symbol}/PLS LP
        </button>
        <button
          className={activeTab === 3 ? stl.activeCta : ""}
          onClick={() => setActiveTab(3)}
        >
          {mainToken?.baseToken?.symbol}/{lpToken?.baseToken?.symbol} LP
        </button>
      </div>
      <div className={stl.vaultWrapper}>
        {activeTab === 1 && (
          <Vault1
            mainToken={mainToken}
            pool={pool}
            contract={contract}
            user={user}
            connectWallet={connectWallet}
          />
        )}
        {activeTab === 2 && (
          <Vault2
            lpToken={lpToken}
            mainToken={mainToken}
            pool={pool}
            contract={contract}
            user={user}
            connectWallet={connectWallet}
          />
        )}
        {activeTab === 3 && (
          <Vault3
            mainToken={mainToken}
            lpToken={lpToken}
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
              {reservesAmount.toLocaleString()} {mainToken?.baseToken?.symbol}
            </span>
          </div>
          <div className={stl.col}>
            <span>USD Value</span>
            <span className={stl.valueSpan}>
              $
              {(reservesAmount * +mainToken.priceUsd).toLocaleString("en-US", {
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
