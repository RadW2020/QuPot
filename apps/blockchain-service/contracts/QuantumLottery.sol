// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title QuantumLottery
 * @dev A lottery contract that uses quantum random numbers for draw results
 */
contract QuantumLottery is Ownable, ReentrancyGuard {
    // Lottery states
    enum LotteryState { CLOSED, OPEN, DRAWING, COMPLETED }
    
    // Lottery structure
    struct Lottery {
        uint256 drawId;
        uint256 startTime;
        uint256 endTime;
        LotteryState state;
        uint256 ticketPrice;
        uint256 totalPrize;
        uint256[] winningNumbers;
        bytes32 winningNumbersHash; // Hash of the winning numbers before revealing
    }
    
    // Ticket structure
    struct Ticket {
        uint256 drawId;
        address owner;
        uint256[] numbers;
        bool claimed;
        uint256 prize;
    }
    
    // Mappings
    mapping(uint256 => Lottery) public lotteries;
    mapping(uint256 => Ticket[]) public tickets;
    mapping(address => uint256[]) public userTickets;
    
    // Events
    event LotteryCreated(uint256 indexed drawId, uint256 startTime, uint256 endTime, uint256 ticketPrice);
    event TicketPurchased(uint256 indexed drawId, uint256 ticketId, address indexed buyer);
    event WinningNumbersSet(uint256 indexed drawId, bytes32 winningNumbersHash);
    event WinningNumbersRevealed(uint256 indexed drawId, uint256[] winningNumbers);
    event PrizeClaimed(uint256 indexed drawId, uint256 ticketId, address indexed winner, uint256 prize);
    
    // Constants
    uint256 public constant MAX_NUMBER = 59;
    uint256 public constant NUMBERS_PER_TICKET = 6;
    uint256 public constant PRIZE_DISTRIBUTION_PERCENT = 80; // 80% of ticket sales go to prizes
    
    // State variables
    uint256 public currentDrawId;
    uint256 public operatorFee;
    
    /**
     * @dev Constructor
     * @param _operatorFee Fee percentage taken by the operator (in basis points, e.g. 500 = 5%)
     */
    constructor(uint256 _operatorFee) {
        operatorFee = _operatorFee;
        currentDrawId = 1;
    }
    
    /**
     * @dev Create a new lottery draw
     * @param _startTime Start time of the lottery
     * @param _endTime End time of the lottery
     * @param _ticketPrice Price per ticket in wei
     */
    function createLottery(uint256 _startTime, uint256 _endTime, uint256 _ticketPrice) external onlyOwner {
        require(_startTime < _endTime, "End time must be after start time");
        require(_startTime > block.timestamp, "Start time must be in the future");
        require(_ticketPrice > 0, "Ticket price must be greater than zero");
        
        lotteries[currentDrawId] = Lottery({
            drawId: currentDrawId,
            startTime: _startTime,
            endTime: _endTime,
            state: LotteryState.OPEN,
            ticketPrice: _ticketPrice,
            totalPrize: 0,
            winningNumbers: new uint256[](0),
            winningNumbersHash: bytes32(0)
        });
        
        emit LotteryCreated(currentDrawId, _startTime, _endTime, _ticketPrice);
        
        currentDrawId++;
    }
    
    /**
     * @dev Purchase a lottery ticket
     * @param _drawId The lottery draw ID
     * @param _numbers The selected numbers for the ticket
     */
    function purchaseTicket(uint256 _drawId, uint256[] calldata _numbers) external payable nonReentrant {
        Lottery storage lottery = lotteries[_drawId];
        
        require(lottery.state == LotteryState.OPEN, "Lottery is not open for ticket purchases");
        require(block.timestamp >= lottery.startTime, "Lottery has not started yet");
        require(block.timestamp <= lottery.endTime, "Lottery has ended");
        require(msg.value == lottery.ticketPrice, "Incorrect ticket price");
        require(_numbers.length == NUMBERS_PER_TICKET, "Invalid number of selections");
        
        // Validate numbers are within range and unique
        bool[] memory used = new bool[](MAX_NUMBER + 1);
        for (uint256 i = 0; i < _numbers.length; i++) {
            require(_numbers[i] > 0 && _numbers[i] <= MAX_NUMBER, "Number out of range");
            require(!used[_numbers[i]], "Duplicate number");
            used[_numbers[i]] = true;
        }
        
        // Create the ticket
        uint256 ticketId = tickets[_drawId].length;
        tickets[_drawId].push(Ticket({
            drawId: _drawId,
            owner: msg.sender,
            numbers: _numbers,
            claimed: false,
            prize: 0
        }));
        
        // Update user's tickets
        userTickets[msg.sender].push(ticketId);
        
        // Update prize pool
        lottery.totalPrize += (msg.value * PRIZE_DISTRIBUTION_PERCENT) / 100;
        
        emit TicketPurchased(_drawId, ticketId, msg.sender);
    }
    
    /**
     * @dev Set the hash of winning numbers (committed before reveal)
     * @param _drawId The lottery draw ID
     * @param _winningNumbersHash Hash of the winning numbers
     */
    function setWinningNumbersHash(uint256 _drawId, bytes32 _winningNumbersHash) external onlyOwner {
        Lottery storage lottery = lotteries[_drawId];
        
        require(lottery.state == LotteryState.OPEN, "Lottery is not in open state");
        require(block.timestamp > lottery.endTime, "Lottery has not ended yet");
        
        lottery.state = LotteryState.DRAWING;
        lottery.winningNumbersHash = _winningNumbersHash;
        
        emit WinningNumbersSet(_drawId, _winningNumbersHash);
    }
    
    /**
     * @dev Reveal the winning numbers
     * @param _drawId The lottery draw ID
     * @param _winningNumbers The winning numbers
     * @param _salt Salt used in the hash commitment
     */
    function revealWinningNumbers(uint256 _drawId, uint256[] calldata _winningNumbers, bytes32 _salt) external onlyOwner {
        Lottery storage lottery = lotteries[_drawId];
        
        require(lottery.state == LotteryState.DRAWING, "Lottery is not in drawing state");
        require(_winningNumbers.length == NUMBERS_PER_TICKET, "Invalid number of winning numbers");
        
        // Verify hash matches commitment
        bytes32 hash = keccak256(abi.encodePacked(_winningNumbers, _salt));
        require(hash == lottery.winningNumbersHash, "Hash does not match commitment");
        
        // Validate numbers are within range and unique
        bool[] memory used = new bool[](MAX_NUMBER + 1);
        for (uint256 i = 0; i < _winningNumbers.length; i++) {
            require(_winningNumbers[i] > 0 && _winningNumbers[i] <= MAX_NUMBER, "Number out of range");
            require(!used[_winningNumbers[i]], "Duplicate number");
            used[_winningNumbers[i]] = true;
        }
        
        lottery.winningNumbers = _winningNumbers;
        lottery.state = LotteryState.COMPLETED;
        
        emit WinningNumbersRevealed(_drawId, _winningNumbers);
    }
    
    /**
     * @dev Claim prize for a winning ticket
     * @param _drawId The lottery draw ID
     * @param _ticketId The ticket ID
     */
    function claimPrize(uint256 _drawId, uint256 _ticketId) external nonReentrant {
        Lottery storage lottery = lotteries[_drawId];
        require(lottery.state == LotteryState.COMPLETED, "Lottery draw is not completed");
        
        Ticket storage ticket = tickets[_drawId][_ticketId];
        require(ticket.owner == msg.sender, "Not the ticket owner");
        require(!ticket.claimed, "Prize already claimed");
        
        uint256 matchCount = countMatches(_drawId, _ticketId);
        uint256 prize = calculatePrize(_drawId, matchCount);
        
        require(prize > 0, "No prize to claim");
        
        ticket.claimed = true;
        ticket.prize = prize;
        
        payable(msg.sender).transfer(prize);
        
        emit PrizeClaimed(_drawId, _ticketId, msg.sender, prize);
    }
    
    /**
     * @dev Count how many numbers match between ticket and winning numbers
     * @param _drawId The lottery draw ID
     * @param _ticketId The ticket ID
     * @return The count of matching numbers
     */
    function countMatches(uint256 _drawId, uint256 _ticketId) public view returns (uint256) {
        Lottery storage lottery = lotteries[_drawId];
        Ticket storage ticket = tickets[_drawId][_ticketId];
        
        require(lottery.state == LotteryState.COMPLETED, "Winning numbers not revealed yet");
        
        uint256 matches = 0;
        for (uint256 i = 0; i < ticket.numbers.length; i++) {
            for (uint256 j = 0; j < lottery.winningNumbers.length; j++) {
                if (ticket.numbers[i] == lottery.winningNumbers[j]) {
                    matches++;
                    break;
                }
            }
        }
        
        return matches;
    }
    
    /**
     * @dev Calculate prize based on match count
     * @param _drawId The lottery draw ID
     * @param _matchCount Number of matching numbers
     * @return The calculated prize amount
     */
    function calculatePrize(uint256 _drawId, uint256 _matchCount) public view returns (uint256) {
        if (_matchCount < 3) return 0;
        
        Lottery storage lottery = lotteries[_drawId];
        uint256 totalPrize = lottery.totalPrize;
        
        // Prize distribution based on match count
        // 3 matches: 10% of prize pool
        // 4 matches: 15% of prize pool
        // 5 matches: 25% of prize pool
        // 6 matches: 50% of prize pool
        
        if (_matchCount == 3) return (totalPrize * 10) / 100;
        if (_matchCount == 4) return (totalPrize * 15) / 100;
        if (_matchCount == 5) return (totalPrize * 25) / 100;
        if (_matchCount == 6) return (totalPrize * 50) / 100;
        
        return 0;
    }
    
    /**
     * @dev Withdraw operator fees
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev Get user's tickets
     * @param _user The user address
     * @return The list of ticket IDs owned by the user
     */
    function getUserTickets(address _user) external view returns (uint256[] memory) {
        return userTickets[_user];
    }
    
    /**
     * @dev Get ticket details
     * @param _drawId The lottery draw ID
     * @param _ticketId The ticket ID
     * @return The ticket details
     */
    function getTicket(uint256 _drawId, uint256 _ticketId) external view returns (Ticket memory) {
        return tickets[_drawId][_ticketId];
    }
    
    /**
     * @dev Get lottery details
     * @param _drawId The lottery draw ID
     * @return The lottery details
     */
    function getLottery(uint256 _drawId) external view returns (Lottery memory) {
        return lotteries[_drawId];
    }
}
