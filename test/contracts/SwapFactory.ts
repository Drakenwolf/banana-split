import chai from "chai";
import { ethers } from "hardhat";
import { solidity, MockProvider } from "ethereum-waffle";

import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployer } from "../helper";
import { Contract, Signer } from "ethers";
import { TokenB } from "../../typechain-types";

chai.use(solidity);
const deployerResult = loadFixture(deployer);

describe("SwapFactory", function () {
  it("Should deploy a banana swap token using minimal proxy", async function () {
    const { swapFactory, owner, tokenA, tokenB } = await deployerResult;

    const ownerAdress = await owner.getAddress();
    const Banana2 = await swapFactory
      .connect(owner)
      .CreateNewToken("Banana2", "bn2", 100, await tokenA.address);

    // console.log("Banana 2 : ", Banana2);
    // expect().to.equal();
  });
});
