import React, { useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { ethers } from "ethers";
import axios from "axios";
import "./CreateConcertForm.css";

const PINATA_API_KEY = "3bf4164172fae7b68de3";
const PINATA_SECRET = "32288745dd22dabdcc87653918e33841ccfcfbd45c43a89709f873aedcc7c9fe";

const CreateConcertForm = ({ onCreated }) => {
  const { eventContract, address } = useWeb3();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    totalSupply: "",
    date: "",
    location: "", // Added location field
    artist: "" // Added artist field
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadToPinata = async () => {
    const formData = new FormData();
    formData.append("file", image);

    const imageRes = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxContentLength: "Infinity",
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET,
      },
    });

    const imageHash = imageRes.data.IpfsHash;
    const metadata = {
      name: form.name,
      description: form.description,
      image: `ipfs://${imageHash}`,
      attributes: [
        { trait_type: "Event Date", value: form.date },
        { trait_type: "Location", value: form.location }, // Added location to metadata
        { trait_type: "Artist", value: form.artist } // Added artist to metadata
      ],
    };

    const metadataRes = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      metadata,
      {
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET,
        },
      }
    );

    return `ipfs://${metadataRes.data.IpfsHash}`;
  };

  const createConcert = async (e) => {
    e.preventDefault();
    if (!eventContract || !address) return alert("Connect wallet first.");
    if (!image) return alert("Please upload an image.");

    try {
      setLoading(true);
      const metadataURI = await uploadToPinata();
      const timestamp = Math.floor(new Date(form.date).getTime() / 1000);

      console.log("eventContract:", eventContract);
      console.log("address:", address);

      const tx = await eventContract.createEvent(
        metadataURI,
        ethers.utils.parseEther(form.price),
        parseInt(form.totalSupply),
        timestamp
      );
      await tx.wait();

      alert("🎉 Concert created!");
      setForm({ name: "", description: "", price: "", totalSupply: "", date: "", location: "", artist: "" });
      setImage(null);
      if (onCreated) onCreated();
    } catch (err) {
      console.error("Create failed:", err);
      alert("❌ Failed to create concert.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={createConcert} className="concert-form">
      <input type="text" name="name" placeholder="Concert Name" value={form.name} onChange={updateField} required />
      <textarea name="description" placeholder="Concert Description" value={form.description} onChange={updateField} required />
      <input type="datetime-local" name="date" value={form.date} onChange={updateField} required />
      <input type="text" name="location" placeholder="Location" value={form.location} onChange={updateField} required />
      <input type="text" name="artist" placeholder="Artist" value={form.artist} onChange={updateField} required />
      <input type="number" name="price" placeholder="Ticket Price (ETH)" value={form.price} onChange={updateField} required />
      <input type="number" name="totalSupply" placeholder="Total Tickets" value={form.totalSupply} onChange={updateField} required />
      <input type="file" accept="image/*" onChange={handleImageChange} required />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "🚀 Launch Concert"}
      </button>
    </form>
  );
};

export default CreateConcertForm;
