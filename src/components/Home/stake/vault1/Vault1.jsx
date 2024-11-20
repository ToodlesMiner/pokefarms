import stl from "./Vault1.module.css";
import { FaLock } from "react-icons/fa";
import { FaChartSimple } from "react-icons/fa6";
import { FaRegCopy } from "react-icons/fa";
import { BsBank } from "react-icons/bs";

const Vault1 = () => {
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

  return (
    <div className={stl.vault}>
      <div className={stl.titleBox}>
        <h2>BLASTOISE/PLS LP</h2>
        <span>
          <FaRegCopy
            className={stl.copy}
            onClick={() =>
              handleCopyAddress(
                "Blastoise",
                "0x8b87e80f234b9b78b7d2e477fa41734bfb4871f3"
              )
            }
          />{" "}
          0x8b87e80f234b9b78b7d2e477fa41734bfb4871f3
        </span>
      </div>
      <div className={stl.swapWrap}>
        <div className={stl.leftWrap}>
          <span>You're Staking</span>
          <div className={stl.microStake}>
            <div className={stl.microRow}>
              <img
                src="../Blastlogo.webp"
                alt="blast"
                className={stl.microLogo}
              />
              <span>BLASTOISE</span>
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
            />
            <div className={stl.buttonBox}>
              <button>25%</button>
              <button>50%</button>
              <button>75%</button>
              <button>Max</button>
            </div>
          </div>
          <span className={stl.balanceSpan}>Balance: 3,554,905 BLASTOISE</span>
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
                src="../Blastlogo.webp"
                alt="blast"
                className={stl.microLogo}
              />
              <span>BLASTOISE</span>
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
            />
            <div className={stl.buttonBox}>
              <button>25%</button>
              <button>50%</button>
              <button>75%</button>
              <button>Max</button>
            </div>
          </div>
          <span className={stl.balanceSpan}>Staked: 419,001 BLASTOISE</span>
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
          <span className={stl.valueSpan}>501,340 BLASTOISE</span>
        </div>
        <div className={stl.col}>
          <span>USD Value</span>
          <span className={stl.valueSpan}>$12,431</span>
        </div>
      </div>
      <button className={stl.claimCta}>CLAIM 23 BLASTOISE</button>
    </div>
  );
};

export default Vault1;
