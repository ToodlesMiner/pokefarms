import Nav from "../nav/Nav";
import stl from "./Home.module.css";
import { useEffect, useState } from "react";
import { IoLayersOutline } from "react-icons/io5";
import { GiMiner } from "react-icons/gi";
import Mint from "./mint/Mint";
import Stake from "./stake/Stake";
import ChooseFarm from "./choosefarm/ChooseFarm";
import { ethers } from "ethers";
import { masterABI } from "../../utils/MasterABI";

const poolData = [
  {
    contractName: "Blastoise-Squirtle",
    parentContract: "0x09a454D9cfA1602F658b000d7e10d715D4A8D857",
    LP0: "0x8b87e80f234b9b78b7d2e477fa41734bfb4871f3",
    LP1: "0xCFE221EBC120c1F4e78f82a1F2F4762DD7d269d0",
    LP2: "0x678de045552Fe88a9851fef48e52240C9e924690",
    tokenA: "0x31A4ffe71bFEADBDa769d4a3E03Bf4aE5c28EE31", // BLastoise
    tokenB: "0x44de2D9EB4f3CB4131287D5C76C88c275139DA57", // Squirtle
    dexMainTokenImgUrl:
      "https://dd.dexscreener.com/ds-data/tokens/pulsechain/0x31a4ffe71bfeadbda769d4a3e03bf4ae5c28ee31.png?size=lg&key=19ffe5",
    dexLpTokenImgUrl:
      "https://dd.dexscreener.com/ds-data/tokens/pulsechain/0x44de2d9eb4f3cb4131287d5c76c88c275139da57.png?size=lg&key=61cf87",
  },
];

const Home = () => {
  const [pool, setPool] = useState(poolData[0]);
  const [selectingFarm, setSelectingFarm] = useState(false);
  const [user, setUser] = useState("");
  const [activeMenu, setActiveMenu] = useState("Mint");
  const [mainToken, setMainToken] = useState({});
  const [lpToken, setLPToken] = useState({});
  const [emissionRate, setEmissionRate] = useState(null);
  const [conversionRate, setConversionRate] = useState();

  const contract = new ethers.Contract(
    pool.parentContract,
    masterABI,
    new ethers.JsonRpcProvider("https://rpc.pulsechain.com")
  );

  //Initialize app
  useEffect(() => {
    const initialize = async () => {
      const emission = Number(await contract.calculateRatio());
      const truncEmission = +emission.toString().slice(0, 3);
      setEmissionRate(truncEmission);

      // Token A
      const mainTokenRequest = await fetch(
        `https://api.dexscreener.com/latest/dex/pairs/pulsechain/${pool.LP0}`
      );
      const mainTokenResponse = await mainTokenRequest.json();
      console.log(mainTokenResponse);
      setMainToken(mainTokenResponse.pairs[0]);

      // token B
      const lpTokenRequest = await fetch(
        `https://api.dexscreener.com/latest/dex/pairs/pulsechain/${pool.LP1}`
      );
      const lpTokenResponse = await lpTokenRequest.json();
      setLPToken(lpTokenResponse.pairs[0]);

      const tokenAPrice = +mainTokenResponse.pairs[0].priceUsd;
      const tokenBPrice = +lpTokenResponse.pairs[0].priceUsd;
      console.log(tokenAPrice / tokenBPrice);
      setConversionRate(Math.floor(tokenAPrice / tokenBPrice));

      // Pulse price
      // const pulsePriceRequest = await fetch(
      //   `https://api.dexscreener.com/latest/dex/pairs/pulsechain/${PLS_ADDRESS}`
      // );
      // const pulseResponse = await pulsePriceRequest.json();
      // console.log(pulseResponse);
      // setLPToken(lpTokenResponse.pairs[0]);
    };
    initialize();
  }, []);

  useEffect(() => {
    console.log(mainToken);
  }, [mainToken]);

  return (
    <div className={stl.home}>
      <Nav user={user} setUser={setUser} />
      <img src="../Logo.png" alt="Mainlogo" className={stl.mainLogo} />
      {selectingFarm && (
        <ChooseFarm
          poolData={poolData}
          setSelectingFarm={setSelectingFarm}
          setPool={setPool}
        />
      )}
      <div className={stl.mainApp}>
        <div className={stl.toggleBox}>
          <button
            className={activeMenu === "Mint" ? stl.activeButton : ""}
            onClick={() => setActiveMenu("Mint")}
          >
            <GiMiner className={stl.miner} />
            Mint
          </button>
          <button
            className={activeMenu === "Stake" ? stl.activeButton : ""}
            onClick={() => setActiveMenu("Stake")}
          >
            <IoLayersOutline className={stl.stake} />
            Stake
          </button>
        </div>
        <div className={stl.modal}>
          {activeMenu === "Mint" && (
            <Mint
              mainToken={mainToken}
              lpToken={lpToken}
              pool={pool}
              setSelectingFarm={setSelectingFarm}
              emissionRate={emissionRate}
              contract={contract}
              user={user}
              conversionRate={conversionRate}
              setUser={setUser}
            />
          )}
          {activeMenu === "Stake" && (
            <Stake
              mainToken={mainToken}
              lpToken={lpToken}
              pool={pool}
              user={user}
              contract={contract}
              setUser={setUser}
            />
          )}
          {/* <img
            src="../Squirtlogo.webp"
            alt="Blast"
            className={stl.blastCorner}
          /> */}
        </div>
        {/* <iframe
          className={stl.frame}
          src="https://dex.9mm.pro/?chain=pulsechain"
          title="DEX on PulseChain"
        ></iframe> */}
      </div>

      <img src="../bg.png" alt="Forrest" className={stl.forrestBG} />
    </div>
  );
};

export default Home;

/* Thats the only ABI I think youll need. 

"mint" for minting
"calculateRatio" is how you will get the currant minting ratio
''pendingReward" used in the LP pools to see the pending reward.  it take two inputs pid (for pool ID from 0-2) and user the connected wallet addy

"deposit" requires Pool ID and an amount
"withdraw" same thing. this is also used to claim reward. I just set the amount to 0 on the withdraw

I think that's all you'll need.

For the Pool IDs 0 is Blastoise/PLS 1 is Squirtle/PLS and 2 is Blastoise/Squirtle */

/* 0x31a4ffe71bfeadbda769d4a3e03bf4ae5c28ee31 TokenA

0x44de2D9EB4f3CB4131287D5C76C88c275139DA57 TokenB

0x09a454D9cfA1602F658b000d7e10d715D4A8D857 TrainerContract */

/*0xCFE221EBC120c1F4e78f82a1F2F4762DD7d269d0 is actually LP theres more then one LP though to keep it consistent with the contract call that one LP1

LP0: 0x8b87e80f234b9b78b7d2e477fa41734bfb4871f3

LP1: 0xCFE221EBC120c1F4e78f82a1F2F4762DD7d269d0

LP2: 0x678de045552Fe88a9851fef48e52240C9e924690 */
