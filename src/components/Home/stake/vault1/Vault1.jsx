import stl from "./Vault1.module.css";
import { FaLock } from "react-icons/fa";
import { FaChartSimple } from "react-icons/fa6";
import { FaRegCopy } from "react-icons/fa";
import { BsBank } from "react-icons/bs";
import { useEffect, useState } from "react";
import getTokenBalance from "../../../../utils/getTokenBalance";
import { ethers } from "ethers";
import MessageOverlay from "../../messageoverlay/MessageOverlay";

const Vault1 = ({ mainToken, lpToken, pool, contract, user }) => {
  const [rewardCount, setRewardCount] = useState(0);
  const [mainTokenBalance, setMainTokenBalance] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [poolTVL, setPoolTVL] = useState(0);
  const [stakeInput, setStakeInput] = useState("");
  const [unStakeInput, setUnstakeInput] = useState("");
  const [claimLoading, setClaimLoading] = useState(false);

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
    // if (!user) return;
    const initialize = async () => {
      try {
        if (user) {
          // Pending reward to be claimed by user
          const currentReward = Number(await contract.pendingReward(0, user));
          setRewardCount(currentReward);

          // Current TokenA wallet balance
          const tokenBalance = await getTokenBalance(pool.mainTokenLP, user);
          setMainTokenBalance(tokenBalance);

          // Current TokenA staked balance
          const balance = await contract.userInfo(0, user);
          setStakedBalance(parseInt(balance));
        }
        // TVL
        // Get pool info
        const poolInfo = await contract.poolInfo(0);
        const lpTokenAddress = poolInfo.lpToken;
        const provider = new ethers.JsonRpcProvider(
          "https://rpc.pulsechain.com"
        );

        const lpTokenAbi = [
          "function balanceOf(address account) external view returns (uint256)",
        ];

        // Step 2: Initialize the LP token contract with the pool address
        const lpTokenContract = new ethers.Contract(
          lpTokenAddress,
          lpTokenAbi,
          provider
        );

        // Step 3: Call balanceOf function on pool 0 to get the balance
        const balance = await lpTokenContract.balanceOf(
          "0x320b6EF3F24825Fa9e7f67207c15e68D3107F95e"
        );

        console.log(balance);

        // setPoolTVL(poolBalance);
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

  const stake = async () => {
    if (!stakeInput || +stakeInput > mainTokenBalance) return;
  };
  const unStake = async () => {
    if (!unStakeInput || stakedBalance === 0) return;
  };

  const claimReward = async () => {
    setClaimLoading(true);
  };

  return (
    <div className={stl.vault}>
      {claimLoading && (
        <MessageOverlay submittedMessage={"Successfully Claimed 500 Tokens"} />
      )}
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
        <button
          className={stl.vaultCta}
          disabled={mainTokenBalance === 0 ? true : false}
          onClick={stake}
        >
          Stake
        </button>
      </div>
      <div className={stl.statsWrap}>
        <div className={stl.tvl}>
          <FaLock />
          <span className={stl.statSpan}>TVL</span>
          <span className={stl.statValue}>${poolTVL.toLocaleString()}</span>
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
        <button
          className={stl.vaultCta}
          disabled={stakedBalance === 0 ? true : false}
          onClick={unStake}
        >
          Unstake
        </button>
      </div>

      <button
        className={stl.claimCta}
        onClick={claimReward}
        disabled={claimLoading ? true : false}
      >
        {claimLoading && <img src="../Spinner.svg" alt="Spinner" />}
        {!claimLoading && (
          <>
            CLAIM {rewardCount} {mainToken.baseToken.symbol}
          </>
        )}
      </button>
    </div>
  );
};

export default Vault1;
