Mosh

🌟 Project Overview

Name and one-liner of the project

Mosh - A decentralized ticketing platform to help real fans access concerts fairly by verifying fan loyalty and preventing bot scalping with NFT proof.

Description

The ticketing industry is plagued by scalping and fraud: during the Taylor Swift Eras Tour, Ticketmaster crashed under 3.5 billion bot-driven requests, leaving millions of real fans locked out. In the UK, markups have reached 41% over face value, and hidden fees can climb as high as 70% of the ticket price. Mosh is a decentralized concert ticketing platform that uses blockchain technology to create a fairer experience for fans. Mosh leverages NFTs to represent ticket ownership, making each ticket scam-proof.

To combat scalping, Mosh introduces a "proof of fan-ness" system, where fans earn NFT-based loyalty badges by attending events. These badges grant early ticket access to real fans, creating a fairer and more vibrant concert atmosphere. Mosh also enforces smart contract-based resale rules: 40% of profits go to the artist, 40% to the seller, and 20% to Mosh, realigning incentives to support musicians.

By decentralizing ticketing, removing hidden fees, and fostering genuine fan engagement, Mosh addresses issues like ticket fraud, price gouging, and declining concert quality.

Polkadot Integration

Our project, Mosh, is built on Moonbeam, a Polkadot parachain, allowing us to deploy Solidity smart contracts with external dependencies from the OpenZeppelin Library. Moonbeam’s native OpenZeppelin support, efficient gas metering, 6-second block times, and low-latency finality were essential for our platform, which involves minting and transferring thousands of NFT-based tickets and loyalty badges during live ticket drops.

By building on Moonbeam, we remained fully within the Polkadot ecosystem, benefiting from the relay chain’s shared security model. Polkadot’s multichain architecture, composability, and high transaction throughput uniquely enabled us to create a decentralized ticketing platform that delivers the scalability, speed, and integrity that traditional EVM networks can't match.

In the future, we also hope to explore ink! smart contracts for development of our ticketing platform so that we can explore other parachains than Moonbeam.

Why we are excited about this project

Both of us love music and concerts, as we play instruments and DJ in our free time. We have personally felt the inconveniences of purchasing concert tickets being avid concert fans, which is why we have a personal connection to this project. We also have several connections to local artists in Philadelphia which makes us the right people to grow this platform and solve this problem by working on Mosh.

(Optional but huge bonus points): 

🔍 Project Details

We expect applicants to have a solid idea about the project's expected final state. Therefore, please submit (where relevant):

Documentation of core components, protocols, architecture to be deployed

Overview

Mosh is a decentralized concert ticketing platform built on the Moonbeam parachain within the Polkadot ecosystem. It leverages smart contract-enforced logic for NFT-based ticket issuance, resale governance, and loyalty rewards. By using Polkadot's shared security and Moonbeam's EVM compatibility, Mosh achieves secure, scalable, and fan-first ticketing.

Protocol Architecture

At its core, Mosh’s protocol is composed of three main smart contracts:

EventManager: Manages event creation, ticket drops, role registration (Fan or Musician), and attendance tracking.

Ticket: An ERC721-based NFT contract representing unique, on-chain tickets with metadata tied to each concert event.

Marketplace: Enables secure, rules-based secondary ticket sales. Resale profits are split automatically: 40% to the artist, 40% to the seller, and 20% to the Mosh protocol treasury.

Tickets are minted via createEvent calls and are traceable on-chain. Concert metadata (name, description, image) is uploaded to IPFS and linked in the NFT URI. Loyalty logic is baked into the EventManager, which tracks fan attendance and awards badges (e.g., Gold Tier) based on participation.

All contracts are deployed on Moonbeam, which offers low-latency, 6s block times, and high TPS—ideal for handling thousands of mints during a ticket drop.

User Identity and Role Protocol

Upon wallet connection, users must register their role:

Fans can browse, purchase, and resell tickets. They accumulate loyalty through verified attendance.

Musicians (Event Managers) can create events, define metadata, and manage ticket distribution.

The protocol uses mappings to assign roles on-chain and prevents unauthorized actions (e.g., only musicians can create events).

NFT Resale and Incentive Logic

Mosh enforces royalty logic in secondary sales:

Resales must go through the Marketplace contract.

Smart contract splits profits: 40% to the original artist, 40% to the current seller, and 20% to the platform.

Tickets retain identity across transactions through immutable token URIs, ensuring transparency.

Frontend Architecture

The frontend is a React.js web app interacting with Moonbeam via Ethers.js. It includes:

Wallet connection and role registration UI

Event browsing and ticket buying interface

Ticket resale flow and price-setting

Dynamic dashboards for fans vs organizers

IPFS (via Pinata) is used for storing ticket images and metadata.

Components (Planned)

Planned extensions include:

Off-chain event listeners for fan engagement scoring

Mobile-first wallet abstraction and gas sponsorship

