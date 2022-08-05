import chai from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { deployer } from "../helper";
chai.use(solidity);

const deployerResult = loadFixture(deployer);

describe("BananaSwap", function () {
  describe("Deployment", function () {
    it("Should deploy the banana contract and one tokenB having the same owner", async function () {
      const { swapFactory, tokenB, owner } = await deployerResult;

      expect(await tokenB.owner()).to.equal(await owner.getAddress());
      expect(await tokenB.owner()).to.equal(await swapFactory.owner());
    });

    it("Should have a ratio of 100", async function () {
      const { tokenB } = await deployerResult;
      expect(await tokenB.ratio()).to.equal(100);
    });
  });

  describe("Swap & Withdraws", function () {
    it("Should swap 10 tokens a for 1000 tokens b", async function () {
      const { tokenA, tokenB, user1, owner } = await deployerResult;
      const user1Address = await user1.getAddress();
      await tokenA.mint(user1Address, 10);
      await tokenA.connect(user1).approve(tokenB.address, 10);
      await tokenB.connect(user1).swapTokensAForTokensB(10, 10);

      expect(await tokenB.balanceOf(user1Address)).to.equal(1000);

      it("Should allow owner take 5 tokens a from contract", async function () {
        expect(await tokenA.balanceOf(tokenB.address)).to.equal(10);
        tokenB.withdrawTokens(5, tokenA.address);
      });
    });
  });

  it("Should swap 500 tokens b for 5  tokens a", async function () {
    const { tokenA, tokenB, user1 } = await deployerResult;
    const user1Address = await user1.getAddress();

    await tokenB.mint(user1Address, 500);
    await tokenA.mint(tokenB.address, 5);
    const tokenBUser1 = await tokenB.connect(user1);
    await tokenBUser1.approve(tokenB.address, 500);

    await tokenBUser1.swapTokensBForTokensA(500);

    expect(await tokenA.balanceOf(user1Address)).to.equal(5);
  });
});
