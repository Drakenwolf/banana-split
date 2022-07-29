// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./TokenB.sol";

contract Factory is Ownable, Pausable {
    TokenB[] public TokensBArray;

    function CreateNewToken(string memory _name, string memory _symbol, uint256 _ratio, address  _acceptedToken)
        public
        onlyOwner
    {
        //TODO change this for a minimal proxy
        TokenB tokenB = new TokenB(_name, _symbol, _ratio, _acceptedToken);
        TokensBArray.push(tokenB);
    }

    function TokenBGetRatio(uint256 _tokenIndex)
        public
        view
        returns (uint256)
    {
        return TokenB(address(TokensBArray[_tokenIndex])).ratio();
    }
}
