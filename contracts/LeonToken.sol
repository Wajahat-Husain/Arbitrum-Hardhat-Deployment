// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Leon is ERC20, ERC20Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 private _maxSupply = 120000000*10**18;

    constructor(address to) ERC20("Leon", "LON") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _mint(to, _maxSupply);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(totalSupply() + amount  <= getMaxSupply(),"Reached Max-Supply limit");
        _mint(to, amount);
    }

    function getMaxSupply() public view returns (uint256) {
        return _maxSupply;
    }

    function updateMaxSupply(uint256 amount)public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(amount >= totalSupply(),"Max-Supply should be greater then Total-Supply");
        _maxSupply = amount;
    }

}