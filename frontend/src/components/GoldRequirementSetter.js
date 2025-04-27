import React, { useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { toast } from "react-hot-toast";
import "./GoldRequirementSetter.css";

const GoldRequirementSetter = () => {
  const { goldRequirement, setGoldRequirement, role, address, artistName } = useWeb3();
  const [inputValue, setInputValue] = useState(goldRequirement || 0);

  if (role !== "musician") return null; // Only musicians see this

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = parseInt(inputValue);
    if (isNaN(parsed) || parsed < 0) {
      toast.error("Please enter a valid positive number");
      return;
    }
    
    // Update in context
    setGoldRequirement(parsed);
    
    // Also save to localStorage
    if (address) {
      localStorage.setItem(`mosh-gold-req-${address}`, parsed.toString());
    }
    
    toast.success(`Gold status now requires ${parsed} concert${parsed === 1 ? '' : 's'}`);
  };

  return (
    <form onSubmit={handleSubmit} className="gold-requirement-form">
      <span className="artist-name">{artistName}</span>
      <div className="input-group">
        <input
          type="number"
          min="0"
          placeholder="Gold requirement"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          required
        />
        <button type="submit">Update Requirement</button>
      </div>
    </form>
  );
};

export default GoldRequirementSetter;