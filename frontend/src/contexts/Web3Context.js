import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import Ticket from "../abis/Ticket.json";
import EventManager from "../abis/EventManager.json";
import Marketplace from "../abis/Marketplace.json";
import { toast } from "react-hot-toast";

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [ticketContract, setTicketContract] = useState(null);
  const [eventContract, setEventContract] = useState(null);
  const [marketplaceContract, setMarketplaceContract] = useState(null);
  const [network, setNetwork] = useState(null);
  const [role, setRole] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    await _provider.send("eth_requestAccounts", []);
    const _signer = _provider.getSigner();
    const _address = await _signer.getAddress();
    const _network = await _provider.getNetwork();
    console.log("🛰 Connected to chain ID:", _network.chainId);

    const _ticket = new ethers.Contract(Ticket.address, Ticket.abi, _signer);
    const _event = new ethers.Contract(EventManager.address, EventManager.abi, _signer);
    const _marketplace = new ethers.Contract(Marketplace.address, Marketplace.abi, _signer);

    setProvider(_provider);
    setSigner(_signer);
    setAddress(_address);
    setNetwork(_network);
    setTicketContract(_ticket);
    setEventContract(_event);
    setMarketplaceContract(_marketplace);

    const savedRole = localStorage.getItem(`mosh-role-${_address}`);
    if (savedRole) {
      setRole(savedRole);
    } else {
      promptRoleSelection(_address);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setTicketContract(null);
    setEventContract(null);
    setMarketplaceContract(null);
    setNetwork(null);
    setRole(null);
  };

  const promptRoleSelection = (userAddress) => {
    toast((t) => (
      <span>
        🎭 Pick your role:
        <div style={{ marginTop: "8px" }}>
          <button onClick={() => selectRole('fan', userAddress, t.id)}>🎟 Fan</button>
          <button onClick={() => selectRole('musician', userAddress, t.id)}>🎤 Musician</button>
        </div>
      </span>
    ), { duration: Infinity });
  };

  const selectRole = (chosenRole, userAddress, toastId) => {
    setRole(chosenRole);
    localStorage.setItem(`mosh-role-${userAddress}`, chosenRole);
    toast.dismiss(toastId);
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      connectWallet();
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        address,
        network,
        connectWallet,
        disconnectWallet,
        ticketContract,
        eventContract,
        marketplaceContract,
        isConnected: !!signer,
        role,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
