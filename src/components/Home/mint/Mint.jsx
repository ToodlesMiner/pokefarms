import { useState, useEffect } from "react";
import stl from "./Mint.module.css";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdCandlestickChart } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { BsBank } from "react-icons/bs";
import { ethers } from "ethers";
import { ERC20ABI } from "../../../utils/ERC20ABI";
import MessageOverlay from "../messageoverlay/MessageOverlay";
import { getTokenBalance } from "../../../utils/contractUtils";
import { getInnerPoolBalance } from "../../../utils/contractUtils";

const Mint = ({
  mainToken,
  lpToken,
  setSelectingFarm,
  emissionRate,
  pool,
  contract,
  user,
  conversionRate,
}) => {
  const [inputAmount, setInputAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [signer, setSigner] = useState(null);
  const [message, setMessage] = useState("");
  const [tokenABalance, setTokenABalance] = useState(0);
  const [tokenBBalance, setTokenBBalance] = useState(0);

  useEffect(() => {
    if (!user) return;

    const balanceFetcher = async () => {
      const tokenA = await getTokenBalance(pool.tokenA, user);
      setTokenABalance(tokenA);

      const tokenB = await getTokenBalance(pool.tokenB, user);
      setTokenBBalance(tokenB);
    };
    balanceFetcher();
  }, [user]);

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
    if (!inputAmount || +inputAmount > tokenABalance) {
      alert("Please enter correct values.");
      return;
    }

    try {
      setLoading(true);
      const contractWithSigner = contract.connect(signer);
      const formattedAmount = ethers.parseUnits(inputAmount.toString(), 18);

      const tokenAContract = new ethers.Contract(pool.tokenA, ERC20ABI, signer);

      const hasApproved = localStorage.getItem("MintApproved");
      if (!hasApproved) {
        const approveTx = await tokenAContract.approve(
          pool.tokenB,
          (BigInt(100_000_000_000) * BigInt(1e18)).toString()
        );
        await approveTx.wait();
        localStorage.setItem("MintApproved", true);
      }

      const tx = await contractWithSigner.mint(formattedAmount);
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
      {loading && (
        <div className={stl.loadOverlay}>
          <img
            src="Pika.gif"
            alt="Pika"
            className={`${stl.pika} ${Math.random() > 0.5 ? stl.rotate : ""}`}
          />
          <h2>Minting...</h2>
          <div className={stl.grassBg}></div>
        </div>
      )}
      {message && <MessageOverlay submittedMessage={message} />}
      <div className={stl.toprow}>
        <span className={stl.rate}>
          Mint: 1 {mainToken?.baseToken?.symbol} = {emissionRate}{" "}
          {lpToken?.baseToken?.symbol}
        </span>
        <IoMdInformationCircleOutline className={stl.info} />
      </div>
      <div className={stl.swapWrap}>
        {user && (
          <span className={stl.balanceSpan}>
            Balance:{" "}
            <span className={stl.whiteSpan}>
              {tokenABalance.toLocaleString()}
            </span>{" "}
            {mainToken.baseToken.symbol}
          </span>
        )}
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
              className={`${stl.amountInput} ${
                +inputAmount > tokenABalance && user ? stl.redInput : ""
              }`}
              value={inputAmount}
              onInput={(e) => {
                const inputValue = e.target?.value;
                if (/^\d*\.?\d*$/.test(inputValue)) {
                  setInputAmount(inputValue);
                }
              }}
            />
          </div>
        </div>
        {inputAmount && +inputAmount * +mainToken.priceUsd > 0.01 && (
          <span className={stl.dollarValue}>
            $
            {(+inputAmount * +mainToken.priceUsd).toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </span>
        )}
      </div>

      <IoMdArrowRoundDown className={stl.swapArrow} />
      <div className={stl.swapWrap}>
        {user && (
          <span className={stl.balanceSpan}>
            Balance:{" "}
            <span className={stl.whiteSpan}>
              {tokenBBalance.toLocaleString()}
            </span>{" "}
            {lpToken.baseToken.symbol}
          </span>
        )}
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
                +inputAmount * emissionRate > 0 ? stl.whiteBalance : ""
              }`}
            >
              {inputAmount
                ? Math.floor(+inputAmount * emissionRate).toLocaleString()
                : "0"}
            </span>
          </div>
        </div>
      </div>

      <div className={stl.bottomBox}>
        <div className={stl.boxWrapper}>
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
                  (window.location.href = `https://dex.9mm.pro/swap?chain=pulsechain&inputCurrency=PLS&outputCurrency=${pool.tokenA}`)
                }
              >
                <FaExchangeAlt className={stl.buyIcon} />
                Buy
              </button>
              <button
                onClick={() =>
                  (window.location.href = `https://dexscreener.com/pulsechain/${pool.LP0}`)
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
                  (window.location.href = `https://dex.9mm.pro/?chain=pulsechain&outputCurrency=${pool.tokenB}&inputCurrency=PLS`)
                }
              >
                <FaExchangeAlt className={stl.buyIcon} />
                Buy
              </button>
              <button
                onClick={() =>
                  (window.location.href = `https://dexscreener.com/pulsechain/${pool.LP1}`)
                }
              >
                <MdCandlestickChart />
                Chart
              </button>
            </div>
          </div>
        </div>
        <div
          className={stl.dexRate}
          onClick={() =>
            (window.location.href = `https://dex.9mm.pro/swap?chain=pulsechain&inputCurrency=${pool.tokenA}&outputCurrency=${pool.tokenB}`)
          }
        >
          9mm Swap: 1 {mainToken?.baseToken?.symbol} = {conversionRate}~{" "}
          {lpToken?.baseToken?.symbol}
        </div>
      </div>
      <button className={stl.swapCta} onClick={handleSwap}>
        {!user && "Connect A Wallet"}
        {user && !loading && "Mint"}
        {user && loading && <img src="../Spinner.svg" alt="spinner" />}
      </button>
    </div>
  );
};

export default Mint;
