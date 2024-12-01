import { useEffect, useState } from "react";
import stl from "./Stake.module.css";
import Vault1 from "./vault1/Vault1";
import Vault2 from "./vault2/Vault2";
import Vault3 from "./vault3/Vault3";
import { BsBank } from "react-icons/bs";
import { getInnerPoolBalance } from "../../../utils/contractUtils";

const Stake = ({
  lp0Token,
  lp1Token,
  pool,
  contract,
  user,
  setUser,
  currentNetwork,
}) => {
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
      try {
        const poolReserves = await getInnerPoolBalance(
          pool.tokenA,
          pool.tokenB,
          currentNetwork.rpcUrl
        );
        setReservesAmount(poolReserves);
      } catch (err) {
        setReservesAmount(0);
      }
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
          {lp0Token?.baseToken?.symbol}/PLS LP
        </button>
        <button
          className={activeTab === 2 ? stl.activeCta : ""}
          onClick={() => setActiveTab(2)}
        >
          {lp1Token?.baseToken?.symbol}/PLS LP
        </button>
        <button
          className={activeTab === 3 ? stl.activeCta : ""}
          onClick={() => setActiveTab(3)}
        >
          {lp0Token?.baseToken?.symbol}/{lp1Token?.baseToken?.symbol} LP
        </button>
      </div>
      <div className={stl.vaultWrapper}>
        {activeTab === 1 && (
          <Vault1
            lp0Token={lp0Token}
            pool={pool}
            contract={contract}
            user={user}
            connectWallet={connectWallet}
            currentNetwork={currentNetwork}
          />
        )}
        {activeTab === 2 && (
          <Vault2
            lp1Token={lp1Token}
            lp0Token={lp0Token}
            pool={pool}
            contract={contract}
            user={user}
            connectWallet={connectWallet}
            currentNetwork={currentNetwork}
          />
        )}
        {activeTab === 3 && (
          <Vault3
            lp0Token={lp0Token}
            lp1Token={lp1Token}
            pool={pool}
            contract={contract}
            user={user}
            connectWallet={connectWallet}
            currentNetwork={currentNetwork}
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
              {reservesAmount ? reservesAmount.toLocaleString() : 0}{" "}
              {lp0Token?.baseToken?.symbol}
            </span>
          </div>
          <div className={stl.col}>
            <span>USD Value</span>
            <span className={stl.valueSpan}>
              $
              {(reservesAmount * +lp0Token.priceUsd).toLocaleString("en-US", {
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
