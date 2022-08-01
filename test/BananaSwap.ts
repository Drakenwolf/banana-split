import chai from "chai";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { solidity, MockProvider } from "ethereum-waffle";
import { Contract, Signer } from "ethers";

chai.use(solidity);

describe("BananaSwap", function () {
  async function deployer() {
    const [owner, user1, user2] = await ethers.getSigners();

    const SwapFactory = await ethers.getContractFactory("SwapFactory");
    const swapFactory = await SwapFactory.deploy();

    const TokenA = await ethers.getContractFactory("TokenA");
    const tokenA = await TokenA.deploy("testA", "ta");

    await swapFactory.CreateNewToken("testB", "Tb", 1000, tokenA.address);
    const tokenB0 = await swapFactory.getTokenB(0);

    const TokenElements = await ethers.getContractFactory("TokenB");

    const tokenB = new ethers.ContractFactory(
      TokenElements.interface,
      TokenElements.bytecode,
      TokenElements.signer
    ).attach(tokenB0);

    return { swapFactory, tokenB, tokenA, owner, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should deploy the banana contract and one tokenB having the same owner", async function () {
      const { swapFactory, tokenB, owner } = await loadFixture(deployer);

      expect(await tokenB.owner()).to.equal(await owner.getAddress());
      expect(await tokenB.owner()).to.equal(await swapFactory.owner());
    });

    it("Should have a ratio of 1000", async function () {
      const { tokenB } = await loadFixture(deployer);
      expect(await tokenB.ratio()).to.equal(1000);
    });
  });

  describe("Swap & Withdraws", function () {
    it("Should swap 10 tokens a for 10000 tokens b", async function () {
      const { tokenA, tokenB, user1, owner } = await loadFixture(deployer);
      const user1Address = await user1.getAddress();
      const ownerAddress = await owner.getAddress();
      await tokenA.mint(user1Address, 10);
      await tokenA.connect(user1).approve(tokenB.address, 10);
      await tokenB.connect(user1).swapTokensAForTokensB(10, 10);

      expect(await tokenB.balanceOf(user1Address)).to.equal(10000);

      it("Should allow owner take 5 tokens a from contract", async function () {
        expect(await tokenA.balanceOf(tokenB.address)).to.equal(10);
        tokenB.withdrawTokens(5, tokenA.address);
        console.log(await tokenB.balanceOf(ownerAddress));
      });
    });
  });

  it("Should swap 5000 tokens b for 5  tokens a", async function () {
    const { tokenA, tokenB, user1 } = await loadFixture(deployer);
    const user1Address = await user1.getAddress();

    await tokenB.mint(user1Address, 5000);
    await tokenA.mint(tokenB.address, 5);
    const tokenBUser1 = await tokenB.connect(user1);
    await tokenBUser1.approve(tokenB.address, 5000);

    await tokenBUser1.swapTokensBForTokensA(5000);

    expect(await tokenA.balanceOf(user1Address)).to.equal(5);
  });
});
