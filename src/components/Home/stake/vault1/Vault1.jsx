import stl from "./Vault1.module.css";
import { FaLock } from "react-icons/fa";
import { FaChartSimple } from "react-icons/fa6";
import { FaRegCopy } from "react-icons/fa";
import { ethers } from "ethers";
import { BsBank } from "react-icons/bs";
import { useEffect, useState } from "react";
import {
  getTokenBalance,
  getPoolBalance,
  getInnerPoolBalance,
} from "../../../../utils/contractUtils";
import MessageOverlay from "../../messageoverlay/MessageOverlay";

const Vault1 = ({ mainToken, lpToken, pool, contract, user }) => {
  const [rewardCount, setRewardCount] = useState(0);
  const [mainTokenBalance, setMainTokenBalance] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [poolTVL, setPoolTVL] = useState(0);
  const [APR, setAPR] = useState(0);
  const [stakeInput, setStakeInput] = useState("");
  const [unStakeInput, setUnstakeInput] = useState("");
  const [claimLoading, setClaimLoading] = useState(false);
  const [stakeLoading, setStakeLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    const initializeProvider = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setSigner(signer);
      }
    };
    initializeProvider();
  }, []);

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
          const tokenBalance = await getTokenBalance(pool.tokenA, user);
          setMainTokenBalance(tokenBalance);

          // Current TokenA staked balance
          const balance = await contract.userInfo(0, user);
          setStakedBalance(parseInt(balance));
        }
        // TVL
        const totalPoolBalance = await getPoolBalance(pool.LP0);
        console.log("Total LP0 Supply: ", totalPoolBalance);

        ///////
        const tokenAPoolBalance = await getInnerPoolBalance(
          pool.tokenA,
          pool.LP0
        );
        console.log("SECinLP0contract: ", tokenAPoolBalance);

        const ratio = tokenAPoolBalance / totalPoolBalance;
        console.log("Ratio: ", ratio);

        const rewards = await contract.RewardPerSecond();
        const formattedRewards = Number(rewards) / 1e18;
        console.log("SEC per Second: ", formattedRewards);

        const allocPoints = await contract.poolInfo(0);
        console.log("Alloc points: ", Number(allocPoints[1]));

        const totalAlloc = await contract.totalAllocPoint();
        console.log("Total Alloc points: ", Number(totalAlloc));

        const pool0Balance = await getTokenBalance(
          pool.LP0,
          pool.parentContract
        );
        console.log("LP Staked0: ", pool0Balance);

        const rewardsPerSecond =
          (Number(formattedRewards) * Number(allocPoints[1])) /
          Number(totalAlloc);
        console.log("RewardRatePerSecond: ", rewardsPerSecond);

        const annualRewards = rewardsPerSecond * 31536000;
        console.log("Annual Rewards: ", annualRewards);

        const blastValuePerLPTokens = tokenAPoolBalance / totalPoolBalance;
        console.log("Blast Value Per LP Tokens: ", blastValuePerLPTokens);

        const blastStaked = blastValuePerLPTokens * pool0Balance;
        console.log("Blast staked: ", blastStaked);

        const APR = annualRewards / blastStaked;
        setAPR(APR);
        console.log("APR: %", APR);

        const TVL = blastStaked * 2 * +mainToken.priceUsd * 10;
        setPoolTVL(TVL);
        console.log("TVL: ", TVL);
        /////////
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
    if (!stakeInput || mainTokenBalance === 0 || !signer) return;

    try {
      setStakeLoading(true);
      const amount = ethers.parseUnits(stakeInput, 18); // Assuming 18 decimals
      console.log(amount);
      console.log(BigInt(amount) / BigInt(1e18));

      // Create a new contract instance with the signer
      const contractWithSigner = contract.connect(signer);

      // First approve the HeadFarm contract to spend LP tokens
      const lpTokenContract = new ethers.Contract(
        pool.tokenA,
        [
          "function approve(address spender, uint256 amount) public returns (bool)",
        ],
        signer
      );

      const approveTx = await lpTokenContract.approve(
        pool.parentContract,
        amount
      );
      await approveTx.wait();
      console.log("Awaiting deposit");
      // Now deposit LP tokens into the farm
      const depositTx = await contractWithSigner.deposit(0, amount); // Using pool id 0
      await depositTx.wait();

      console.log("Deposited");
      // Reset input and fetch updated balances
      setStakeInput("");

      // Fetch updated balances
      const tokenBalance = await getTokenBalance(pool.tokenA, user);
      setMainTokenBalance(tokenBalance);

      const balance = await contract.userInfo(0, user);
      setStakedBalance(parseInt(balance.amount));

      setMessage("Stake successful!");
    } catch (err) {
      console.error("Staking Error:", {
        message: err.message,
        code: err.code,
        stack: err.stack,
      });
      setMessage(err.message || "Failed to stake tokens");
    } finally {
      setStakeLoading(false);
    }
  };

  const unStake = async () => {
    if (!unStakeInput || stakedBalance === 0) return;
  };

  const claimReward = async () => {
    setClaimLoading(true);
    setText("hello");
  };

  return (
    <div className={stl.vault}>
      {claimLoading && <MessageOverlay submittedMessage={text} />}
      <div className={stl.titleBox}>
        <h2>{mainToken?.baseToken?.symbol}/PLS LP</h2>
        <span>
          <FaRegCopy
            className={stl.copy}
            onClick={() =>
              handleCopyAddress(mainToken.baseToken.symbol, pool.LP0)
            }
          />{" "}
          {pool.LP0}
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
          // disabled={mainTokenBalance === 0 ? true : false}
          onClick={stake}
        >
          {!stakeLoading && "Stake"}
          {stakeLoading && <img src="../Spinner.svg" alt="Spinner" />}
        </button>
      </div>
      <div className={stl.statsWrap}>
        <div className={stl.tvl}>
          <FaLock />
          <span className={stl.statSpan}>TVL</span>
          <span className={stl.statValue}>
            ${Number(poolTVL.toFixed(0)).toLocaleString()}
          </span>
        </div>
        <img src="ball.png" alt="ball" className={stl.pokeBall} />
        <div className={stl.apr}>
          <span className={stl.statValue}>{Math.floor(APR * 10)}%</span>
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
