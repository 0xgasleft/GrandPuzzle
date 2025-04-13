// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";



contract GrandPuzzleCertificate is ERC721, Ownable {
    

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) Ownable(msg.sender)
    {
        
    }

}