import React, { useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { toast } from "react-hot-toast";
import "./ArtistRegistrationForm.css";

const ArtistRegistrationForm = ({ onComplete }) => {
  const [form, setForm] = useState({
    artistName: "",
    goldRequirement: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "goldRequirement" ? parseInt(value) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.artistName.trim()) {
      toast.error("Please enter your artist name");
      return;
    }

    const goldReq = parseInt(form.goldRequirement);
    if (isNaN(goldReq) || goldReq < 0) {
      toast.error("Gold requirement must be a non-negative number");
      return;
    }

    onComplete(form.artistName, goldReq);
  };

  return (
    <div className="artist-registration-container">
      <h2>🎤 Complete your Artist Profile</h2>
      <p className="subtitle">Set your loyal fan requirements before creating concerts</p>
      
      <form onSubmit={handleSubmit} className="artist-form">
        <div className="form-group">
          <label htmlFor="artistName">Artist/Band Name</label>
          <input 
            type="text"
            id="artistName"
            name="artistName"
            value={form.artistName}
            onChange={handleChange}
            placeholder="Enter your artist name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="goldRequirement">
            Gold Tier Requirement 
            <span className="tooltip" title="How many concerts fans need to attend to reach Gold status">ⓘ</span>
          </label>
          <input 
            type="number"
            id="goldRequirement"
            name="goldRequirement"
            value={form.goldRequirement}
            onChange={handleChange}
            min="0"
            placeholder="0"
          />
          <p className="input-help">
            Minimum concerts required for fans to reach Gold status.
            <br/> 
            (Set to 0 to disable the loyalty program)
          </p>
        </div>

        <button type="submit" className="submit-button">
          Complete Registration
        </button>
      </form>
    </div>
  );
};

export default ArtistRegistrationForm;