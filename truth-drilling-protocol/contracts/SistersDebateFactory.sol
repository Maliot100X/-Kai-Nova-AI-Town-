// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Debate.sol";

interface IUniswapV2Router {
    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;
    function WETH() external pure returns (address);
}

contract SistersDebateFactory {
    address public immutable protocolAdmin;
    address public immutable kntwsToken;
    address public immutable uniswapRouter;
    
    address[] public allDebates;
    uint256 public protocolFeeBasisPoints = 500; // 5% fee
    uint256 public buybackPercentage = 100; // 100% of fee goes to buyback

    event DebateCreated(address indexed debateAddress, string question, address creator);
    event BuybackTriggered(uint256 ethAmount, uint256 tokenAmount);

    constructor(address _kntwsToken, address _uniswapRouter) {
        protocolAdmin = msg.sender;
        kntwsToken = _kntwsToken;
        uniswapRouter = _uniswapRouter;
    }

    function createDebate(
        string memory _question,
        string memory _desc,
        string memory _sideA,
        string memory _sideB,
        uint256 _duration
    ) external returns (address) {
        Debate newDebate = new Debate(
            _question,
            _desc,
            _sideA,
            _sideB,
            _duration,
            msg.sender,
            address(this), // Factory collects fees
            protocolFeeBasisPoints
        );
        
        allDebates.push(address(newDebate));
        emit DebateCreated(address(newDebate), _question, msg.sender);
        return address(newDebate);
    }

    // This function receives ETH fees from Debate contracts
    receive() external payable {
        if (msg.value > 0) {
            _buyBackAndBurn(msg.value);
        }
    }

    function _buyBackAndBurn(uint256 ethAmount) internal {
        // Define the path: WETH -> KNTWS
        address[] memory path = new address[](2);
        path[0] = IUniswapV2Router(uniswapRouter).WETH();
        path[1] = kntwsToken;

        // Execute the Swap: ETH -> KNTWS
        // The tokens are sent to 0xdead (Burn) or the treasury
        // For max pump effect, we burn them or hold them.
        IUniswapV2Router(uniswapRouter).swapExactETHForTokensSupportingFeeOnTransferTokens{value: ethAmount}(
            0, // Accept any amount of tokens
            path,
            address(0x000000000000000000000000000000000000dEaD), // BURN ADDRESS
            block.timestamp
        );
        
        emit BuybackTriggered(ethAmount, 0); 
    }
}
