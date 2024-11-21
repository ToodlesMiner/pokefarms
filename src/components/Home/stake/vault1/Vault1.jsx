import stl from "./Vault1.module.css";
import { FaLock } from "react-icons/fa";
import { FaChartSimple } from "react-icons/fa6";
import { FaRegCopy } from "react-icons/fa";
import { BsBank } from "react-icons/bs";
import { useEffect, useState } from "react";
import getTokenBalance from "../../../../utils/getTokenBalance";
import { ethers } from "ethers";

const Vault1 = ({ mainToken, lpToken, pool, contract, user }) => {
  const [rewardCount, setRewardCount] = useState(0);
  const [mainTokenBalance, setMainTokenBalance] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [poolStakedBalance, setPoolStakedBalance] = useState(0);
  const [stakeInput, setStakeInput] = useState("");
  const [unStakeInput, setUnstakeInput] = useState("");

  const handleCopyAddress = (name, address) => {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        alert(`${name}'s address copied.`);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  useEffect(() => {
    if (!user) return;
    const initialize = async () => {
      try {
        // Pending reward to be claimed by user
        const currentReward = Number(await contract.pendingReward(0, user));
        setRewardCount(currentReward);

        // Current TokenA wallet balance
        const tokenBalance = await getTokenBalance(pool.mainTokenLP, user);
        setMainTokenBalance(tokenBalance);

        // Current TokenA staked balance
        const balance = await contract.userInfo(0, user);
        setStakedBalance(parseInt(balance));

        // Get pool info
        const poolInfo = await contract.poolInfo(0);
        const lpTokenAddress = poolInfo.lpToken;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Create a contract instance for the LP token
        const lpTokenContract = new ethers.Contract(
          lpTokenAddress,
          [
            "function balanceOf(address owner) view returns (uint256)",
            "function decimals() view returns (uint8)",
          ],
          signer
        );

        const poolBalance = await lpTokenContract.balanceOf(
          pool.parentContract
        );

        setPoolStakedBalance(Number(BigInt(poolBalance) / BigInt(1e18)));
      } catch (err) {
        // More detailed error logging
        console.error("Initialization Error:", {
          message: err.message,
          code: err.code,
          stack: err.stack,
        });
      }
    };
    initialize();
  }, [user]);

  return (
    <div className={stl.vault}>
      <div className={stl.titleBox}>
        <h2>{mainToken?.baseToken?.symbol}/PLS LP</h2>
        <span>
          <FaRegCopy
            className={stl.copy}
            onClick={() =>
              handleCopyAddress(mainToken.baseToken.symbol, pool.mainToken)
            }
          />{" "}
          {pool.mainToken}
        </span>
      </div>
      <div className={stl.swapWrap}>
        <div className={stl.leftWrap}>
          <span>You're Staking</span>
          <div className={stl.microStake}>
            <div className={stl.microRow}>
              <img
                src={pool.dexMainTokenImgUrl}
                alt="Mint"
                className={stl.microLogo}
              />
              <span>{mainToken.baseToken.symbol}</span>
            </div>
            <div className={stl.microRow}>
              <img src="../Pulse.png" alt="pulse" className={stl.microLogo} />
              <span>PLS LP</span>
            </div>
          </div>
        </div>
        <div className={stl.midblock}>
          <div className={stl.midInputBlock}>
            <input
              type="text"
              className={stl.input}
              placeholder="Enter amount to stake"
              value={stakeInput}
              onInput={(e) => {
                const inputValue = e.target?.value;
                if (/^\d*\.?\d*$/.test(inputValue)) {
                  setStakeInput(inputValue);
                }
              }}
            />
            <div className={stl.buttonBox}>
              <button
                onClick={() =>
                  setStakeInput((mainTokenBalance * 0.25).toFixed(0).toString())
                }
              >
                25%
              </button>
              <button
                onClick={() =>
                  setStakeInput((mainTokenBalance * 0.5).toFixed(0).toString())
                }
              >
                50%
              </button>
              <button
                onClick={() =>
                  setStakeInput((mainTokenBalance * 0.75).toFixed(0).toString())
                }
              >
                75%
              </button>
              <button
                onClick={() => setStakeInput(mainTokenBalance.toString())}
              >
                Max
              </button>
            </div>
          </div>
          <span className={stl.balanceSpan}>
            Balance: {mainTokenBalance.toLocaleString()}{" "}
            {mainToken.baseToken.symbol}
          </span>
        </div>
        <button className={stl.vaultCta}>Stake</button>
      </div>
      <div className={stl.statsWrap}>
        <div className={stl.tvl}>
          <FaLock />
          <span className={stl.statSpan}>TVL</span>
          <span className={stl.statValue}>$31,230</span>
        </div>
        <img src="ball.png" alt="ball" className={stl.pokeBall} />
        <div className={stl.apr}>
          <span className={stl.statValue}>54%</span>
          <span className={stl.statSpan2}>APR</span>
          <FaChartSimple />
        </div>
      </div>
      <div className={stl.swapWrap}>
        <div className={stl.leftWrap}>
          <span>You're Unstaking</span>
          <div className={stl.microStake}>
            <div className={stl.microRow}>
              <img
                src={pool.dexMainTokenImgUrl}
                alt="Mint"
                className={stl.microLogo}
              />
              <span>{mainToken.baseToken.symbol}</span>
            </div>
            <div className={stl.microRow}>
              <img src="../Pulse.png" alt="pulse" className={stl.microLogo} />
              <span>PLS LP</span>
            </div>
          </div>
        </div>
        <div className={stl.midblock}>
          <div className={stl.midInputBlock}>
            <input
              type="text"
              className={stl.input}
              placeholder="Enter amount to unstake"
              value={unStakeInput}
              onInput={(e) => {
                const inputValue = e.target?.value;
                if (/^\d*\.?\d*$/.test(inputValue)) {
                  setUnstakeInput(inputValue);
                }
              }}
            />
            <div className={stl.buttonBox}>
              <button
                onClick={() =>
                  setUnstakeInput((stakedBalance * 0.25).toFixed(0).toString())
                }
              >
                25%
              </button>
              <button
                onClick={() =>
                  setUnstakeInput((stakedBalance * 0.5).toFixed(0).toString())
                }
              >
                50%
              </button>
              <button
                onClick={() =>
                  setUnstakeInput((stakedBalance * 0.75).toFixed(0).toString())
                }
              >
                75%
              </button>
              <button onClick={() => setUnstakeInput(stakedBalance.toString())}>
                Max
              </button>
            </div>
          </div>
          <span className={stl.balanceSpan}>
            Staked: {stakedBalance.toLocaleString()}{" "}
            {mainToken.baseToken.symbol}
          </span>
        </div>
        <button className={stl.vaultCta}>Unstake</button>
      </div>
      <div className={stl.vaultStats}>
        <div>
          <BsBank />
          <span className={stl.reserves}>Reserves</span>
        </div>
        <div className={stl.col}>
          <span>Balance</span>
          <span className={stl.valueSpan}>
            {poolStakedBalance.toLocaleString()} {mainToken.baseToken.symbol}
          </span>
        </div>
        <div className={stl.col}>
          <span>USD Value</span>
          <span className={stl.valueSpan}>
            $
            {(poolStakedBalance * +mainToken.priceUsd)
              .toFixed(2)
              .toLocaleString()}
          </span>
        </div>
      </div>
      <button className={stl.claimCta}>
        CLAIM {rewardCount} {mainToken.baseToken.symbol}
      </button>
    </div>
  );
};

export default Vault1;
