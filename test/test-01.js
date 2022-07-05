const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Banana-split", function () {
  it("It should exchange with a ratio of 1:1000 once Swap  function is executed", async function () {
    const deployer = await ethers.Wallet.createRandom();
    const [owner, user1] = await ethers.getSigners();

    // Creating instance of Tokens
    const TokenA = await ethers.getContractFactory("TokenA", deployer.address);
    const TokenB = await ethers.getContractFactory("TokenB", deployer.address);
    // deploying Tokens
    const tokenA = await TokenA.deploy();
    const tokenB = await TokenB.deploy();
    // Awaiting deployments of Tokens
    await tokenA.deployed();
    await tokenB.deployed();
    // creating instance of BananaSplit
    const BananaSplit = await ethers.getContractFactory(
      "BananaSplit",
      deployer.address
    );
    const bananaSplit = await BananaSplit.deploy(
      tokenA.address,
      tokenB.address
    );
    await bananaSplit.deployed();

    // minting tokenB to the bananaSplit contract
    await deployer.signTransaction(tokenB.mint(bananaSplit.address, 100000000));
    expect(await tokenB.balanceOf(bananaSplit.address)).to.equal(100000000);

    // minting tokenA to the user1 contract
    await deployer.signTransaction(tokenA.mint(user1.address, 100000));
    expect(await tokenA.balanceOf(user1.address)).to.equal(100000);

    // increasing allowance of token A from user1 to banana split contract
    await tokenA.connect(user1).approve(bananaSplit.address, 100000);

    // verifying that the balance of the user1 is = 0
    expect(await tokenB.balanceOf(user1.address)).to.equal(0);

    // calling the swap function exchanging  100000 for 100000000

    await bananaSplit.connect(user1).Swap(100000);

    // checking if swap was effective

    expect(await tokenB.balanceOf(user1.address)).to.equal(100000000);

    expect(await tokenB.balanceOf(bananaSplit.address)).to.equal(0);
  });
});