Security, Scalability, and Polkadot Integration

Built on Moonbeam, Mosh inherits:

Shared security from Polkadot’s Relay Chain

Scalable blockspace for high-volume mints

EVM compatibility for Solidity/OpenZeppelin integration

This architecture outperforms traditional EVM networks in throughput, security, and composability—enabling Mosh to operate at concert-scale in real time.

Mockups / MVP:

Data models / API specifications of the core functionality:

Limitations

Our product is specifically designed for concert ticketing and not events in general. By the end of the three months, we hope to have our product deployed, and while we will be promoting our platform to local musicians in the area, we have no expectations of how many artists or fans will be on our platform.

🧩 Ecosystem Fit

Help us locate your project in the Polkadot landscape and what problems it tries to solve by answering each of these questions:

Where and how does your project fit into the ecosystem?

Who is your target audience?

What need(s) does your project meet?

Are there any other projects similar to yours in the Polkadot ecosystem?

If so, how is your project different?

If not, why might such a project not exist yet?

👥 Team

Team Name: Mosh

Contact Name: Nevan Sujit

Contact Email: nsthettayil@gmail.com

Website: 

Team members

LinkedIn Profiles

https://www.linkedin.com/in/nevan-sujit/

https://www.linkedin.com/in/yuvraj-lakhotia

Team Code Repos

Please also provide the GitHub accounts of all team members:

tsnevan4204

https://github.com/yuviji

Team's experience

Nevan Sujit:

Nevan Sujit is an undergrad student at the University of Pennsylvania studying Math and Electrical Engineering in the Vagelos Program for Energy Research. He is on the Penn Blockchain Club, where he has particular experience with creating smart Solidity Contracts and the ReactJS frontend framework. He has a lot of hacking experience coming from the numerous hackathons he’s competed and won at, building projects like a documentation generation tool and consumer goods bundler deep learning model.

Yuvraj Lakhotia:

📊 Development Status

📦 Project Structure

backend/: Contains the full suite of Solidity smart contracts, deployed using Hardhat, including:

EventManager.sol: Manages event creation, ticket sales, cancellations, and ETH distribution.

TicketNFT.sol: ERC721 contract for ticket NFTs.

LoyaltyBadge.sol: Issues NFT badges for recurring fans.

test/: Mocha-based unit tests for smart contract functionality.

scripts/: Deployment and event scripts.

frontend/: A React-based web application that interacts with the deployed contracts via Ethers.js.

Key UI features include event browsing, ticket purchase/resale, and role-based dashboards for Fans vs Event Hosts.

Styled with a techno-futuristic theme using Tailwind CSS.

💡 Technical Features

Built on Moonbeam (Polkadot Ecosystem) for EVM compatibility and Polkadot-native security.

NFT-based Ticketing: Tickets are ERC721 tokens with on-chain metadata and enforced royalty logic.

Proof of Fan-Ness: Fans earn NFT loyalty badges through event attendance.

Smart Contract Resale Rules:

40% of resale profits → Artist

40% → Seller

20% → Mosh

Role Selection and Wallet Integration:

Upon connecting a wallet, users can register as a Fan or Event Manager.

Pinata + IPFS: Used for storing and retrieving event metadata and ticket images.

⚙️ Smart Contract Stack

Solidity + OpenZeppelin for secure ERC721 standards.

Hardhat for compilation, testing, and deployment.

Ethers.js for frontend-contract communication.

Moonbeam for EVM compatibility + fast finality and scalable NFT operations.

📅 Development Roadmap

This section should break the development roadmap down into milestones and deliverables. Since these will be part of the agreement, please describe the functionality we should expect in as much detail as possible, plus how we can verify and test that functionality.

Important notes:

Each milestone is capped at $5,000 USD

Milestones must be delivered within 3 months of approval

The maximum grant amount is $10,000 USD per application (up to $15,000 USD per project in exceptional cases)

You will only receive payment after successful milestone delivery

Overview

Estimated Duration: Duration of the whole project (maximum 3 months)

Full-Time Equivalent (FTE): Average number of full-time employees working on the project

Total Costs: Requested amount in USD for the whole project (maximum $10,000 USD)

Note that deliverables 0a to 0d are mandatory. Please adapt their specification to your project.

💰 Budget Breakdown

Please provide a breakdown of your budget by milestone:

Make sure you show clearly what the funding is going towards (e.g. 30 hours of a full time employee at $X / hour).

🔮 Future Plans

Please include:

How you intend to continue development after the Fast-Grant

Any plans for seeking additional funding (other grants, VC funding, etc.)

Your vision for the project's growth and impact in the Polkadot ecosystem

ℹ️ Additional Information

Here you can add any additional information that you think is relevant to this application, such as:

Work you have already done

If there are any other teams who have already contributed to the project

Other funding you may have applied for

Remember that the Fast-Grants Programme is designed as a first step for promising projects. We're looking for projects that can continue to grow beyond this initial funding.
