const erc1820 = require("erc1820");
const { updateDatConfig } = require("../helpers");

const authArtifact = artifacts.require("Authorization");
const fseArtifact = artifacts.require("FairSyntheticEquity");
const datArtifact = artifacts.require("DecentralizedAutonomousTrust");

module.exports = async function deployAndConfigure(
  deployer,
  network,
  accounts
) {
  // Deploy 1820 (for local testing only)
  if (network === "development") {
    await erc1820.deploy(web3);
  }

  // Deploy token
  const fse = await deployer.deploy(fseArtifact);

  // Deploy Dat
  const dat = await deployer.deploy(
    datArtifact,
    fseArtifact.address,
    "42000000000000000000", // initReserve
    "0x0000000000000000000000000000000000000000", // currencyAddress
    "0", // initGoal
    "0", // initDeadline
    "1", // buySlopeNum
    "100000", // buySlopeDen
    "1", // investmentReserveNum
    "10", // investmentReserveDen
    "1", // revenueCommitementNum
    "10" // revenueCommitementDen
  );

  // Deploy auth
  await deployer.deploy(
    authArtifact,
    datArtifact.address,
    0 // initLockup
  );

  // Update dat with auth (and other settings)
  await updateDatConfig(
    dat,
    fse,
    {
      authorizationAddress: authArtifact.address,
      name: "Fairmint Fair Synthetic Equity",
      symbol: "FSE"
    },
    accounts[0]
  );
};