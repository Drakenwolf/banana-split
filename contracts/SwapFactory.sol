// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./TokenB.sol";

contract SwapFactory is Ownable, Pausable {
    address[] public BananaSplitArray;
    address public originalBanana;
    event BananaSwapCreated(
        address bananaSplit,
        uint256 tokenIndex,
        uint256 _ratio,
        address _acceptedToken
    );

    constructor() {}

    function CreateNewToken(
        string memory _name,
        string memory _symbol,
        uint256 _ratio,
        address _acceptedToken
    ) public onlyOwner {
        bytes32 salt = keccak256(
            abi.encodePacked(_name, _symbol, _ratio, _acceptedToken)
        );

        address newBananaSplit = Clones.cloneDeterministic(
            originalBanana,
            salt
        );

        emit BananaSwapCreated(newBananaSplit, 0, _ratio, _acceptedToken);
        TokenB(newBananaSplit).initialize(
            _name,
            _symbol,
            _ratio,
            _acceptedToken,
            msg.sender
        );
        BananaSplitArray.push(newBananaSplit);
    }

    function getBananaSwap(uint256 _tokenIndex) public view returns (address) {
        return address(BananaSplitArray[_tokenIndex]);
    }
}
