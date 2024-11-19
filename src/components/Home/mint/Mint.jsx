import { useState } from "react";
import stl from "./Mint.module.css";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdCandlestickChart } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";

const Mint = () => {
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState(205.92);

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
          <span className={stl.priceSpan}>$0.00000093</span>
          <div className={stl.ctaBox}>
            <button>
              <FaRegCopy className={stl.copyIcon} />
              Copy Address
            </button>
            <button>
              <FaExchangeAlt className={stl.buyIcon} />
              Buy
            </button>
            <button>
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
          <span className={stl.priceSpan}>$0.00000243</span>
          <div className={stl.ctaBox}>
            <button>
              <FaRegCopy className={stl.copyIcon} />
              Copy Address
            </button>
            <button>
              <FaExchangeAlt className={stl.buyIcon} />
              Buy
            </button>
            <button>
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
