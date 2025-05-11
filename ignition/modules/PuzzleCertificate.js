const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("hardhat");


const REQUIRED_PIECES = [

    "0x32c25465e9f4b198163F474942007AFcE9ceeff9",
    "0xdB2164F3e8A842C27580FD0188c04ae150318F36",
    "0xDbD9C74F496281E4bb30AB257ba735073F808E7a",
    "0xD09327D736249e786220673a8df0aE2F38270735",
    "0xebFF4b706ebB7aa1a6695dbcd67dF2642C803c7C",
    "0xB45a50C8744C9a1b683360CE7e60e11e31D127aC",
    "0x565325eF8a36B5e0Aa9A92c69F93A425938382CC",
    "0x554D87217F6818C8A47a3C0Ec348c6d888CE5985",
    "0x8794498a491A74b6f2Dbf73E5F5542A054c89653",
    "0x137bf4DcF9b562345001D2b4F3e0F2ed0070Ef4D",
    "0xBB347c44c7cf878e12D6fD559AaA302Af4e8fb3D",
    "0x2A4aef44845777BF9ebef9F4B4BBB264d9585339",
    "0x76C249a8C363C8bA6Ae9d27372c1709A66e668F7",
    "0xD0036D99457d3Ce3a8a2f8416ECF69Ca3bE92Bb7",
    "0xcB8a648074C1Fea3FFC26dfb10BbCec5E7d3Db1e",
    "0xB3aa50F3E543E0A848b4d983F6Fa9F2155b957CE",
    "0x0c0c4dCE614e36335255bF54Dcc9279b19BA06B6",
    "0x7f7DfeAc59ED41c1c261B6A331Fc3fCA604f4f07"
]

const NAME = "GrandPuzzle_ArtCulture";
const SYMBOL = "GPAC"; 
const MINT_FEE = ethers.parseEther("2");


module.exports = buildModule("DeployPuzzleCertificate", (m) => {

    const deployment = m.contract("GrandPuzzleCertificate", [NAME, SYMBOL, MINT_FEE, REQUIRED_PIECES]);
  
    return deployment;
});
