import { useState, useEffect } from "react";
import stl from "./Mint.module.css";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdCandlestickChart } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { BsBank } from "react-icons/bs";
import { masterABI } from "../../../utils/MasterABI";
import { ethers } from "ethers";
import { ERC20ABI } from "../../../utils/ERC20ABI";
import MessageOverlay from "../messageoverlay/MessageOverlay";

const Mint = ({
  mainToken,
  lpToken,
  setSelectingFarm,
  emissionRate,
  pool,
  contract,
  user,
}) => {
  const [inputAmount, setInputAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [signer, setSigner] = useState(null);
  const [message, setMessage] = useState("");

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

  const handleSwap = async () => {
    if (!inputAmount || isNaN(inputAmount) || +inputAmount <= 0) {
      alert("Please enter a valid amount to mint.");
      return;
    }

    try {
      setLoading(true);
      const contractWithSigner = contract.connect(signer);
      const formattedAmount = ethers.parseUnits(inputAmount.toString(), 18);

      const tokenAContract = new ethers.Contract(pool.tokenA, ERC20ABI, signer);

      const hasApproved = localStorage.getItem("Approved");
      if (!hasApproved) {
        const approveTx = await tokenAContract.approve(
          pool.tokenB,
          (BigInt(100_000_000_000) * BigInt(1e18)).toString()
        );
        await approveTx.wait();
        localStorage.setItem("Approved", true);
      }

      // Call the mint function
      const tx = await contractWithSigner.mint(formattedAmount);
      console.log(`Transaction hash: ${tx.hash}`);

      // Wait for confirmation
      await tx.wait();
      setMessage(
        `Successfully Minted ${Number(
          inputAmount * emissionRate
        ).toLocaleString()} ${lpToken.baseToken.symbol}!`
      );

      setInputAmount("");
      setLoading(true);
      setTimeout(() => {
        setMessage("");
      }, 4500);
    } catch (err) {
      console.error("Minting failed:", err);
    } finally {
      setLoading(false); // End loading indicator
    }
  };

  return (
    <div className={stl.innerModal}>
      {message && <MessageOverlay submittedMessage={message} />}
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
      <button className={stl.swapCta} onClick={handleSwap}>
        {!loading && "Swap"}
        {loading && <img src="../Spinner.svg" alt="spinner" />}
      </button>
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
                handleCopyAddress(mainToken?.baseToken?.symbol, pool.LP0)
              }
            >
              <FaRegCopy className={stl.copyIcon} />
              Copy
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://dex.9mm.pro/swap?chain=pulsechain&inputCurrency=PLS&outputCurrency=${pool.tokenA}`,
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
                  `https://dexscreener.com/pulsechain/${pool.LP0}`,
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
                handleCopyAddress(lpToken?.baseToken?.symbol, pool.LP1)
              }
            >
              <FaRegCopy className={stl.copyIcon} />
              Copy
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://dex.9mm.pro/?chain=pulsechain&outputCurrency=${pool.tokenB}&inputCurrency=PLS`,
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
                  `https://dexscreener.com/pulsechain/${pool.LP1}`,
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
