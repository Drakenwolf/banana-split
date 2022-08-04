import chai from "chai";
import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
import { TokenB, TokenA, SwapFactory } from "../typechain-types";
chai.use(solidity);

export async function deployer() {
  const [owner, user1, user2] = await ethers.getSigners();

  const TokenA = await ethers.getContractFactory("TokenA");
  const tokenA = (await TokenA.deploy("testA", "ta")) as TokenA;
  await tokenA.deployed();

  const TokenB = await ethers.getContractFactory("TokenB");
  const tokenB = (await TokenB.deploy()) as TokenB;
  await tokenB.deployed();

  await tokenB.initialize(
    "Banana0",
    "bn0",
    100,
    await tokenA.address,
    await owner.getAddress()
  );

  const SwapFactory = await ethers.getContractFactory("SwapFactory");
  const swapFactory = (await SwapFactory.deploy(
    await tokenB.address
  )) as SwapFactory;
  await swapFactory.deployed();

  return { swapFactory, tokenB, tokenA, owner, user1, user2 };
}
