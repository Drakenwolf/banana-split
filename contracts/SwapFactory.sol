// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./TokenB.sol";
import "hardhat/console.sol";

contract SwapFactory is Ownable, Pausable {
    address[] public BananaSplitArray;
    address public originalBanana;

    event BananaSwapCreated(
        address bananaSplit,
        uint256 tokenIndex,
        uint256 _ratio,
        address _acceptedToken
    );

    constructor(address _originalBanana
    ) {
        originalBanana = _originalBanana;
    }

    function CreateNewToken(
        string memory _name,
        string memory _symbol,
        uint256 _ratio,
        address _acceptedToken
    ) public onlyOwner returns (uint256) {
        bytes32 salt = keccak256(
            abi.encodePacked(_name, _symbol, _ratio, _acceptedToken)
        );
        uint256 index = BananaSplitArray.length + 1;
        address newBananaSplit = Clones.cloneDeterministic(
            address(originalBanana),
            salt
        );

        emit BananaSwapCreated(newBananaSplit, index, _ratio, _acceptedToken);
        TokenB(newBananaSplit).initialize(
            _name,
            _symbol,
            _ratio,
            _acceptedToken,
            address(this)
        );
        BananaSplitArray.push(newBananaSplit);

        return index;
    }

    function getBananaSwap(uint256 _tokenIndex) public view returns (address) {
        return address(BananaSplitArray[_tokenIndex]);
    }
}
