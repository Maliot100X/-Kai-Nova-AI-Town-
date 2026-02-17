// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DebateCore is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    struct DebateStruct {
        string title;
        string ipfsHash;
        address creator;
        uint256 endTime;
        uint256 yesPool;
        uint256 noPool;
        uint256 totalPool;
        bool resolved;
        bool winningSide; // false = NO, true = YES
    }

    DebateStruct public debate;
    address public factory;
    IERC20 public token;

    mapping(address => uint256) public stakeYes;
    mapping(address => uint256) public stakeNo;
    mapping(address => bool) public hasClaimed;

    event StakePlaced(address indexed user, bool side, uint256 amount, uint256 fid);
    event ArgumentSubmitted(address indexed user, string ipfsHash);
    event DebateResolved(bool winningSide);
    event RewardClaimed(address indexed user, uint256 amount);

    constructor(
        string memory _title,
        string memory _ipfsHash,
        uint256 _duration,
        address _creator,
        address _token
    ) Ownable() { // Initialize Ownable
        factory = msg.sender;
        token = IERC20(_token);
        
        debate.title = _title;
        debate.ipfsHash = _ipfsHash;
        debate.creator = _creator;
        debate.endTime = block.timestamp + _duration;
        debate.resolved = false;
        
        // Transfer ownership to creator immediately or keep factory as owner?
        // Standard practice: Factory keeps control or assigns governance.
        // For simplicity: Factory owner stays owner.
    }

    modifier onlyFactory() {
        require(msg.sender == factory, "Only Factory");
        _;
    }

    function stake(bool _side, uint256 _amount, uint256 _fid) external nonReentrant {
        require(block.timestamp < debate.endTime, "Debate ended: Staking closed");
        require(_amount > 0, "Amount must be > 0");
        
        // Checks-Effects-Interactions Pattern
        token.safeTransferFrom(msg.sender, address(this), _amount);

        if (_side) {
            stakeYes[msg.sender] += _amount;
            debate.yesPool += _amount;
        } else {
            stakeNo[msg.sender] += _amount;
            debate.noPool += _amount;
        }
        debate.totalPool += _amount;

        emit StakePlaced(msg.sender, _side, _amount, _fid);
    }

    function resolve(bool _winningSide) external onlyFactory {
        require(block.timestamp >= debate.endTime, "Cannot resolve before endTime");
        require(!debate.resolved, "Already resolved");

        debate.winningSide = _winningSide;
        debate.resolved = true;

        emit DebateResolved(_winningSide);
    }

    function claim() external nonReentrant {
        require(debate.resolved, "Not resolved yet");
        require(!hasClaimed[msg.sender], "Already claimed");

        uint256 userStake;
        uint256 winnerPool;
        uint256 loserPool;

        if (debate.winningSide) {
            userStake = stakeYes[msg.sender];
            winnerPool = debate.yesPool;
            loserPool = debate.noPool;
        } else {
            userStake = stakeNo[msg.sender];
            winnerPool = debate.noPool;
            loserPool = debate.yesPool;
        }

        require(userStake > 0, "No stake in winning side");

        // Calculate Reward: Original Stake + Share of Loser Pool
        // Share = (UserStake / WinnerPool) * LoserPool
        uint256 profit = (userStake * loserPool) / winnerPool;
        uint256 totalPayout = userStake + profit;

        hasClaimed[msg.sender] = true;

        token.safeTransfer(msg.sender, totalPayout);

        emit RewardClaimed(msg.sender, totalPayout);
    }
    
    function submitArgument(string memory _ipfsHash) external {
        require(block.timestamp < debate.endTime, "Debate ended");
        emit ArgumentSubmitted(msg.sender, _ipfsHash);
    }
}
