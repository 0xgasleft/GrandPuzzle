// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract GrandPuzzleCertificate is ERC721, Ownable {
    
    struct Shard {
        address shardAddress;
        uint256 tokenId;
    }

    address[] public requiredShards;
    uint public supply;
    uint public mint_fee;

    bool public status;
    string public baseTokenURI;

    mapping (address => bool) public hasMintedCertificate;
    mapping (address => mapping (uint => bool)) public hasBeenUsedShard;

    event MintFeeUpdated(uint indexed _new_fee);
    event BaseURIUpdated(string indexed _baseTokenURI);
    event RequiredShardsUpdated();
    event StatusUpdated(bool indexed _status);


    constructor(string memory _name, string memory _symbol, uint _mint_fee, address[] memory _requiredShards) ERC721(_name, _symbol) Ownable(msg.sender)
    {
        requiredShards = _requiredShards;
        mint_fee = _mint_fee;
        status = false;
    }

    function setStatus(bool _status) external onlyOwner {
        status = _status;
        emit StatusUpdated(_status);
    }

    function setMintFee(uint _mint_fee) external onlyOwner {
        mint_fee = _mint_fee;
        emit MintFeeUpdated(_mint_fee);
    }

    function updateRequiredShards(address[] calldata _requiredShards) external onlyOwner {
        requiredShards = _requiredShards;
        emit RequiredShardsUpdated();
    }

    function addRequiredShards(address[] calldata _requiredShards) external onlyOwner {
        for(uint256 i = 0; i < _requiredShards.length;) {
            requiredShards.push(_requiredShards[i]);
            unchecked { ++i; }
        }
        emit RequiredShardsUpdated();
    }

    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
        emit BaseURIUpdated(_baseTokenURI);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);

        return string.concat(_baseURI(), name(), ".json");
    }

    function totalSupply() external view returns (uint) {
        return supply;
    }

    function mint(address _to, Shard[] calldata _shards) external payable {
        require(status, "Minting is not enabled");
        require(!hasMintedCertificate[_to], "User has already minted a certificate");
        require(msg.value >= mint_fee, "Not enough native to cover mint fee");
        _hasAllShardsAndUnused(_to, _shards);

        hasMintedCertificate[_to] = true;
        _mint(_to, supply);
        supply++;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function _hasAllShardsAndUnused(address _to, Shard[] calldata _shards) internal {
        require(_shards.length == requiredShards.length, "Incorrect number of shards");

        for(uint256 i = 0; i < requiredShards.length;) {
            
            bool foundShard = false;

            for(uint256 j = 0; j < _shards.length;) {
                if(requiredShards[i] == _shards[j].shardAddress) {
                    
                    require(IERC721(_shards[j].shardAddress).ownerOf(_shards[j].tokenId) == _to, "Not owner of shard");
                    require(!hasBeenUsedShard[_shards[j].shardAddress][_shards[j].tokenId], "Shard has already been used");

                    foundShard = true;
                    hasBeenUsedShard[_shards[j].shardAddress][_shards[j].tokenId] = true;

                    break;
                }
                unchecked { ++j; }
            }
            require(foundShard, "Missing required shard");
            unchecked { ++i; }       
        }
    }



    function withdraw(address _to) external onlyOwner {
        require(_to != address(0), "Cannot withdraw to zero address!");
        require(address(this).balance > 0, "No balance to withdraw!");
        (bool success, ) = payable(_to).call{value: address(this).balance}("");
        require(success, "Transfer failed.");
    }

    receive() external payable {}

    fallback() external payable {}

}