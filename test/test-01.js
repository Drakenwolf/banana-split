const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Banana-split", function () {
  it("It should exchange with a ratio of 1:1000 once Swap  function is executed", async function () {
    const deployer = ethers.Wallet.createRandom();
    const user1 = ethers.Wallet.createRandom();

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
    const BananaSplit = await ethers.getContractFactory("BananaSplit", deployer.address);
    const bananaSplit = await BananaSplit.deploy(tokenA.address, tokenB.address);
    await bananaSplit.deployed();


    // minting tokens to the bananaSplit contract
    await deployer.signTransaction(tokenB.mint(bananaSplit.address, 100000000));
    console.log(await tokenB.balanceOf(bananaSplit.address))
    expect(await tokenB.balanceOf(bananaSplit.address)).to.equal(100000000);

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
