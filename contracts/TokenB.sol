// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenB is ERC20, Pausable, Ownable {
    using SafeERC20 for IERC20;

    ///@notice the ratio for the swap function

    uint256 public ratio;

    ///@notice this will track the balance of the token before each execution of the swap functions

    mapping(address => uint256) public balancePeerToken;

    address public acceptedToken;

    event SwapEvent(
        address tokenDeposited,
        address tokenSended,
        address depositor,
        address sender,
        uint256 amountDeposited,
        uint256 amountSended
    );

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _ratio,
        address _acceptedToken,
        address _owner
    ) ERC20(_name, _symbol) {
        _mint(msg.sender, 100_000_000 * 10**decimals());
        ratio = _ratio;
        acceptedToken = _acceptedToken;
        transferOwnership(_owner);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address _to, uint256 _amount) public onlyOwner {
        if (_to == address(this)) balancePeerToken[address(this)] += _amount;
        _mint(_to, _amount);
    }

    /// @notice This functions swap a tokensA for tokensB with a ratio of 1:ratio
    /// @param _targetAmount is the amount the user wants to get, _depositAmount is the amount the user will deposit
    /// this difference is due the chance that the token might have fees/taxes
    /// this way the calculation of the taxes doesn't rely on the contract

    function swapTokensAForTokensB(
        uint256 _targetAmount,
        uint256 _depositAmount
    ) public {
        ///@notice that we save the old balance

        uint256 oldBalance = balancePeerToken[acceptedToken];

        balancePeerToken[acceptedToken] += _targetAmount;

        IERC20(acceptedToken).safeTransferFrom(
            msg.sender,
            address(this),
            _depositAmount
        );

        if (balancePeerToken[acceptedToken] - oldBalance != _targetAmount)
            revert(
                "Error: there is a discrepancy with the amount received and the target value"
            );

        _mint(msg.sender, _targetAmount * ratio);

        emit SwapEvent(
            address(acceptedToken),
            address(this),
            msg.sender,
            address(this),
            _targetAmount,
            _targetAmount * ratio
        );
    }

    function swapTokensBForTokensA(uint256 _amount) public {
        if (_amount % ratio != 0)
            revert(
                "Error: the division between the amount and the ratio must exact"
            );

        uint256 oldBalance = balancePeerToken[address(this)];

        balancePeerToken[address(this)] += _amount;

        IERC20(address(this)).safeTransferFrom(
            msg.sender,
            address(this),
            _amount
        );

        if (balancePeerToken[address(this)] - oldBalance != _amount)
            revert(
                "Error: there is a discrepancy with the amount received and the target value"
            );

        IERC20(acceptedToken).safeTransfer(msg.sender, _amount / ratio);

        emit SwapEvent(
            address(this),
            address(acceptedToken),
            msg.sender,
            address(this),
            _amount,
            _amount / ratio
        );
    }

    function withdrawTokens(uint256 _amount, address _token) public onlyOwner {
        IERC20(_token).safeTransferFrom(address(this), msg.sender, _amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
