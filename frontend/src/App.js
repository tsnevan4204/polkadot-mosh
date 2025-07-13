import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Web3Provider } from "./contexts/Web3Context";
import Navbar from "./components/Navbar";
import BrowseEvents from "./pages/BrowseEvents";
import ManageConcerts from "./pages/ManageConcerts";
import ManageTickets from "./pages/ManageTickets";
import MarketplacePage from "./pages/MarketplaceView";
import { Toaster } from "react-hot-toast";
import { PrivyProvider } from "@privy-io/react-auth";

function App() {
  return (
    <PrivyProvider
      appId="cmc5nuuwd00rggs0nfmf9umw9"
      config={{
        // Customize login methods
        loginMethods: ["email", "google", "twitter", "discord", "wallet"],
        // Customize appearance
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
        },
        // Automatically create wallets for users
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          requireUserPasswordOnCreate: false, // No password needed for easier UX
        },
        // Enable Smart Wallet with session keys AND gas sponsorship
        smartWallet: {
          createOnLogin: "users-without-wallets",
          // Gas sponsorship configuration
          gasSponsorship: {
            enabled: true,
            // Sponsor gas for your contracts
            sponsorshipPolicies: [
              {
                // Sponsor all transactions to your contracts
                contractAddresses: [
                  "0xD3C9A8671796da0cB8dDefb16E4773F812613048", // EventManager
                  "0xA7827d4B26A38079B384F3eab098BdEfF58C4BB8", // Ticket
                  "0x416222FC558f92606a43194DEd31C1dB6532298B", // Marketplace
                ],
                // Sponsor specific methods
                functionSelectors: [
                  "0x67dd74ca", // buyTicket
                  "0x8da5cb5b", // resellTicket (example)
                  "0xa22cb465", // transferFrom
                ],
                // Spending limits per user
                spendingLimits: {
                  perUser: "0.1", // 0.1 DEV per user
                  perTransaction: "0.01", // 0.01 DEV per transaction
                  timeWindow: 3600, // 1 hour window
                },
              },
            ],
          },
          // Session keys for seamless interactions
          sessionKeys: {
            enabled: true,
            // Auto-approve transactions under these limits
            spendLimits: {
              DEV: "1.0", // 1 DEV per session (adjust as needed)
            },
            // Session duration (1 hour)
            sessionDuration: 3600,
            // Your deployed contracts that can use session keys
            allowedContracts: [
              "0xD3C9A8671796da0cB8dDefb16E4773F812613048", // EventManager
              "0xA7827d4B26A38079B384F3eab098BdEfF58C4BB8", // Ticket
              "0x416222FC558f92606a43194DEd31C1dB6532298B", // Marketplace
            ],
            // Specific operations allowed
            allowedMethods: [
              "buyTicket",
              "resellTicket",
              "transferTicket",
              "cancelResale",
            ],
          },
        },
        // Force Moonbase Alpha network (where your contracts are deployed)
        defaultChain: {
          id: 1287,
          name: "Moonbase Alpha",
          network: "moonbase-alpha",
          nativeCurrency: { name: "DEV", symbol: "DEV", decimals: 18 },
          rpcUrls: {
            default: { http: ["https://rpc.api.moonbase.moonbeam.network"] },
          },
          blockExplorers: {
            default: { name: "Moonscan", url: "https://moonbase.moonscan.io" },
          },
        },
        supportedChains: [
          {
            id: 1287,
            name: "Moonbase Alpha",
            network: "moonbase-alpha",
            nativeCurrency: { name: "DEV", symbol: "DEV", decimals: 18 },
            rpcUrls: {
              default: { http: ["https://rpc.api.moonbase.moonbeam.network"] },
            },
            blockExplorers: {
              default: {
                name: "Moonscan",
                url: "https://moonbase.moonscan.io",
              },
            },
          },
        ],
      }}
    >
      <Web3Provider>
        <div className="App">
          <Toaster position="top-right" />
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<BrowseEvents />} />
              <Route path="/manage-tickets" element={<ManageTickets />} />
              <Route path="/manage-concerts" element={<ManageConcerts />} />
              <Route
                path="/marketplace/:eventId"
                element={<MarketplacePage />}
              />
            </Routes>
          </Router>
        </div>
      </Web3Provider>
    </PrivyProvider>
  );
}

export default App;