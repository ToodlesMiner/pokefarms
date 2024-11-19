import { useState } from "react";
import stl from "./Mint.module.css";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdCandlestickChart } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { BsBank } from "react-icons/bs";

const Mint = ({ blastoiseData, squirtleData }) => {
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
        <span className={stl.rate}>1 Blastoise = {outputAmount} Squirtle</span>
        <IoMdInformationCircleOutline className={stl.info} />
      </div>
      <div className={stl.swapWrap}>
        <span>You're Freezing</span>
        <div className={stl.itemBox}>
          <div className={stl.itemWrap}>
            <img src="../Blastlogo.webp" alt="Blast" className={stl.logoIcon} />
            <span>Blastoise</span>
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
          <div className={stl.itemWrap}>
            <img
              src="../Squirtlogo.webp"
              alt="Blast"
              className={stl.logoIcon}
            />
            <span>Squirtle</span>
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
            <span>Blastoise</span>
          </div>
          <div className={stl.priceBox}>
            <span className={stl.priceSpan}>${blastoiseData?.priceUsd}</span>
            <span
              className={`${stl.priceChange} ${
                blastoiseData?.priceChange?.h24 >= 0 ? "" : stl.redPrice
              }`}
            >
              24h {blastoiseData?.priceChange?.h24 >= 0 ? "+" : "-"}
              {blastoiseData?.priceChange?.h24}%
            </span>
          </div>
          <div className={stl.ctaBox}>
            <button
              onClick={() =>
                handleCopyAddress(
                  "Blastoise",
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
            <span>Squirtle</span>
          </div>
          <div className={stl.priceBox}>
            <span className={stl.priceSpan}>${squirtleData?.priceUsd}</span>
            <span
              className={`${stl.priceChange} ${
                squirtleData?.priceChange?.h24 >= 0 ? "" : stl.redPrice
              }`}
            >
              24h {squirtleData?.priceChange?.h24 >= 0 ? "+" : "-"}
              {squirtleData?.priceChange?.h24}%
            </span>
          </div>
          <div className={stl.ctaBox}>
            <button
              onClick={() =>
                handleCopyAddress(
                  "Squirtle",
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
      {/* <div className={stl.vaultStats}>
        <div>
          <BsBank />
          <span className={stl.reserves}>Reserves</span>
        </div>
        <div className={stl.col}>
          <span>Balance</span>
          <span className={stl.valueSpan}>501,340 Blastoise</span>
        </div>
        <div className={stl.col}>
          <span>USD Value</span>
          <span className={stl.valueSpan}>$12,431</span>
        </div>
      </div> */}
    </div>
  );
};

export default Mint;
