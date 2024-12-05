import CONFIG from "../../utils/config";
import { useEffect, useState } from "react";
import stl from "./Nav.module.css";
import { IoWalletOutline } from "react-icons/io5";

const Nav = ({ user, setUser }) => {
  const [hovered, setHovered] = useState(false);
  const [network, setNetwork] = useState("");

  const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setUser(accounts[0]);
  
          // Check the connected chain ID
          const currentChainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          const isMainnet = parseInt(currentChainId, 16) === parseInt(CONFIG.mainnet.chainId, 10);
          const isTestnet = parseInt(currentChainId, 16) === parseInt(CONFIG.testnet.chainId, 10);
  
          if (isMainnet) {
            setNetwork("PulseChain Mainnet");
          } else if (isTestnet) {
            setNetwork("PulseChain Testnet");
          } else {
            alert("Unsupported network. Please switch to PulseChain");
            setNetwork("Unsupported");
          }
  
          // Listen for account changes
          window.ethereum.on("accountsChanged", (newAccounts) => {
            if (newAccounts.length === 0) {
              alert("Wallet disconnected.");
              setUser("");
            } else {
              setUser(newAccounts[0]);
            }
          });
  
          // Listen for chain changes
          window.ethereum.on("chainChanged", (newChainId) => {
            const isMainnet = parseInt(newChainId, 16) === parseInt(CONFIG.mainnet.chainId, 10);
            const isTestnet = parseInt(newChainId, 16) === parseInt(CONFIG.testnet.chainId, 10);
  
            if (isMainnet) {
              setNetwork("PulseChain Mainnet");
            } else if (isTestnet) {
              setNetwork("PulseChain Testnet");
            } else {
              alert("Unsupported network. Please switch to PulseChain Mainnet or Testnet.");
              setNetwork("Unsupported");
            }
          });
        } catch (error) {
          console.error("Error connecting wallet:", error);
        }
      } else {
        alert("MetaMask is not installed. Please install MetaMask to connect.");
      }
    };

  const disconnectWallet = () => {
    setUser("");
  };

  const chainChangedHandler = () => {
    window.location.reload();
  };

  window.ethereum.on("accountsChanged", (accounts) => {
    setUser(accounts[0]);
  });
  window.ethereum.on("chainChanged", chainChangedHandler);

  return (
  <nav className={stl.nav}>
    {!user && (
      <button onClick={connectWallet} className={stl.connectButton}>
        <>Connect Wallet</>
      </button>
    )}
    {user && (
      <>
        <button
          onClick={disconnectWallet}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={stl.disconnectButton}
        >
          <>
            {hovered ? (
              <>
                <IoWalletOutline />
                <span className={stl.disconnectSpan}>Disconnect</span>
              </>
            ) : (
              <>
                <IoWalletOutline />
                {user.slice(0, 6)}...{user.slice(-4)}
              </>
            )}
          </>
        </button>

        {/* Indicate network */}
        {network && (
          <div className={stl.networkInfo}>
            <span className={network === "PulseChain Testnet" ? stl.testnetIndicator : ""}>
              {network}
            </span>
          </div>
        )}
      </>
    )}
  </nav>
);
};

export default Nav;
