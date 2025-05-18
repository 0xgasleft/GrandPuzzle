const fs = require("fs");


task("generate-abi", "Generate ABI for contracts")
    .addParam("contract", "The contract name")
  .setAction(async (args, hre) => {

    const artifact = await hre.artifacts.readArtifact(args.contract);
    fs.writeFileSync(args.contract + "Abi.json", JSON.stringify(artifact.abi, null, 2));

  });