const { ethers, run, network } = require("hardhat");
const { expect } = require('chai');
const path = require('path');

const pathLeonToken = '../artifacts/contracts/LeonToken.sol/Leon.json';
const LeonToken = require(pathLeonToken);

async function main() {

  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  /*-------------------- CONTRACT IS ALREADY DEPLOYED ONLY VERIFY --------------------------*/ 

  // const address = '0x29D77C62f68a680A3C575dEe23db97A8770E5800';
  // const ERC20 = await ethers.getContractFactory('Leon');
  // const ERC20Contract =  ERC20.attach(address);
  // console.log(`Deployed to : ${ERC20Contract.address}`)

  
  /*----------------------------- CONTRACT DEPLOYING --------------------------------*/
  
  const ERC20 = await ethers.getContractFactory("Leon");
  const ERC20Contract = await ERC20.deploy(deployer.address);
  await ERC20Contract.deployed();
  console.log(`Deployed to : ${ERC20Contract.address}`)
  
  /*-------------------------- CONTRACT VERIFICATION -------------------------------*/
  
  if (network.config.chainId === 421613  && typeof process.env.ETHERSCAN_ARBITRUM_API_KEY !== 'undefined' || network.config.chainId === 42161 && typeof process.env.ETHERSCAN_ARBITRUM_API_KEY !== 'undefined'  ) {

    const RPC_URL = (network.config.chainId === 42161 ) ? ARBITRUM_MAINNET_RPC_URL : process.env.ARBITRUM_TESTNET_RPC_URL;
    const etherscanURL = (network.config.chainId === 42161 ) ? 'https://arbiscan.io/address/' : 'https://goerli.arbiscan.io/address/';
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

    const deployedBytecodeArbitrum = await ethers.provider.getCode(ERC20Contract.address);
    expect(await provider.getCode(ERC20Contract.address))
    .to.be.equal(LeonToken.deployedBytecode);
    console.log("arbitrumDeployer was correctly verified")
    console.log("Etherscan URL: ", etherscanURL + ERC20Contract.address)
    console.log("Path file: ", path.join(__dirname, pathLeonToken));
    console.log();

    console.log("Contract Verification on deployed network ");
    await ERC20Contract.deployTransaction.wait(6);
    await verify(ERC20Contract.address, [deployer.address]);
  }

}

async function verify(contractAddress, args) {

  console.log("verifying contract....")
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e)
    }
  }

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});