import { HardhatUserConfig } from "hardhat/config";
import 'hardhat-contract-sizer';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat'
import "hardhat-deploy-ethers";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";


const config: HardhatUserConfig = {
  solidity: "0.8.9",
};

export default config;



