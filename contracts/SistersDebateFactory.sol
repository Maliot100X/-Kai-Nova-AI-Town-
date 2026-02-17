// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Debate.sol";

contract SistersDebateFactory {
    address public immutable creatorWallet = 0x1909b332397144aeb4867B7274a05Dbb25bD1Fec;
    uint256 public constant PROTOCOL_FEE = 1000; // 10% in basis points

    address[] public allDebates;
    mapping(address => bool) public isLegitDebate;

    event DebateCreated(address indexed debateAddress, string question, address creator);

    function createDebate(
        string memory _question,
        string memory _description,
        string memory _sideA,
        string memory _sideB,
        uint256 _duration
    ) external returns (address) {
        Debate newDebate = new Debate(
            _question,
            _description,
            _sideA,
            _sideB,
            _duration,
            msg.sender,
            creatorWallet,
            PROTOCOL_FEE
        );
        
        allDebates.push(address(newDebate));
        isLegitDebate[address(newDebate)] = true;

        emit DebateCreated(address(newDebate), _question, msg.sender);
        return address(newDebate);
    }

    function getActiveDebatesCount() external view returns (uint256) {
        return allDebates.length;
    }

    function getAllDebates() external view returns (address[] memory) {
        return allDebates;
    }
}
