// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";


/**
 * @title PuzzleShard
 * @dev This contract allows the minting of ERC721 tokens (Puzzle Shards) to users who have completed specific missions.
 * The contract owner can set the minting status and verify signatures for mission completion.
 */
contract PuzzleShard is ERC721, Ownable {
    
    enum MintStatus { DISABLED, ENABLED }

    MintStatus public status;
    string public baseTokenURI;

    uint public block_counter;
    uint public supply;

    uint public constant SEVEN_DAYS_BLOCKS = 1_209_600;
    uint public constant TWO_WEEKS_BLOCKS = 2_419_200;

    address public immutable SHARD_BURNER;

    mapping(address => uint[]) public holdings;

    event MintedShard(address indexed _recipient, string indexed _mission_symbol);
    event DestroyedShard(address indexed _recipient, uint indexed _tokenId);
    event StatusUpdated(MintStatus indexed _status);
    event BaseURIUpdated(string indexed _baseTokenURI);


    constructor(string memory _name, string memory _symbol, string memory _base_uri, address _shard_burner) ERC721(_name, _symbol) Ownable(msg.sender)
    {
        status = MintStatus.DISABLED;
        SHARD_BURNER = _shard_burner;

        setBaseURI(_base_uri);

        emit StatusUpdated(status);
    }

    modifier onlyBurner() {
        require(msg.sender == SHARD_BURNER, "Only SHARD_BURNER allowed!");
        _;
    }

    /**
     * @dev Returns the current supply of tokens.
     * @return The current supply of tokens.
     */
    function totalSupply() external view returns (uint) {
        return supply;
    }

    /**
     * @dev Returns the holdings of the specified address.
     * @param _owner The address of the owner.
     * @return An array of token IDs owned by the specified address.
     */
    function getHoldings(address _owner) external view returns (uint[] memory) {
        return holdings[_owner];
    }

    /**
     * @dev Returns the token URI for the specified token ID.
     * @param tokenId The ID of the token.
     * @return The token URI for the specified token ID.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);

        return string.concat(_baseURI(), name(), "_Shard.json");
    }

    /**
     * @dev Sets the base URI for the token metadata.
     * @param _baseTokenURI The new base URI for the token metadata.
     */
    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
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
     * @dev Overrides the _update function to populate the holdings mapping.
     * @param to The address of the recipient.
     * @param tokenId The ID of the token.
     * @param auth The address of the auth.
     * @return The address of the recipient.
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        if (to != address(0)) {
            holdings[to].push(tokenId);
        }
        address from = _ownerOf(tokenId);
        if (from != address(0)) {
            uint[] storage ownerHoldings = holdings[from];
            for (uint i = 0; i < ownerHoldings.length; i++) {
                if (ownerHoldings[i] == tokenId) {
                    ownerHoldings[i] = ownerHoldings[ownerHoldings.length - 1];
                    ownerHoldings.pop();
                    break;
                }
            }
        }

        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Returns the current minting fee based on the elapsed blocks.
     * @return The current minting fee.
     */
    function getCurrentMintFee() public view returns (uint) {
        if(MintStatus.DISABLED == status)
        {
            return 0;
        }
        else {
            uint _consumed_blocks = block.number - block_counter;
            if(_consumed_blocks < SEVEN_DAYS_BLOCKS)
            {
                return 0.2 ether;
            }
            else if(_consumed_blocks < TWO_WEEKS_BLOCKS)
            {
                return 0.5 ether;
            }
            else
            {
                return 1 ether;
            }
        }
    }

    /**
     * @dev Sets the minting status.
     * @param _status The new minting status.
     */
    function setStatus(MintStatus _status) external onlyOwner {
        if(_status == MintStatus.ENABLED) {
            block_counter = block.number;
        }
        else if (_status == MintStatus.DISABLED) {
            block_counter = 0;
        }
        status = _status;

        emit StatusUpdated(_status);
    }

    /**
     * @dev Burns the specified token ID.
     * @param _tokenId The ID of the token to burn.
     */
    function burn(address _owner, uint _tokenId) external onlyBurner {
        require(msg.sender == _ownerOf(_tokenId) || isApprovedForAll(_owner, SHARD_BURNER), "Not approved to burn!");
        
        _burn(_tokenId);

        emit DestroyedShard(msg.sender, _tokenId);
    }

    /**
     * @dev Mint to the specified recipient.
     * @param _recipient The address of the recipient.
     * @param _signature The signature verifying mission completion.
     */
    function mintPuzzleShard(address _recipient, bytes calldata _signature) external payable
    {
        require(status == MintStatus.ENABLED, "Minting disabled!");

        if(!isApprovedForAll(msg.sender, SHARD_BURNER))
        {
            setApprovalForAll(SHARD_BURNER, true);
        }

        _mintPuzzleShard(_recipient, _signature);
    }
    

    /**
     * @dev Internal mint logic.
     * @param _recipient The address of the recipient.
     * @param _signature The signature verifying mission completion.
     */
    function _mintPuzzleShard(address _recipient, bytes calldata _signature) internal
    {
        require(balanceOf(_recipient) == 0, "Recipient already minted!");
        require(_hasValidSignature(_recipient, supply, _signature), "Not authorized!");
        require(msg.value >= getCurrentMintFee(), "Not enough fee for minting!");
        require(_recipient != address(0), "Recipient cannot be zero address!");

        _mint(_recipient, supply);
        supply++;
        emit MintedShard(_recipient, symbol());
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
