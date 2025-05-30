const hre = require("hardhat")

async function main() {
  const [deployer] = await hre.ethers.getSigners()
  console.log("Deploying contracts with the account:", deployer.address)

  const SimpleToken = await hre.ethers.getContractFactory("SimpleToken")
  const token = await SimpleToken.deploy(
    "INNOXAI Token",
    "INNO",
    1000000, // 1 million tokens
    deployer.address,
  )

  await token.waitForDeployment()
  const tokenAddress = await token.getAddress()

  console.log("SimpleToken deployed to:", tokenAddress)

  // Verify the contract on Etherscan if not on a local network
  const networkName = hre.network.name
  if (networkName !== "hardhat" && networkName !== "localhost") {
    console.log("Waiting for block confirmations...")
    await token.deploymentTransaction().wait(5)

    console.log("Verifying contract on Etherscan...")
    await hre.run("verify:verify", {
      address: tokenAddress,
      constructorArguments: ["INNOXAI Token", "INNO", 1000000, deployer.address],
    })
    console.log("Contract verified on Etherscan")
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
