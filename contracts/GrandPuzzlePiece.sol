// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";


/**
 * @title GrandPuzzlePiece
 * @dev This contract allows the minting of ERC721 tokens (Grand Puzzle Pieces) to users who have completed specific missions.
 * The contract owner can set the minting status and verify signatures for mission completion.
 */
contract GrandPuzzlePiece is ERC721, Ownable {
    
    enum MissionStatus { DISABLED, WHITELISTED, PUBLIC }

    MissionStatus public status;
    string public baseTokenURI;

    uint public mint_fee;
    uint public supply;

    mapping (address => bool) private _whitelisted;

    event FinishedMission(address indexed _recipient, string indexed _mission_symbol);
    event MintFeeUpdated(uint indexed _new_fee);
    event StatusUpdated(MissionStatus indexed _status);
    event BaseURIUpdated(string indexed _baseTokenURI);
    event WhitelistUpdated();


    constructor(string memory _name, string memory _symbol, uint _mint_fee, address[] memory _whitelisted_addresses) ERC721(_name, _symbol) Ownable(msg.sender)
    {
        status = MissionStatus.DISABLED;
        mint_fee = _mint_fee;
        for (uint i = 0; i < _whitelisted_addresses.length; i++) {
            _whitelisted[_whitelisted_addresses[i]] = true;
        }
        emit MintFeeUpdated(_mint_fee);
        emit StatusUpdated(status);
        emit WhitelistUpdated();
    }

    /**
     * @dev Returns the current supply of tokens.
     * @return The current supply of tokens.
     */
    function totalSupply() external view returns (uint) {
        return supply;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);

        return string.concat(_baseURI(), name(), "_Shard.json");
    }

    /**
     * @dev Sets the base URI for the token metadata.
     * @param _baseTokenURI The new base URI for the token metadata.
     */
    function setBaseURI(string calldata _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
        emit BaseURIUpdated(baseTokenURI);
    }

    /**
     * @dev Returns the base URI for the token metadata.
     * @return The base URI for the token metadata.
     */
    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    /**
     * @dev Returns the whitelisting status of an address.
     * @return The whitelist status.
     */
    function isWhitelisted(address user) external view returns (bool) {
        return _whitelisted[user];
    }

    /**
     * @dev Adds addresses to the whitelist.
     * @param _addresses array of addresses to be added to the whitelist.
     */
    function addToWhitelist(address[] calldata _addresses) external onlyOwner {
        
        for (uint i = 0; i < _addresses.length; i++) {
            require(_addresses[i] != address(0), "Cannot add zero address to whitelist!");
            _whitelisted[_addresses[i]] = true;
        }
        
        emit WhitelistUpdated();
    }

    /**
     * @dev Removes addresses from the whitelist.
     * @param _addresses array of addresses to be removed from the whitelist.
     */
    function removeFromWhitelist(address[] calldata _addresses) external onlyOwner {
        
        for (uint i = 0; i < _addresses.length; i++) {
            require(_addresses[i] != address(0), "Cannot add zero address to whitelist!");
            _whitelisted[_addresses[i]] = false;
        }
    }
    
    /**
     * @dev Sets the minting fee.
     * @param _new_fee The new minting fee.
     */
    function setMintFee(uint _new_fee) external onlyOwner {
        mint_fee = _new_fee;

        emit MintFeeUpdated(_new_fee);
    }

    /**
     * @dev Sets the minting status.
     * @param _status The new minting status.
     */
    function setStatus(MissionStatus _status) external onlyOwner {
        status = _status;

        emit StatusUpdated(_status);
    }

    /**
     * @dev Public mint phase to the specified recipient.
     * @param _recipient The address of the recipient.
     * @param _signature The signature verifying mission completion.
     */
    function publicMintPuzzlePiece(address _recipient, bytes calldata _signature) external payable
    {
        require(status == MissionStatus.PUBLIC, "Minting not allowed for public!");

        _mintPuzzlePiece(_recipient, _signature);
    }

    /**
     * @dev Whitelist mint phase to the specified recipient.
     * @param _recipient The address of the recipient.
     * @param _signature The signature verifying mission completion.
     */
    function whitelistMintPuzzlePiece(address _recipient, bytes calldata _signature) external payable
    {
        require(status == MissionStatus.WHITELISTED, "Minting not allowed for whitelisted!");
        require(_whitelisted[_recipient], "Recipient not whitelisted!");

        _mintPuzzlePiece(_recipient, _signature);
    }
    

    /**
     * @dev Internal mint logic.
     * @param _recipient The address of the recipient.
     * @param _signature The signature verifying mission completion.
     */
    function _mintPuzzlePiece(address _recipient, bytes calldata _signature) internal
    {
        require(balanceOf(_recipient) == 0, "Recipient already minted!");
        require(_hasValidSignature(_recipient, supply, _signature), "Not authorized!");
        require(msg.value >= mint_fee, "Not enough fee for minting!");
        require(_recipient != address(0), "Recipient cannot be zero address!");

        _mint(_recipient, supply);
        supply++;
        emit FinishedMission(_recipient, symbol());
    }

    /**
     * @dev Checks if the recipient has a valid signature for the mission.
     * @param _recipient The address of the recipient.
     * @param _id The ID of the token.
     * @param _signature The signature verifying mission completion.
     * @return True if the signature is valid, false otherwise.
     */
    function _hasValidSignature(address _recipient, uint _id, bytes calldata _signature) internal view returns(bool)
    {
        bytes32 _mission_message_hash = keccak256(
            abi.encodePacked(
                "Token ID: ", 
                _id,
                "Recipient: ", 
                _recipient
                )
            );
        bytes32 _msg = MessageHashUtils.toEthSignedMessageHash(_mission_message_hash);

        return ECDSA.recover(_msg, _signature) == owner();
    }

    /**
     * @dev Withdraws the contract balance to the owner's address.
     * @param _to The address to withdraw the balance to.
     */
    function withdraw(address _to) external onlyOwner {
        require(_to != address(0), "Cannot withdraw to zero address!");
        require(address(this).balance > 0, "No balance to withdraw!");
        (bool success, ) = payable(_to).call{value: address(this).balance}("");
        require(success, "Transfer failed.");
    }

    receive() external payable {}

    fallback() external payable {}
}
