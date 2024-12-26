import { useState, useEffect, useMemo} from "react";
import stl from "./Mint.module.css";
import { IoMdArrowRoundDown } from "react-icons/io";
import { MdCandlestickChart } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { ethers } from "ethers";
import { ERC20ABI } from "../../../utils/ERC20ABI";
import MessageOverlay from "../messageoverlay/MessageOverlay";
import { getTokenBalance } from "../../../utils/contractUtils";
import { formatInput } from "../../../utils/utils";

const Mint = ({
  pairA,
  pairB,
  setSelectingFarm,
  mintRatio,
  pool,
  contract,
  user,
  marketRatio,
  setUser,
  currentNetwork,
}) => {
  const [inputAmount, setInputAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [signer, setSigner] = useState(null);
  const [message, setMessage] = useState("");
  const [tokenABalance, setTokenABalance] = useState(0);
  const [tokenBBalance, setTokenBBalance] = useState(0);
  const [outputAmount, setOutputAmount] = useState("");

  const isHigherRatio = useMemo(() => mintRatio > marketRatio, [mintRatio, marketRatio]);
  // const isHigherRatio = useMemo(() => {
  //   return mintRatio > marketRatio;
  // }, [mintRatio, marketRatio]);

  useEffect(() => {
    const inputFormatted = inputAmount.replaceAll(",", "");
    setOutputAmount(inputFormatted);
  }, [inputAmount]);

  useEffect(() => {
    if (!user) return;

    const balanceFetcher = async () => {
      try {
        const tokenA = await getTokenBalance(
          pool.tokenA.address,
          user,
          currentNetwork.rpcUrl
        );
        setTokenABalance(tokenA);
      } catch (err) {
        setTokenABalance(0);
      }

      try {
        const tokenB = await getTokenBalance(
          pool.tokenB.address,
          user,
          currentNetwork.rpcUrl
        );
        setTokenBBalance(tokenB);
      } catch (err) {
        setTokenBBalance(0);
      }
    };
    balanceFetcher();
  }, [user, pool.tokenA.address, pool.tokenB.address]);

  useEffect(() => {
    if (!user) return;
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

  const handleMint = async () => {
    try {const isMintRatioHigher = useMemo(() => mintRatio > marketRatio, [mintRatio, marketRatio]);
      setLoading(true);

      const sanitizedAmount = inputAmount.replace(/,/g, "");

      if (!inputAmount || +sanitizedAmount > tokenABalance) {
        alert("Please enter valid input values.");
        return;
      }

      const formattedAmount = ethers.parseUnits(sanitizedAmount, 18);

      // Ensure contract and signer are properly initialized
      if (!contract || !signer) {
        throw new Error("Contract or signer is not initialized.");
      }

      const contractWithSigner = contract.connect(signer);
      console.log("contractWithSigner", contractWithSigner);

      const tokenAContract = new ethers.Contract(
        pool.tokenA.address,
        ERC20ABI,
        signer
      );

      const hasApproved = localStorage.getItem(
        `MintApproved:${pool.trainerContract}:${user}`
      );
      if (!hasApproved) {
        const approveTx = await tokenAContract.approve(
          pool.tokenB.address,
          (BigInt(100_000_000_000) * BigInt(1e18)).toString()
        );
        await approveTx.wait();
        localStorage.setItem(
          `MintApproved:${pool.trainerContract}:${user}`,
          true
        );
      }

      // After approval, proceed with minting
      const tx = await contractWithSigner.mint(formattedAmount);
      console.log("tx", tx);

      await tx.wait();

      setMessage(
        `Successfully Minted ${Number(
          outputAmount * mintRatio
        ).toLocaleString()} ${pairB.baseToken.symbol}!`
      );
      setInputAmount("");
    } catch (error) {
      console.error("Error during handleSwap:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request wallet connection
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        // Set the first account as the connected wallet
        setUser(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask to connect.");
    }
  };

  const formattedPriceInput = +inputAmount.replaceAll(",", "");

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
        <span className={`${stl.rate} ${isHigherRatio ? stl.greenHighlight : ''}`}>
          Mint: 1 {pool.tokenA.name} = {mintRatio} {pool.tokenB.name}
        </span>
        <span className={stl.rate}>
          DEX: 1 {pool.tokenA.name} = {marketRatio} {pool.tokenB.name}
        </span>
      </div>
      {/* <div className={stl.toprow}>
        <span className={stl.rate}>
          Mint: 1 {pool.tokenA.name} = {mintRatio} {pool.tokenB.name}
        </span>
        <span className={stl.rate}>
          DEX: 1 {pool.tokenA.name} = {marketRatio} {pool.tokenB.name}
        </span>
      </div> */}
      <div className={stl.swapWrap}>
        {user && (
          <span className={stl.balanceSpan}>
            Balance:{" "}
            <span className={stl.whiteSpan}>
              {tokenABalance.toLocaleString()}
            </span>{" "}
            {pool.tokenA.name}
          </span>
        )}
        <span>You're Freezing</span>
        <div className={stl.itemBox}>
          <div className={stl.itemWrap} onClick={() => setSelectingFarm(true)}>
            <img
              src={pool.dexTokenAImgUrl}
              alt="Main"
              className={stl.logoIcon}
            />
            <span>{pool.tokenA.name}</span>
          </div>
          <div className={stl.numberBox}>
            <input
              type="text"
              placeholder="0"
              className={`${stl.amountInput} ${
                +inputAmount > tokenABalance && user ? stl.redInput : ""
              }`}
              value={inputAmount}
              onChange={(e) => {
                const inputValue = e.target.value.replace(/,/g, ""); // Remove existing commas
                if (!isNaN(inputValue) || inputValue === "") {
                  const formattedValue = formatInput(event.target.value);
                  setInputAmount(formattedValue);
                }
              }}
            />
          </div>
        </div>
        {inputAmount && +formattedPriceInput * +pairA.priceUsd > 0.01 && (
          <span className={stl.dollarValue}>
            $
            {(+formattedPriceInput * +pairA.priceUsd).toLocaleString("en-US", {
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
            {pool.tokenB.name}
          </span>
        )}
        <span>You're Minting</span>
        <div className={stl.itemBox}>
          <div className={stl.itemWrap} onClick={() => setSelectingFarm(true)}>
            <img src={pool.dexTokenBImgUrl} alt="LP" className={stl.logoIcon} />
            <span>{pool.tokenB.name}</span>
          </div>
          <div className={stl.numberBox}>
            <span
              className={`${stl.outputSpan} ${
                +outputAmount * mintRatio > 0 ? stl.whiteBalance : ""
              }`}
            >
              {outputAmount
                ? Math.floor(+outputAmount * mintRatio).toLocaleString()
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
                src={pool.dexTokenAImgUrl}
                alt="Main"
                className={stl.logoIcon}
              />
              <span>{pool.tokenA.name}</span>
            </div>
            <div className={stl.priceBox}>
              <span className={stl.priceSpan}>${pairA?.priceUsd}</span>
              <span
                className={`${stl.priceChange} ${
                  pairA?.priceChange?.h24 >= 0 ? "" : stl.redPrice
                }`}
              >
                24h {pairA?.priceChange?.h24 >= 0 ? "+" : ""}
                {pairA?.priceChange?.h24}%
              </span>
            </div>
            <div className={stl.ctaBox}>
              <button
                onClick={() =>
                  handleCopyAddress(pool.tokenA.name, pool.tokenA.address)
                }
              >
                <FaRegCopy className={stl.copyIcon} />
                Copy
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://dex.9mm.pro/swap?chain=pulsechain&inputCurrency=PLS&outputCurrency=${pool.tokenA.address}`,
                    "_blank"
                  )
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
                src={pool.dexTokenBImgUrl}
                alt="Blast"
                className={stl.logoIcon}
              />
              <span>{pool.tokenB.name}</span>
            </div>
            <div className={stl.priceBox}>
              <span className={stl.priceSpan}>${pairB?.priceUsd}</span>
              <span
                className={`${stl.priceChange} ${
                  pairB?.priceChange?.h24 >= 0 ? "" : stl.redPrice
                }`}
              >
                24h {pairB?.priceChange?.h24 >= 0 ? "+" : ""}
                {pairB?.priceChange?.h24}%
              </span>
            </div>
            <div className={stl.ctaBox}>
              <button
                onClick={() =>
                  handleCopyAddress(pool.tokenB.name, pool.tokenB.address)
                }
              >
                <FaRegCopy className={stl.copyIcon} />
                Copy
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://dex.9mm.pro/?chain=pulsechain&outputCurrency=${pool.tokenB.address}&inputCurrency=PLS`,
                    "_blank"
                  )
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
      </div>
      <button
        className={stl.swapCta}
        onClick={user ? handleMint : connectWallet}
      >
        {!user && "Connect A Wallet"}
        {user && !loading && "Mint"}
        {user && loading && <img src="../Spinner.svg" alt="spinner" />}
      </button>
    </div>
  );
};

export default Mint;
