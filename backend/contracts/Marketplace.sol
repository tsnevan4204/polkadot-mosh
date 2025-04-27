// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/IEventManager.sol";
import "./interfaces/ITicket.sol";

contract Marketplace is ReentrancyGuard, Ownable {
    struct Listing {
        address seller;
        uint256 price;
        uint256 eventId;
    }

    ITicket public ticketNFT;
    IEventManager public eventManager;
    mapping(uint256 => Listing) public listings;

    uint256 public platformFeePercent = 10; // 10%

    event TicketListed(uint256 indexed tokenId, uint256 eventId, address indexed seller, uint256 price);
    event TicketPurchased(uint256 indexed tokenId, address indexed buyer, uint256 price);
    event TicketDelisted(uint256 indexed tokenId);

    constructor(address _eventManager, address _ticketNFT) Ownable(msg.sender) {
        eventManager = IEventManager(_eventManager);
        ticketNFT = ITicket(_ticketNFT);
    }

    function listTicket(uint256 tokenId, uint256 price) external {
        require(IERC721(address(ticketNFT)).ownerOf(tokenId) == msg.sender, "Not owner");
        require(price > 0, "Invalid price");

        uint256 eventId = ticketNFT.tokenToEvent(tokenId);

        IERC721(address(ticketNFT)).safeTransferFrom(msg.sender, address(this), tokenId);
        listings[tokenId] = Listing({ seller: msg.sender, price: price, eventId: eventId });

        emit TicketListed(tokenId, eventId, msg.sender, price);
    }

    function delistTicket(uint256 tokenId) external {
        Listing memory listing = listings[tokenId];
        require(listing.seller == msg.sender, "Not seller");

        delete listings[tokenId];
        IERC721(address(ticketNFT)).safeTransferFrom(address(this), msg.sender, tokenId);

        emit TicketDelisted(tokenId);
    }

    function buyTicket(uint256 tokenId) external payable nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.price > 0, "Not listed");
        require(msg.value >= listing.price, "Insufficient payment");

        (
            , // id
            address organizer,
            , // metadataURI
            , // ticketPrice
            , // maxTickets
            , // ticketsSold
            , // eventDate
            bool cancelled, 
            , // loyaltyStartTimestamp
            , // publicStartTimestamp
            // goldRequirement
        ) = eventManager.events(listing.eventId);

        require(!cancelled, "Event cancelled");

        delete listings[tokenId];
        IERC721(address(ticketNFT)).safeTransferFrom(address(this), msg.sender, tokenId);

        uint256 platformShare = (msg.value * platformFeePercent) / 100;
        uint256 remaining = msg.value - platformShare;
        uint256 sellerShare = (remaining * 45) / 100;
        uint256 artistShare = remaining - sellerShare;

        // Pay seller
        (bool sentSeller, ) = payable(listing.seller).call{value: sellerShare}("");
        require(sentSeller, "Seller payment failed");

        (bool sentArtist, ) = payable(organizer).call{value: artistShare}("");
        require(sentArtist, "Artist payment failed");

        // Keep platform fee inside contract

        emit TicketPurchased(tokenId, msg.sender, msg.value);
    }
}
