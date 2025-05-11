// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract GrandPuzzleCertificate is ERC721, Ownable {
    
    address[] public requiredPieces;
    uint public supply;
    uint public mint_fee;
    bool public status;
    string public baseTokenURI;

    mapping (address => bool) public hasMintedCertificate;

    event MintFeeUpdated(uint indexed _new_fee);
    event BaseURIUpdated(string indexed _baseTokenURI);
    event RequiredPiecesUpdated();
    event StatusUpdated(bool indexed _status);


    constructor(string memory _name, string memory _symbol, uint _mint_fee, address[] memory _requiredPieces) ERC721(_name, _symbol) Ownable(msg.sender)
    {
        requiredPieces = _requiredPieces;
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

    function updateRequiredPieces(address[] memory _requiredPieces) external onlyOwner {
        requiredPieces = _requiredPieces;
        emit RequiredPiecesUpdated();
    }

    function addRequiredPiece(address _piece) external onlyOwner {
        requiredPieces.push(_piece);
        emit RequiredPiecesUpdated();
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

    function mint(address to) external payable {
        require(status, "Minting is not enabled");
        require(_hasAllPieces(to), "User does not have all required pieces");
        require(!hasMintedCertificate[to], "User has already minted a certificate");
        require(msg.value >= mint_fee, "Not enough native to cover mint fee");

        hasMintedCertificate[to] = true;
        _mint(to, supply);
        supply++;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function _hasAllPieces(address user) internal view returns (bool) {
        for (uint256 i = 0; i < requiredPieces.length;) {
            if (IERC721(requiredPieces[i]).balanceOf(user) == 0) {
                return false;
            }
            unchecked { ++i; }
        }
        return true;
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