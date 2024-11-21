import { useState } from "react";
import stl from "./Mint.module.css";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdCandlestickChart } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { BsBank } from "react-icons/bs";

const Mint = ({ mainToken, lpToken, setSelectingFarm, emissionRate, pool }) => {
  const [inputAmount, setInputAmount] = useState("");

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
    <div className={stl.innerModal}>
      <div className={stl.toprow}>
        <span className={stl.rate}>
          1 {mainToken?.baseToken?.symbol} = {emissionRate}{" "}
          {lpToken?.baseToken?.symbol}
        </span>
        <IoMdInformationCircleOutline className={stl.info} />
      </div>
      <div className={stl.swapWrap}>
        <span>You're Freezing</span>
        <div className={stl.itemBox}>
          <div className={stl.itemWrap} onClick={() => setSelectingFarm(true)}>
            <img
              src={pool.dexMainTokenImgUrl}
              alt="Main"
              className={stl.logoIcon}
            />
            <span>{mainToken?.baseToken?.symbol}</span>
          </div>
          <div className={stl.numberBox}>
            <input
              type="text"
              placeholder="0"
              className={stl.amountInput}
              value={inputAmount}
              onInput={(e) => setInputAmount(e.target.value)}
            />
          </div>
        </div>
      </div>
      <IoMdArrowRoundDown className={stl.swapArrow} />
      <div className={stl.swapWrap}>
        <span>You're Minting</span>
        <div className={stl.itemBox}>
          <div className={stl.itemWrap} onClick={() => setSelectingFarm(true)}>
            <img
              src={pool.dexLpTokenImgUrl}
              alt="LP"
              className={stl.logoIcon}
            />
            <span>{lpToken?.baseToken?.symbol}</span>
          </div>
          <div className={stl.numberBox}>
            <span
              className={`${stl.outputSpan} ${
                +inputAmount * emissionRate > 0 ? stl.whiteSpan : ""
              }`}
            >
              {inputAmount
                ? Math.floor(+inputAmount * emissionRate).toLocaleString()
                : "0"}
            </span>
          </div>
        </div>
      </div>
      <button className={stl.swapCta}>Swap</button>
      <div className={stl.bottomBox}>
        <div className={stl.tokenBox}>
          <div className={stl.wrapper}>
            <img
              src={pool.dexMainTokenImgUrl}
              alt="Main"
              className={stl.logoIcon}
            />
            <span>{mainToken?.baseToken?.symbol}</span>
          </div>
          <div className={stl.priceBox}>
            <span className={stl.priceSpan}>${mainToken?.priceUsd}</span>
            <span
              className={`${stl.priceChange} ${
                mainToken?.priceChange?.h24 >= 0 ? "" : stl.redPrice
              }`}
            >
              24h {mainToken?.priceChange?.h24 >= 0 ? "+" : ""}
              {mainToken?.priceChange?.h24}%
            </span>
          </div>
          <div className={stl.ctaBox}>
            <button
              onClick={() =>
                handleCopyAddress(mainToken?.baseToken?.symbol, pool.mainToken)
              }
            >
              <FaRegCopy className={stl.copyIcon} />
              Copy
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://dex.9mm.pro/swap?chain=pulsechain&inputCurrency=PLS&outputCurrency=${pool.mainTokenLP}`,
                  "_blank"
                )
              }
            >
              <FaExchangeAlt className={stl.buyIcon} />
              Buy
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://dexscreener.com/pulsechain/${pool.mainToken}`,
                  "_blank"
                )
              }
            >
              <MdCandlestickChart />
              Chart
            </button>
          </div>
        </div>
        <div className={stl.border}></div>
        <div className={stl.tokenBox}>
          <div className={stl.wrapper}>
            <img
              src="../Squirtlogo.webp"
              alt="Blast"
              className={stl.logoIcon}
            />
            <span>{lpToken?.baseToken?.symbol}</span>
          </div>
          <div className={stl.priceBox}>
            <span className={stl.priceSpan}>${lpToken?.priceUsd}</span>
            <span
              className={`${stl.priceChange} ${
                lpToken?.priceChange?.h24 >= 0 ? "" : stl.redPrice
              }`}
            >
              24h {lpToken?.priceChange?.h24 >= 0 ? "+" : ""}
              {lpToken?.priceChange?.h24}%
            </span>
          </div>
          <div className={stl.ctaBox}>
            <button
              onClick={() =>
                handleCopyAddress(lpToken?.baseToken?.symbol, pool.lpToken)
              }
            >
              <FaRegCopy className={stl.copyIcon} />
              Copy
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://dex.9mm.pro/?chain=pulsechain&outputCurrency=${pool.lpTokenLP}&inputCurrency=PLS`,
                  "_blank"
                )
              }
            >
              <FaExchangeAlt className={stl.buyIcon} />
              Buy
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://dexscreener.com/pulsechain/${pool.lpToken}`,
                  "_blank"
                )
              }
            >
              <MdCandlestickChart />
              Chart
            </button>
          </div>
        </div>
      </div>
      <div className={stl.vaultStats}>
        <div>
          <BsBank />
          <span className={stl.reserves}>Reserves</span>
        </div>
        <div className={stl.col}>
          <span>Balance</span>
          <span className={stl.valueSpan}>
            {/* {poolStakedBalance.toLocaleString()} {mainToken.baseToken.symbol} */}
          </span>
        </div>
        <div className={stl.col}>
          <span>USD Value</span>
          <span className={stl.valueSpan}>
            $
            {/* {(poolStakedBalance * +mainToken.priceUsd)
              .toFixed(2)
              .toLocaleString()} */}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Mint;
