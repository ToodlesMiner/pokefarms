import { useState } from "react";
import stl from "./Mint.module.css";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdCandlestickChart } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";

const Mint = ({ mainToken, lpToken, setSelectingFarm }) => {
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState(205.92);

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
        <span className={stl.rate}>1 BLASTOISE = {outputAmount} SQUIRTLE</span>
        <IoMdInformationCircleOutline className={stl.info} />
      </div>
      <div className={stl.swapWrap}>
        <span>You're Freezing</span>
        <div className={stl.itemBox}>
          <div className={stl.itemWrap} onClick={() => setSelectingFarm(true)}>
            <img src="../Blastlogo.webp" alt="Blast" className={stl.logoIcon} />
            <span>BLASTOISE</span>
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
              src="../Squirtlogo.webp"
              alt="Blast"
              className={stl.logoIcon}
            />
            <span>SQUIRTLE</span>
          </div>
          <div className={stl.numberBox}>
            <span
              className={`${stl.outputSpan} ${
                +inputAmount * outputAmount > 0 ? stl.whiteSpan : ""
              }`}
            >
              {inputAmount
                ? Math.floor(+inputAmount * outputAmount).toLocaleString()
                : "0"}
            </span>
          </div>
        </div>
      </div>
      <button className={stl.swapCta}>Swap</button>
      <div className={stl.bottomBox}>
        <div className={stl.tokenBox}>
          <div className={stl.wrapper}>
            <img src="../Blastlogo.webp" alt="Blast" className={stl.logoIcon} />
            <span>BLASTOISE</span>
          </div>
          <div className={stl.priceBox}>
            <span className={stl.priceSpan}>${mainToken?.priceUsd}</span>
            <span
              className={`${stl.priceChange} ${
                mainToken?.priceChange?.h24 >= 0 ? "" : stl.redPrice
              }`}
            >
              24h {mainToken?.priceChange?.h24 >= 0 ? "+" : "-"}
              {mainToken?.priceChange?.h24}%
            </span>
          </div>
          <div className={stl.ctaBox}>
            <button
              onClick={() =>
                handleCopyAddress(
                  "BLASTOISE",
                  "0x8b87e80f234b9b78b7d2e477fa41734bfb4871f3"
                )
              }
            >
              <FaRegCopy className={stl.copyIcon} />
              Copy
            </button>
            <button
              onClick={() =>
                window.open(
                  "https://dex.9mm.pro/?chain=pulsechain&outputCurrency=0x31A4ffe71bFEADBDa769d4a3E03Bf4aE5c28EE31&inputCurrency=PLS",
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
                  "https://dexscreener.com/pulsechain/0x8b87e80f234b9b78b7d2e477fa41734bfb4871f3",
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
            <span>SQUIRTLE</span>
          </div>
          <div className={stl.priceBox}>
            <span className={stl.priceSpan}>${lpToken?.priceUsd}</span>
            <span
              className={`${stl.priceChange} ${
                lpToken?.priceChange?.h24 >= 0 ? "" : stl.redPrice
              }`}
            >
              24h {lpToken?.priceChange?.h24 >= 0 ? "+" : "-"}
              {lpToken?.priceChange?.h24}%
            </span>
          </div>
          <div className={stl.ctaBox}>
            <button
              onClick={() =>
                handleCopyAddress(
                  "SQUIRTLE",
                  "0xcfe221ebc120c1f4e78f82a1f2f4762dd7d269d0"
                )
              }
            >
              <FaRegCopy className={stl.copyIcon} />
              Copy
            </button>
            <button
              onClick={() =>
                window.open(
                  "https://dex.9mm.pro/?chain=pulsechain&outputCurrency=0x44de2D9EB4f3CB4131287D5C76C88c275139DA57&inputCurrency=PLS",
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
                  "https://dexscreener.com/pulsechain/0xcfe221ebc120c1f4e78f82a1f2f4762dd7d269d0",
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
    </div>
  );
};

export default Mint;
