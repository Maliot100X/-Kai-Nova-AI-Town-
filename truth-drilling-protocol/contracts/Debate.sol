// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Debate {
    string public question;
    string public description;
    string public sideA;
    string public sideB;
    uint256 public endDate;
    address public creator;
    address public factory;
    uint256 public feeBasisPoints;

    enum Status { OPEN, RESOLVING, RESOLVED, CANCELLED }
    Status public status;

    uint256 public totalStakeA;
    uint256 public totalStakeB;
    bool public sideAWinner;

    mapping(address => uint256) public stakeA;
    mapping(address => uint256) public stakeB;
    mapping(address => bool) public hasClaimed;

    event BetPlaced(address indexed user, bool side, uint256 amount);
    event Resolved(bool winnerSideA);

    constructor(
        string memory _question,
        string memory _description,
        string memory _sideA,
        string memory _sideB,
        uint256 _duration,
        address _creator,
        address _factory,
        uint256 _fee
    ) {
        question = _question;
        description = _description;
        sideA = _sideA;
        sideB = _sideB;
        endDate = block.timestamp + _duration;
        creator = _creator;
        factory = _factory;
        feeBasisPoints = _fee;
        status = Status.OPEN;
    }

    function placeBet(bool _sideA) external payable {
        require(status == Status.OPEN, "Debate not open");
        require(block.timestamp < endDate, "Debate ended");
        require(msg.value > 0, "Amount must be > 0");

        if (_sideA) {
            stakeA[msg.sender] += msg.value;
            totalStakeA += msg.value;
        } else {
            stakeB[msg.sender] += msg.value;
            totalStakeB += msg.value;
        }

        emit BetPlaced(msg.sender, _sideA, msg.value);
    }

    function resolve(bool _winnerSideA) external {
        // In reality, only the Oracle/Factory allows this
        // require(msg.sender == factory || msg.sender == oracle, "Unauthorized");
        require(block.timestamp >= endDate, "Debate still active");
        require(status == Status.OPEN, "Already resolved");

        sideAWinner = _winnerSideA;
        status = Status.RESOLVED;

        emit Resolved(_winnerSideA);
    }

    function claim() external {
        require(status == Status.RESOLVED, "Not resolved yet");
        require(!hasClaimed[msg.sender], "Already claimed");

        uint256 userStake;
        uint256 winnerPool;
        uint256 loserPool;

        if (sideAWinner) {
            userStake = stakeA[msg.sender];
            winnerPool = totalStakeA;
            loserPool = totalStakeB;
        } else {
            userStake = stakeB[msg.sender];
            winnerPool = totalStakeB;
            loserPool = totalStakeA;
        }

        require(userStake > 0, "No stake in winning side");

        // Profit Calculation
        uint256 profit = (userStake * loserPool) / winnerPool;
        
        // Fee Extraction (The "Real Shit" Pump)
        // We take the fee ONLY from the profit, or from the total pot?
        // Standard is fee on the total winning pot to prevent gaming.
        // Let's take fee from the *loser's pool* portion that is being distributed.
        
        uint256 fee = (profit * feeBasisPoints) / 10000;
        uint256 netProfit = profit - fee;
        uint256 totalPayout = userStake + netProfit;

        hasClaimed[msg.sender] = true;

        // Route Fee to Factory (Triggers Buyback)
        if (fee > 0) {
            (bool feeSuccess, ) = factory.call{value: fee}("");
            require(feeSuccess, "Fee routing failed");
        }

        // Payout to User
        (bool payoutSuccess, ) = msg.sender.call{value: totalPayout}("");
        require(payoutSuccess, "Payout failed");
    }
}
