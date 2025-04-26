import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Web3Provider } from "./contexts/Web3Context";
import Navbar from "./components/Navbar";
import BrowseEvents from "./pages/BrowseEvents";
import ManageConcerts from "./pages/ManageConcerts";
import ManageTickets from "./pages/ManageTickets";
import RefundTrackerPage from "./pages/RefundTrackerPage";
import MarketplacePage from "./pages/MarketplaceView";
import { Toaster } from 'react-hot-toast';


const App = () => {
  return (
    <Web3Provider>
      <Toaster />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<BrowseEvents />} />
          <Route path="/manage-tickets" element={<ManageTickets />} />
          <Route path="/manage-concerts" element={<ManageConcerts />} />
          <Route path="/debug/refunds" element={<RefundTrackerPage />} />
          <Route path="/marketplace/:eventId" element={<MarketplacePage />} />
        </Routes>
      </Router>
    </Web3Provider>
  );
};

export default App;