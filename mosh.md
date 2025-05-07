<img width="477" alt="Screenshot 2025-05-06 at 9 15 29 PM" src="https://github.com/user-attachments/assets/cbfc62fd-b4bc-49dd-a52c-fa857a7a13a1" />

# Mosh

## 🌟 Project Overview

### Name and One-Liner

**Mosh** – A decentralized ticketing platform to help real fans access concerts fairly by verifying fan loyalty and preventing bot scalping with NFT proof.

### Description

The ticketing industry is plagued by scalping and fraud: during the Taylor Swift Eras Tour, Ticketmaster crashed under 3.5 billion bot-driven requests, leaving millions of real fans locked out. In the UK, markups have reached 41% over face value, and hidden fees can climb as high as 70% of the ticket price.

Mosh is a decentralized concert ticketing platform that uses blockchain technology to create a fairer experience for fans. Mosh leverages NFTs to represent ticket ownership, making each ticket scam-proof.

To combat scalping, Mosh introduces a "proof of fan-ness" system, where fans earn NFT-based loyalty badges by attending events. These badges grant early ticket access to real fans, creating a fairer and more vibrant concert atmosphere.

Mosh also enforces smart contract-based resale rules:

* 40% of profits go to the artist
* 40% to the seller
* 20% to Mosh

By decentralizing ticketing, removing hidden fees, and fostering genuine fan engagement, Mosh addresses issues like ticket fraud, price gouging, and declining concert quality.

## 🔗 Polkadot Integration

Our project, Mosh, is built on **Moonbeam**, a Polkadot parachain, allowing us to deploy Solidity smart contracts with external dependencies from the OpenZeppelin Library.

Moonbeam’s native OpenZeppelin support, efficient gas metering, 6-second block times, and low-latency finality were essential for our platform, which involves minting and transferring thousands of NFT-based tickets and loyalty badges during live ticket drops.


By building on Moonbeam, we remain fully within the Polkadot ecosystem, benefiting from the relay chain’s shared security model. Polkadot’s multichain architecture, composability, and high transaction throughput uniquely enabled us to create a decentralized ticketing platform that delivers the scalability, speed, and integrity that traditional EVM networks can't match.

In the future, we also hope to explore **ink! smart contracts** to expand beyond Moonbeam.

## 🌟 Why We Are Excited

Both of us love music and concerts, as we play instruments and DJ in our free time. We've personally experienced the frustration of ticketing systems as concert fans, which gives us a personal connection to this project. Our connections to local artists in Philadelphia make us well-positioned to grow this platform and solve the problem through Mosh.

---

## 🔍 Project Details

### Documentation of Core Components, Protocols, Architecture

#### Tech Stack

