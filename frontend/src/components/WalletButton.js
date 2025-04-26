import React from "react";
import { useWeb3 } from "../contexts/Web3Context";
import "./WalletButton.css";

const WalletButton = () => {
  const { address, connectWallet, disconnectWallet, isConnected } = useWeb3();

  const shorten = (addr) => addr.slice(0, 6) + "..." + addr.slice(-4);

  return (
    <div className="wallet-button-container">
      {!isConnected ? (
        <button className="connect-button" onClick={connectWallet}>
          ⚡ Connect Wallet
        </button>
      ) : (
        <div className="connected-info">
          <span className="wallet-address">{shorten(address)}</span>
          <button className="disconnect-button" onClick={disconnectWallet}>
            ✖ Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletButton;