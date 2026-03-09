const hre = require("hardhat");

async function main() {
  const SecureStorage = await hre.ethers.getContractFactory("SecureStorage");
  const secureStorage = await SecureStorage.deploy();
  await secureStorage.waitForDeployment();

  const address = await secureStorage.getAddress();
  console.log(`SecureStorage deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