![Screenshot 2025-05-06 at 9 15 08 PM](https://github.com/user-attachments/assets/066380f5-9265-4b65-b153-198af0849972)

#### Protocol Architecture

The protocol is composed of three main smart contracts:

* **EventManager**: Manages event creation, ticket drops, role registration (Fan or Musician), and attendance tracking.
* **Ticket**: An ERC721-based NFT contract representing unique, on-chain tickets with metadata tied to each concert event.
* **Marketplace**: Enables secure, rules-based secondary ticket sales with automatic revenue splits.

Concert metadata is uploaded to IPFS and linked via the NFT URI. Loyalty logic is baked into EventManager, which tracks fan attendance and awards badges.

#### User Identity and Role Protocol

Upon wallet connection, users register as either:

* **Fan**: Can browse, purchase, resell tickets, and accumulate loyalty
* **Musician**: Can create events and manage tickets

#### NFT Resale and Incentive Logic

* Resales go through Marketplace
* Revenue split: 40% Artist / 40% Seller / 20% Mosh
* NFTs remain traceable and immutable

#### Frontend Architecture

* Built with **React.js**
* Interacts with Moonbeam using **Ethers.js**
* Features: Wallet connection, role registration, event browsing, resale dashboard
* Uses **IPFS via Pinata** for metadata and image storage

#### Planned Extensions

* Off-chain event listeners for loyalty scoring
* Gas abstraction for mobile users

#### Security & Polkadot Fit

* Inherits shared security from Polkadot Relay Chain
* EVM-compatible
* High throughput and real-time minting

### Mockups / MVP:

**Demo Video**: [Watch the demo](https://youtu.be/d_7bKOSgQl8)

<img width="632" alt="Screenshot 2025-05-06 at 9 16 14 PM" src="https://github.com/user-attachments/assets/bff3cd07-b6a3-497d-8b18-8527ec750829" />

### Data Models / API Specifications

Frontend API (sample payloads for contract calls):

```json
{
  "eventName": "Midnight Echoes Tour",
  "description": "A synthwave live set",
  "imageFile": "concert.png",
  "priceInETH": "0.05",
  "maxTickets": 200,
  "eventDate": 1724025600,
  "metadataURI": "ipfs://QmXYZ..."
}
```

Smart Contract Interfaces:

```solidity
function createEvent(string calldata name, string calldata metadataURI, uint256 price, uint256 maxTickets, uint256 eventDate) external;
function buyTicket(uint256 eventId) external payable;
function listTicket(uint256 tokenId, uint256 price, uint256 eventId) external;
```

### Limitations

Our product is specifically designed for concert ticketing and not events in general. By the end of the three months, we hope to have our product deployed, and while we will be promoting our platform to local musicians in the area, we have no expectations of how many artists or fans will be on our platform.

---

## 🤌 Ecosystem Fit

* **Fit**: Consumer-facing dApp within Polkadot for live events
* **Target Audience**: Concert fans and independent musicians
* **Need**: Fixes ticket fraud, bot scalping, and artist underpayment
* **Comparable Projects**: Few ticketing solutions in Polkadot; Mosh is unique in loyalty verification and resale logic

---

## 👥 Team

**Team Name**: Mosh
**Contact Name**: Nevan Sujit
**Email**: [nsthettayil@gmail.com](mailto:nsthettayil@gmail.com)
**Website**: [GitHub Repo](https://github.com/tsnevan4204/polkadot-mosh)

**Team Members & GitHub**:

* [Nevan Sujit](https://www.linkedin.com/in/nevan-sujit/) – [https://github.com/tsnevan4204](https://github.com/tsnevan4204)
* [Yuvraj Lakhotia](https://www.linkedin.com/in/yuvraj-lakhotia) – [https://github.com/yuviji](https://github.com/yuviji)

### Team's experience
**Nevan Sujit:**
Nevan Sujit is an undergrad student at the University of Pennsylvania studying Math and Electrical Engineering in the Vagelos Program for Energy Research. He is on the Penn Blockchain Club, where he has particular experience with creating smart Solidity Contracts and the ReactJS frontend framework. He has a lot of hacking experience coming from the numerous hackathons he’s competed and won at, building projects like a documentation generation tool and consumer goods bundler deep learning model.


**Yuvraj Lakhotia:**

---

## 📊 Development Status

(https://github.com/tsnevan4204/polkadot-mosh)

### 📦 Project Structure

**backend/**: Contains the full suite of Solidity smart contracts, deployed using Hardhat, including:

* `EventManager.sol`: Manages event creation, ticket sales, cancellations, and ETH distribution.
* `TicketNFT.sol`: ERC721 contract for ticket NFTs.
* `LoyaltyBadge.sol`: Issues NFT badges for recurring fans.
* `test/`: Mocha-based unit tests for smart contract functionality.
* `scripts/`: Deployment and event scripts.

**frontend/**: A React-based web application that interacts with the deployed contracts via Ethers.js.

* Key UI features include event browsing, ticket purchase/resale, and role-based dashboards for Fans vs Event Hosts.
* Styled with a techno-futuristic theme using Tailwind CSS.

### 💡 Technical Features

* Built on Moonbeam (Polkadot Ecosystem) for EVM compatibility and Polkadot-native security.
* **NFT-based Ticketing**: Tickets are ERC721 tokens with on-chain metadata and enforced royalty logic.
* **Proof of Fan-Ness**: Fans earn NFT loyalty badges through event attendance.
* **Smart Contract Resale Rules**:

  * 40% of resale profits → Artist
  * 40% → Seller
  * 20% → Mosh
* **Role Selection and Wallet Integration**:

  * Upon connecting a wallet, users can register as a Fan or Event Manager.
* **Pinata + IPFS**: Used for storing and retrieving event metadata and ticket images.

### ⚙️ Smart Contract Stack

* **Solidity + OpenZeppelin** for secure ERC721 standards
* **Hardhat** for compilation, testing, and deployment
* **Ethers.js** for frontend-contract communication
* **Moonbeam** for EVM compatibility, fast finality, and scalable NFT operations


---

## 🗓️ Development Roadmap

| Milestone | Deliverables         | Cost (USD) | Est. Completion |
| --------- | -------------------- | ---------- | --------------- |
| 0a        | License (MIT)        | -          | -               |
| 0b        | Code & tutorial docs | -          | -               |
| 0c        | Unit tests + guide   | -          | -               |
| 0d        | Blog article         | -          | -               |
| 1         | Features X, Y        | \$5,000    | 1.5 months      |
| 2         | Feature Z            | \$5,000    | 1.5 months      |

---

## 🚀 Future Plans

* Continue development post-grant
* Explore VC or other grant funding
* Expand Mosh across Polkadot parachains (ink!)

---

## ℹ️ Additional Information

* Multiple hackathon awards
* All work original to this team
* No other current funding

Mosh represents a new frontier for live events: decentralized, fan-first, and fair.
