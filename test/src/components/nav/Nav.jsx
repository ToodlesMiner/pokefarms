import { useEffect, useState } from "react";
import stl from "./Nav.module.css";
import { IoWalletOutline } from "react-icons/io5";

const Nav = ({ user, setUser }) => {
  const [hovered, setHovered] = useState(false);

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
      )}
    </nav>
  );
};

export default Nav;
