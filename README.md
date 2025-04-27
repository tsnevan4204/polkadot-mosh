<h1>Mosh: Decentralized Concert Ticketing</h1>

<h2>Overview</h2>
<p>
Mosh is a decentralized platform for fair concert ticketing. Built on the Polkadot parachain network with Solidity smart contracts and a React frontend, Mosh uses NFTs to represent tickets and loyalty badges, ensuring real fans, not bots or scalpers, get priority access.
</p>

<h2>How It Works</h2>
<ul>
  <li><strong>NFT Tickets:</strong> Each ticket is minted as an NFT, verifiable on-chain.</li>
  <li><strong>Proof of Fan-ness:</strong> Fans earn loyalty badges by attending events, unlocking early access to future tickets based on their tier.</li>
  <li>The resale marketplace where 40% of profits go to the artist, 40% to the seller, and 20% to Mosh, reducing scalping incentives.</li>
  <li><strong>Role Selection:</strong> Upon wallet connection, users choose Artist or Fan, each with a tailored dashboard.</li>
  <li>Enforced resale royalties, wallet-based reputation, and gamified fan engagement deter bots and scalpers for security.</li>
</ul>

<h2>Smart Contract Architecture</h2>
<ul>
  <li><strong>EventManager.sol:</strong> Handles event creation, ticket purchases, cancellations, and controlled resales.</li>
  <li><strong>TicketNFT.sol:</strong> Mints and manages NFT tickets with enforced on-chain royalty and transfer logic.</li>
  <li><strong>LoyaltyBadges.sol:</strong> Awards and tracks fan loyalty through on-chain badge NFTs.</li>
</ul>

<h2>Tech Stack</h2>
<ul>
  <li><strong>Blockchain:</strong> Polkadot (Moonbeam parachain)</li>
  <li><strong>Smart Contracts:</strong> Solidity (Hardhat environment)</li>
  <li><strong>Frontend:</strong> React.js + Ethers.js</li>
  <li><strong>Storage:</strong> Pinata/IPFS for NFT metadata</li>
</ul>

<h2>Vision</h2>
<p>
Mosh aims to democratize ticketing for indie artists and fans, cutting out centralized monopolies and creating a transparent, loyalty-driven marketplace.
</p>

<p>Mosh - Democratizing concerting</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/ff3f295b-a1df-44fa-b3a7-9f4b869f2485" width="500"/>
  <img src="https://github.com/user-attachments/assets/97f0bd43-1cfc-4205-abeb-e9bb0755f146" width="500"/>
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/839a7c8d-d990-4ca1-8c54-26a84ce72b81" width="500"/>
  <img src="https://github.com/user-attachments/assets/f8606ffb-9cd8-4968-94a0-d830d4012389" width="500"/>
</p>

<h2>Smart Contracts on Block Explorer<h2/>
Ticket Smart Contract - https://moonbase.moonscan.io/address/0xF32810D7F67507006726aE67055aB8fcD6cD3C3B
EventManager Smart Contract - https://moonbase.moonscan.io/address/0x0F708a3Bc9B5CDa7952317740C9d01830A8e5188
Marketplace Smart Contract - https://moonbase.moonscan.io/address/0xA6d76B9694964BDF0239EB05AdAd80f7344EAd54
