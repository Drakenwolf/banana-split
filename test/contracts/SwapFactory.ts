import chai from "chai";
import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";

import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployer } from "../helper";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

chai.use(solidity);
const deployerResult = loadFixture(deployer);

describe("SwapFactory", function () {
  it("Should deploy a banana swap token using minimal proxy", async function () {
    const { swapFactory, owner, tokenA, tokenB } = await deployerResult;

    const ownerAdress = await owner.getAddress();

    await expect(
      swapFactory
        .connect(owner)
        .CreateNewToken("Banana2", "bn2", 100, await tokenA.address)
    )
      .to.emit(swapFactory, "BananaSwapCreated")
      .withArgs(anyValue, 1, 100, anyValue);

    await (
      await swapFactory
        .connect(owner)
        .CreateNewToken("Banana3", "bn3", 10000, await tokenA.address)
    ).wait();

    const banana2 = await swapFactory.getBananaSwap(ethers.BigNumber.from("1"));

    const banana2Contract = await tokenB.attach(banana2);

    expect(await banana2Contract.name()).to.equal("Banana3");
    expect(await banana2Contract.symbol()).to.equal("bn3");
    expect(await banana2Contract.ratio()).to.equal(
      ethers.BigNumber.from("10000")
    );
  });
});
