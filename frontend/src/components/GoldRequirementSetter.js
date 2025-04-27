import React, { useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { toast } from "react-hot-toast";
import "./GoldRequirementSetter.css";

const GoldRequirementSetter = () => {
  const { goldRequirement, setGoldRequirement, role, address, artistName, eventContract } = useWeb3();
  const [inputValue, setInputValue] = useState(goldRequirement || 0);
  const [isUpdating, setIsUpdating] = useState(false);

  if (role !== "musician") return null; // Only musicians see this

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsed = parseInt(inputValue);
    if (isNaN(parsed) || parsed < 0) {
      toast.error("Please enter a valid positive number");
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // Update in context
      setGoldRequirement(parsed);
      
      // Also save to localStorage for UI purposes
      if (address) {
        localStorage.setItem(`mosh-gold-req-${address}`, parsed.toString());
      }
      
      // The gold requirement will be applied to all future events created by this artist
      // No need for a separate contract function as the requirement is set per event
      // during event creation
      
      toast.success(`Gold status now requires ${parsed} concert${parsed === 1 ? '' : 's'}`);
    } catch (error) {
      console.error("Failed to update gold requirement:", error);
      toast.error("Failed to update gold requirement");
    } finally {
      setIsUpdating(false);
    }
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
          disabled={isUpdating}
        />
        <button type="submit" disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update Requirement"}
        </button>
      </div>
    </form>
  );
};

export default GoldRequirementSetter;