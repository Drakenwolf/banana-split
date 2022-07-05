// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @author Drakenwolf
/// @title 1:1000 Exchanger
contract BananaSplit {
    IERC20 tokenA;
    IERC20 tokenB;

    constructor(IERC20 _tokenA, IERC20 _tokenB){
        tokenA= _tokenA;
        tokenB= _tokenB;
    }

    /// @param amount the value to exchange
    /// @dev this function check if the amount is approved, then makes a transferFrom

    function Swap(uint256 amount) public {
        require(tokenA.allowance(msg.sender, address(this)) >= amount ,
         "Error: The allowance must be equal or bigger of the amount");

    /// @param amount the value to exchange
    /// @dev this function check if the amount is approved, then makes a transferFrom

        require(tokenA.transferFrom(msg.sender, address(this), amount),
        "Error: the trasnfer failed");
        
        require(tokenB.transfer(msg.sender, amount * 1000),
        "Error: the trasnfer failed");

    }
}