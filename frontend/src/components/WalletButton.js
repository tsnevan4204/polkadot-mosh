import React, { useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import LoadingSpinner from "./LoadingSpinner";
import "./WalletButton.css";

const WalletButton = () => {
  const { address, connectWallet, disconnectWallet, isConnected, role } = useWeb3();
  const [isConnecting, setIsConnecting] = useState(false);

  const shorten = (addr) => addr.slice(0, 6) + "..." + addr.slice(-4);
  
  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="wallet-button-container">
      {!isConnected ? (
        <button 
          className="connect-button" 
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <LoadingSpinner size="small" />
              <span className="connect-text">Connecting...</span>
            </>
          ) : (
            "⚡ Connect Wallet"
          )}
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
