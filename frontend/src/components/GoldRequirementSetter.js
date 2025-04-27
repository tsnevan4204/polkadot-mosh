import React, { useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import "./GoldRequirementSetter.css";

const GoldRequirementSetter = () => {
  const { goldRequirement, setGoldRequirement, role } = useWeb3();
  const [inputValue, setInputValue] = useState(goldRequirement || "");

  if (role !== "musician") return null; // Only musicians see this

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = parseInt(inputValue);
    if (isNaN(parsed) || parsed <= 0) {
      alert("Please enter a valid positive number");
      return;
    }
    setGoldRequirement(parsed);
    alert(`🎖 Gold Loyalty Requirement set to ${parsed} concerts!`);
  };

  return (
    <form onSubmit={handleSubmit} className="gold-requirement-form">
      <input
        type="number"
        min="1"
        placeholder="Gold Loyalty Events"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        required
      />
      <button type="submit">Set</button>
    </form>
  );
};

export default GoldRequirementSetter;