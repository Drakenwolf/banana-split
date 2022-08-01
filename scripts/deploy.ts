import { ethers } from "hardhat";

async function main() {

  const SwapFactory = await ethers.getContractFactory("SwapFactory");
  const swapFactory = await SwapFactory.deploy();

  await swapFactory.deployed();

  console.log("Contract factory deployed at :", swapFactory.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
