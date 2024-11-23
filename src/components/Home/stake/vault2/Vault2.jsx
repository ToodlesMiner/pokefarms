import stl from "./Vault2.module.css";
import { FaLock } from "react-icons/fa";
import { FaChartSimple } from "react-icons/fa6";
import { FaRegCopy } from "react-icons/fa";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {
  getTokenBalance,
  getPoolBalance,
  getInnerPoolBalance,
} from "../../../../utils/contractUtils";
import MessageOverlay from "../../messageoverlay/MessageOverlay";

const Vault2 = ({ mainToken, lpToken, pool, contract, user }) => {
  const [rewardCount, setRewardCount] = useState(0);
  const [mainTokenBalance, setMainTokenBalance] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [poolTVL, setPoolTVL] = useState(0);
  const [APR, setAPR] = useState(0);
  const [stakeInput, setStakeInput] = useState("");
  const [unStakeInput, setUnstakeInput] = useState("");
  const [claimLoading, setClaimLoading] = useState(false);
  const [stakeLoading, setStakeLoading] = useState(false);
  const [unStakeLoading, setUnStakeLoading] = useState(false);
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
  }, [user]);

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
          const currentReward = Number(await contract.pendingReward(1, user));
          setRewardCount(currentReward);

          // Current TokenB wallet balance
          const tokenBalance = await getTokenBalance(pool.LP1, user);
          setMainTokenBalance(tokenBalance);

          // Current TokenB staked balance
          const balance = await contract.userInfo(1, user);
          setStakedBalance(BigInt(parseInt(balance)) / BigInt(1e18));
        }
        // TVL & APR
        const totalPoolBalance = await getPoolBalance(pool.LP1);
        console.log("Total LP1 Supply: ", totalPoolBalance);
        const tokenAPoolBalance = await getInnerPoolBalance(
          pool.tokenB,
          pool.LP1
        );
        console.log("SECinLP1contract: ", tokenAPoolBalance);

        const ratio = tokenAPoolBalance / totalPoolBalance;
        console.log("Ratio: ", ratio);

        const rewards = await contract.RewardPerSecond();
        const formattedRewards = Number(rewards) / 1e18;
        console.log("SEC per Second: ", formattedRewards);

        const allocPoints = await contract.poolInfo(1);
        console.log("Alloc points: ", Number(allocPoints[1]));

        const totalAlloc = await contract.totalAllocPoint();
        console.log("Total Alloc points: ", Number(totalAlloc));

        const pool1Balance = await getTokenBalance(
          pool.LP1,
          pool.parentContract
        );
        console.log("LP Staked1: ", pool1Balance);

        const rewardsPerSecond =
          (Number(formattedRewards) * Number(allocPoints[1])) /
          Number(totalAlloc);
        console.log("RewardRatePerSecond: ", rewardsPerSecond);

        const annualRewards = rewardsPerSecond * 31536000;
        console.log("Annual Rewards: ", annualRewards);

        const mainTokenRequest = await fetch(
          `https://api.dexscreener.com/latest/dex/pairs/pulsechain/${pool.LP2}`
        );
        const lpTokenData = await mainTokenRequest.json();
        const nativePrice = +lpTokenData.pair.priceNative;

        const tokenAValuePerLPTokens = tokenAPoolBalance / totalPoolBalance;
        console.log("TokenA Value Per LP Tokens: ", tokenAValuePerLPTokens);

        const tokenAStaked =
          (tokenAValuePerLPTokens * pool1Balance) / nativePrice;
        console.log("TokenA staked: ", tokenAStaked);

        const APR = annualRewards / tokenAStaked;

        setAPR(APR);
        console.log("APR: %", APR);

        // TVL
        const tokenA = tokenAValuePerLPTokens * pool1Balance;
        const TVL = tokenA * 2 * +lpToken.priceUsd;
        setPoolTVL(TVL);
        console.log("TVL: ", TVL);
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
      const amount = ethers.parseUnits(stakeInput, 18);
      const contractWithSigner = contract.connect(signer);

      const lpTokenContract = new ethers.Contract(
        pool.LP1,
        [
          "function approve(address spender, uint256 amount) public returns (bool)",
          "function allowance(address owner, address spender) public view returns (uint256)",
          "function balanceOf(address account) public view returns (uint256)",
        ],
        signer
      );

      const hasApproved = localStorage.getItem("Vault2Approved");
      if (!hasApproved) {
        const approveTx = await lpTokenContract.approve(
          pool.parentContract,
          (BigInt(100_000_000_000) * BigInt(1e18)).toString()
        );
        await approveTx.wait();
        localStorage.setItem("Vault2Approved", true);
      }

      const depositTx = await contractWithSigner.deposit(1, amount);
      await depositTx.wait();

      setStakedBalance((prev) => BigInt(prev) + BigInt(stakeInput));
      setMainTokenBalance((prev) => BigInt(prev) - BigInt(stakeInput));

      setMessage(`Successfully Staked ${stakeInput} LP!`);
      setStakeInput("");

      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (err) {
      console.error("Staking Error:", {
        message: err.message,
        code: err.code,
        stack: err.stack,
      });
    } finally {
      setStakeLoading(false);
    }
  };

  const unStake = async () => {
    if (!unStakeInput || stakedBalance === 0 || !signer) return;

    try {
      setUnStakeLoading(true);
      const amount = ethers.parseUnits(unStakeInput, 18);
      const contractWithSigner = contract.connect(signer);

      // Call the withdraw function from the smart contract
      const withdrawTx = await contractWithSigner.withdraw(1, amount);
      await withdrawTx.wait();

      // Update balances
      setStakedBalance((prev) => BigInt(prev) - BigInt(unStakeInput));
      setMainTokenBalance((prev) => BigInt(prev) + BigInt(unStakeInput));

      setMessage(`Successfully Unstaked ${unStakeInput} LP!`);
      setUnstakeInput("");

      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (err) {
      console.error("Unstaking Error:", {
        message: err.message,
        code: err.code,
        stack: err.stack,
      });
    } finally {
      setUnStakeLoading(false);
    }
  };

  const claimReward = async () => {
    if (!signer || !user) return;

    try {
      setClaimLoading(true);
      const contractWithSigner = contract.connect(signer);

      // Call withdraw with 0 amount to claim rewards
      const withdrawTx = await contractWithSigner.withdraw(1, 0);
      await withdrawTx.wait();

      // Get updated pending reward after withdrawal
      const currentReward = Number(await contract.pendingReward(1, user));
      setRewardCount(currentReward);

      setMessage(
        `Successfully claimed ${(rewardCount / 1e18).toFixed(5)} ${
          lpToken.baseToken.symbol
        }!`
      );

      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (err) {
      console.error("Claim Error:", {
        message: err.message,
        code: err.code,
        stack: err.stack,
      });
    } finally {
      setClaimLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    const yieldInterval = setInterval(async () => {
      const currentReward = Number(await contract.pendingReward(1, user));
      setRewardCount(currentReward);
    }, 7000);

    return () => clearInterval(yieldInterval);
  }, [user]);

  return (
    <div className={stl.vault}>
      {message && <MessageOverlay submittedMessage={message} />}
      <div className={stl.titleBox}>
        <button
          className={stl.dexCta}
          onClick={() =>
            window.open(
              `https://dex.9mm.pro/v2/add/${pool.tokenB}/PLS`,
              "_blank"
            )
          }
        >
          <img src="../9mm.png" alt="9mm" className={stl.mmlogo} />
          Get 9mm LP
        </button>
        <h2>{lpToken?.baseToken?.symbol}/PLS LP</h2>
        <span>
          <FaRegCopy
            className={stl.copy}
            onClick={() =>
              handleCopyAddress(`${lpToken.baseToken.symbol} LP`, pool.LP1)
            }
          />{" "}
          {pool.LP1}
        </span>
      </div>
      <div className={stl.swapWrap}>
        <div className={stl.leftWrap}>
          <span>You're Staking</span>
          <div className={stl.microStake}>
            <div className={stl.microRow}>
              <img
                src={pool.dexLpTokenImgUrl}
                alt="Mint"
                className={stl.microLogo}
              />
              <span>{lpToken.baseToken.symbol}</span>
            </div>
            <span className={stl.grayPlus}>+</span>
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
          {user && (
            <span className={stl.balanceSpan}>
              Balance:{" "}
              <span className={stl.whiteSpan}>
                {mainTokenBalance.toLocaleString()}
              </span>{" "}
              LP
            </span>
          )}
        </div>
        <button
          className={stl.vaultCta}
          disabled={stakeLoading || mainTokenBalance === 0 ? true : false}
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
          <span className={stl.statValue}>{Math.floor(APR * 100)}%</span>
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
                src={pool.dexLpTokenImgUrl}
                alt="Mint"
                className={stl.microLogo}
              />
              <span>{lpToken.baseToken.symbol}</span>
            </div>
            <span className={stl.grayPlus}>+</span>
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
          {user && (
            <span className={stl.balanceSpan}>
              Staked:{" "}
              <span className={stl.whiteSpan}>
                {stakedBalance.toLocaleString()}
              </span>{" "}
              LP
            </span>
          )}
        </div>
        <button
          className={stl.vaultCta}
          disabled={unStakeLoading || stakedBalance === 0 ? true : false}
          onClick={unStake}
        >
          {!unStakeLoading && "Unstake"}
          {unStakeLoading && <img src="../Spinner.svg" alt="spinner" />}
        </button>
      </div>

      <button
        className={stl.claimCta}
        onClick={claimReward}
        // disabled={true}
        disabled={!user || claimLoading ? true : false}
      >
        {user && claimLoading && <img src="../Spinner.svg" alt="Spinner" />}
        {user && !claimLoading && (
          <>
            {/* CLAIM {Number(BigInt(rewardCount) / BigInt(1e18))}{" "} */}
            CLAIM {(rewardCount / 1e18).toFixed(5)} {mainToken.baseToken.symbol}
          </>
        )}
        {!user && "Connect A Wallet To Claim Rewards"}
      </button>
    </div>
  );
};

export default Vault2;
