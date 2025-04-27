import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import Ticket from "../abis/Ticket.json";
import EventManager from "../abis/EventManager.json";
import Marketplace from "../abis/Marketplace.json";
import { toast } from "react-hot-toast";
import ArtistRegistrationForm from "../components/ArtistRegistrationForm";
import axios from "axios";

const PINATA_API_KEY = "3bf4164172fae7b68de3";
const PINATA_SECRET = "32288745dd22dabdcc87653918e33841ccfcfbd45c43a89709f873aedcc7c9fe";

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
  const [showArtistForm, setShowArtistForm] = useState(false);
  
  // Artist specific states
  const [artistName, setArtistName] = useState(null);
  const [goldRequirement, setGoldRequirement] = useState(0);
  // Cache for artist profiles (address -> {name, goldRequirement})
  const [artistProfiles, setArtistProfiles] = useState({});

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

    // Load saved user role from localStorage
    // We'll still use localStorage for the role since it's just a UI preference
    const savedRole = localStorage.getItem(`mosh-role-${_address}`);
    
    if (savedRole) {
      setRole(savedRole);
      
      // If they're an artist, try to fetch their profile from their most recent event
      if (savedRole === "musician") {
        try {
          const profile = await fetchArtistProfile(_address, _event);
          if (profile) {
            setArtistName(profile.name);
            setGoldRequirement(profile.goldRequirement);
          }
        } catch (err) {
          console.error("Failed to load artist profile:", err);
          // If we can't load profile, prompt to create one
          setShowArtistForm(true);
        }
      }
    } else {
      promptRoleSelection(_address);
    }
  };

  // Fetch artist profile from their most recent event or from cache
  const fetchArtistProfile = async (artistAddress, eventContract) => {
    // Check cache first
    if (artistProfiles[artistAddress]) {
      return artistProfiles[artistAddress];
    }

    try {
      // Get total events
      const totalEvents = await eventContract.nextEventId();
      
      // Loop through events to find one by this artist
      for (let i = totalEvents - 1; i >= 0; i--) {
        const event = await eventContract.events(i);
        
        // If this is an event by the artist
        if (event.organizer.toLowerCase() === artistAddress.toLowerCase()) {
          // Get the metadata from IPFS
          const metadataURI = event.metadataURI.replace("ipfs://", "https://ipfs.io/ipfs/");
          const response = await axios.get(metadataURI);
          
          // Find the Artist attribute
          const artistAttr = response.data.attributes.find(attr => 
            attr.trait_type === "Artist Name"
          );
          
          if (artistAttr) {
            const profile = {
              name: artistAttr.value,
              goldRequirement: event.goldRequirement.toNumber()
            };
            
            // Cache the result
            setArtistProfiles(prev => ({
              ...prev,
              [artistAddress]: profile
            }));
            
            return profile;
          }
        }
      }
    } catch (err) {
      console.error("Error fetching artist profile:", err);
    }
    
    return null;
  };
  
  // Function to get artist name by address (for any component that needs it)
  const getArtistName = async (artistAddress) => {
    if (!artistAddress || !eventContract) return "Unknown Artist";
    
    try {
      const profile = await fetchArtistProfile(artistAddress, eventContract);
      return profile?.name || "Unknown Artist";
    } catch (err) {
      console.error("Failed to get artist name:", err);
      return "Unknown Artist";
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
    setArtistName(null);
    setGoldRequirement(0); // Reset to default
  };

  const promptRoleSelection = (userAddress) => {
    toast((t) => (
      <span>
        🎭 Pick your role:
        <div style={{ marginTop: "8px" }}>
          <button onClick={() => selectRole('fan', userAddress, t.id)}>🎟 Fan</button>
          <button onClick={() => handleMusicianSelect(userAddress, t.id)}>🎤 Musician</button>
        </div>
      </span>
    ), { duration: Infinity });
  };

  const selectRole = (chosenRole, userAddress, toastId) => {
    setRole(chosenRole);
    localStorage.setItem(`mosh-role-${userAddress}`, chosenRole);
    toast.dismiss(toastId);
  };

  const handleMusicianSelect = (userAddress, toastId) => {
    // First dismiss the role selection toast
    toast.dismiss(toastId);
    
    // Show the artist registration form
    setShowArtistForm(true);
  };

  // Upload artist profile to IPFS
  const uploadArtistProfile = async (name, goldReq) => {
    if (!address) return null;
    
    try {
      // Create artist profile JSON
      const artistProfile = {
        name: name,
        goldRequirement: goldReq,
        address: address,
        createdAt: new Date().toISOString()
      };
      
      // Upload to IPFS via Pinata
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        artistProfile,
        {
          headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET,
          },
        }
      );
      
      return `ipfs://${response.data.IpfsHash}`;
    } catch (err) {
      console.error("Failed to upload artist profile:", err);
      return null;
    }
  };

  const completeArtistRegistration = async (name, goldReq) => {
    if (!address || !eventContract) return;
    
    try {
      // First register as musician on the contract
      const tx = await eventContract.registerAsMusician();
      await tx.wait();
      
      // Save artist profile info locally for this session
      setArtistName(name);
      setGoldRequirement(goldReq);
      setRole("musician");
      
      // Store role in localStorage (just for UI purposes)
      localStorage.setItem(`mosh-role-${address}`, "musician");
      
      // Store gold requirement in localStorage to persist across sessions
      localStorage.setItem(`mosh-gold-req-${address}`, goldReq.toString());
      
      // Cache the profile
      setArtistProfiles(prev => ({
        ...prev,
        [address]: { name, goldRequirement: goldReq }
      }));
      
      // Hide the form
      setShowArtistForm(false);
      
      toast.success(`Welcome, ${name}! Your gold loyalty tier is set to ${goldReq} concerts.`);
    } catch (err) {
      console.error("Artist registration failed:", err);
      toast.error("Registration failed. Please try again.");
    }
  };

  // Update gold requirement in user profile and cache
  const updateGoldRequirement = (value) => {
    setGoldRequirement(value);
    
    // Update cache so future events can access the latest requirement
    if (address && artistName) {
      setArtistProfiles(prev => ({
        ...prev,
        [address]: { 
          ...prev[address],
          goldRequirement: value 
        }
      }));
      
      // Store in localStorage to persist across sessions
      localStorage.setItem(`mosh-gold-req-${address}`, value.toString());
    }
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      connectWallet();
    }
  }, []);

  // Load gold requirement from localStorage on initial load
  useEffect(() => {
    if (address && role === "musician") {
      const savedGoldReq = localStorage.getItem(`mosh-gold-req-${address}`);
      if (savedGoldReq) {
        const parsedReq = parseInt(savedGoldReq);
        if (!isNaN(parsedReq)) {
          setGoldRequirement(parsedReq);
          
          // Update cache
          if (artistName) {
            setArtistProfiles(prev => ({
              ...prev,
              [address]: { 
                ...prev[address],
                goldRequirement: parsedReq 
              }
            }));
          }
        }
      }
    }
  }, [address, role, artistName]);

  // If artist form needs to be displayed, render it as a modal overlay
  if (showArtistForm) {
    return (
      <div className="artist-form-overlay">
        <ArtistRegistrationForm onComplete={completeArtistRegistration} />
      </div>
    );
  }

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
        artistName,
        goldRequirement,
        setGoldRequirement: updateGoldRequirement,
        getArtistName,
        fetchArtistProfile,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
