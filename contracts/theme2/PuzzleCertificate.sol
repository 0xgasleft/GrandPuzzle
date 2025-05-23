// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



interface IShardBurner {
    function hasCompletedBurn(address _owner) external view returns (bool);
}

/**
 * @title PuzzleCertificate
 * @dev This contract allows the minting of ERC721 tokens (Puzzle Certificates) to users who have burned specific shards.
 * The contract owner can set the minting status and manage the minting fee.
 */
contract PuzzleCertificate is ERC721, Ownable {

    uint public supply;
    uint public mint_fee;

    bool public status;
    string public baseTokenURI;

    address public immutable SHARD_BURNER;

    mapping (address => bool) public hasCompletedBurn;
    mapping (address => bool) public hasMintedCertificate;

    event MintFeeUpdated(uint indexed _new_fee);
    event BaseURIUpdated(string indexed _baseTokenURI);
    event MintedCertificate(address indexed _recipient, uint indexed _tokenId);
    event AttestedBurn(address indexed _recipient);
    event StatusUpdated(bool indexed _status);



    constructor(string memory _name, string memory _symbol, uint _mint_fee, address _shard_burner) ERC721(_name, _symbol) Ownable(msg.sender)
    {
        require(_shard_burner != address(0), "SHARD_BURNER cannot be zero address");
        SHARD_BURNER = _shard_burner;
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

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
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

    function mint(address _to) external payable {
        require(status, "Minting is not enabled");
        require(!hasMintedCertificate[_to], "User has already minted a certificate");
        require(msg.value >= mint_fee, "Not enough native to cover mint fee");
        require(IShardBurner(SHARD_BURNER).hasCompletedBurn(_to), "User has not completed burn");

        hasMintedCertificate[_to] = true;
        _mint(_to, supply);

        emit MintedCertificate(_to, supply);

        supply++;
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