// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IPuzzleShard {
    function getHoldings(address _owner) external view returns (uint[] memory);
    function burn(address _owner, uint256 _tokenId) external;
}


/**
 * @title ShardBurner
 * @dev This contract allows batch burning of pre-approved ERC721 tokens (Puzzle shards)
 */
contract ShardBurner is Ownable, ReentrancyGuard {

    enum BurnerStatus { DISABLED, ENABLED }

    BurnerStatus public status;
    address[] public requiredShards;

    mapping (address => bool) public hasRegisteredForBurn;
    mapping (address => bool) public hasCompletedBurn;

    event Burned(address indexed _owner, address indexed _shard, uint indexed _tokenId);
    event StatusUpdated(BurnerStatus indexed _status);
    

    constructor() Ownable(msg.sender) {
        status = BurnerStatus.DISABLED;
        emit StatusUpdated(status);
    }

    function getRequiredShards() external view returns (address[] memory) {
        return requiredShards;
    }

    function setRequiredShards(address[] calldata _requiredShards) external onlyOwner {
        requiredShards = _requiredShards;
    }

    function addRequiredShards(address[] calldata _requiredShards) external onlyOwner {
        for (uint256 i = 0; i < _requiredShards.length;) {
            requiredShards.push(_requiredShards[i]);
            unchecked { ++i; }
        }
    }

    function setStatus(BurnerStatus _status) external onlyOwner {
        status = _status;
        emit StatusUpdated(_status);
    }

    function registerForBurn() external {
        require(!hasRegisteredForBurn[msg.sender], "Already registered for burn!");
        hasRegisteredForBurn[msg.sender] = true;
    }

    function batchBurn() external nonReentrant {
        require(status == BurnerStatus.ENABLED, "Burner is not enabled");
        require(hasRegisteredForBurn[msg.sender], "Not registered for burn");
        require(requiredShards.length > 0, "No required shards set yet");
        
        hasRegisteredForBurn[msg.sender] = false;

        for (uint256 i = 0; i < requiredShards.length;) {
            uint[] memory ownedTokens = IPuzzleShard(requiredShards[i]).getHoldings(msg.sender);
            require(ownedTokens.length > 0, "No owned tokens for a required shard");

            IPuzzleShard(requiredShards[i]).burn(msg.sender, ownedTokens[0]);
            emit Burned(msg.sender, requiredShards[i], ownedTokens[0]);

            unchecked { ++i; }
        }

        hasCompletedBurn[msg.sender] = true;
    }

}