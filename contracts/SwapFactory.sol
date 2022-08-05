// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./TokenB.sol";
import "hardhat/console.sol";

contract SwapFactory is Ownable, Pausable {
    address[] public bananaSplitArray;
    address public originalBanana;

    event BananaSwapCreated(
        address bananaSplit,
        uint256 tokenIndex,
        uint256 _ratio,
        address _acceptedToken
    );

    constructor(address _originalBanana) {
        if (_originalBanana == address(0x0)) revert("Error: zero address");
        originalBanana = _originalBanana;
    }

    function CreateNewToken(
        string memory _name,
        string memory _symbol,
        uint256 _ratio,
        address _acceptedToken
    ) external onlyOwner returns (uint256) {
        bytes32 salt = keccak256(
            abi.encodePacked(_name, _symbol, _ratio, _acceptedToken)
        );
        uint256 index = bananaSplitArray.length + 1;
        address newBananaSplit = Clones.cloneDeterministic(
            address(originalBanana),
            salt
        );

        bananaSplitArray.push(newBananaSplit);

        emit BananaSwapCreated(newBananaSplit, index, _ratio, _acceptedToken);
        TokenB(newBananaSplit).initialize(
            _name,
            _symbol,
            _ratio,
            _acceptedToken,
            address(this)
        );

        return index;
    }

    function getBananaSwap(uint256 _tokenIndex)
        external
        view
        returns (address)
    {
        return address(bananaSplitArray[_tokenIndex]);
    }

    function getLength() external view returns (uint256) {
        return bananaSplitArray.length;
    }
}
