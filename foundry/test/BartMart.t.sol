// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";
import {BartMart} from "../src/BartMart.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";

// Mock ERC20 token for testing
contract MockERC20 is IERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    uint256 private _totalSupply;

    string public name;
    string public symbol;
    uint8 public decimals;

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
        decimals = 18;
    }

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 amount) external override returns (bool) {
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        _balances[msg.sender] -= amount;
        _balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function allowance(address owner, address spender) external view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external override returns (bool) {
        require(_balances[from] >= amount, "Insufficient balance");
        require(_allowances[from][msg.sender] >= amount, "Insufficient allowance");
        _balances[from] -= amount;
        _balances[to] += amount;
        _allowances[from][msg.sender] -= amount;
        emit Transfer(from, to, amount);
        return true;
    }

    function mint(address to, uint256 amount) external {
        _balances[to] += amount;
        _totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }
}

contract BartMartTest is Test {
    BartMart public bartMart;
    MockERC20 public token;
    MockERC20 public token2;

    address public creator = address(1);
    address public fulfiller = address(2);
    address public other = address(3);

    uint256 public constant INITIAL_TOKEN_BALANCE = 1000 ether;
    uint256 public constant ORDER_TOKEN_AMOUNT = 100 ether;
    uint256 public constant ORDER_ETH_AMOUNT = 1 ether;

    function setUp() public {
        bartMart = new BartMart();
        token = new MockERC20("Test Token", "TEST");
        token2 = new MockERC20("Test Token 2", "TEST2");

        // Mint tokens to fulfiller and creator
        token.mint(fulfiller, INITIAL_TOKEN_BALANCE);
        token.mint(creator, INITIAL_TOKEN_BALANCE);
        token2.mint(fulfiller, INITIAL_TOKEN_BALANCE);
        token2.mint(creator, INITIAL_TOKEN_BALANCE);

        // Give ETH to creator and fulfiller
        vm.deal(creator, 10 ether);
        vm.deal(fulfiller, 10 ether);
    }

    // ============ createOrder Tests ============

    function test_CreateOrder_ETHToToken() public {
        vm.prank(creator);
        uint256 orderId = bartMart.createOrder{value: ORDER_ETH_AMOUNT}(
            address(0), // inputToken: ETH
            ORDER_ETH_AMOUNT,
            address(token), // outputToken
            ORDER_TOKEN_AMOUNT
        );

        assertEq(orderId, 0);
        assertEq(bartMart.orderCounter(), 1);

        (
            address orderCreator,
            address inputToken,
            uint256 inputAmount,
            address outputToken,
            uint256 outputAmount,
            bool fulfilled,
            bool cancelled
        ) = bartMart.getOrder(orderId);

        assertEq(orderCreator, creator);
        assertEq(inputToken, address(0));
        assertEq(inputAmount, ORDER_ETH_AMOUNT);
        assertEq(outputToken, address(token));
        assertEq(outputAmount, ORDER_TOKEN_AMOUNT);
        assertFalse(fulfilled);
        assertFalse(cancelled);
    }

    function test_CreateOrder_EmitsEvent() public {
        vm.expectEmit(true, true, true, false);
        emit BartMart.OrderCreated(0, creator, address(0), ORDER_ETH_AMOUNT, address(token), ORDER_TOKEN_AMOUNT);

        vm.prank(creator);
        bartMart.createOrder{value: ORDER_ETH_AMOUNT}(address(0), ORDER_ETH_AMOUNT, address(token), ORDER_TOKEN_AMOUNT);
    }

    function test_CreateOrder_MultipleOrders() public {
        vm.prank(creator);
        uint256 orderId1 = bartMart.createOrder{value: ORDER_ETH_AMOUNT}(
            address(0), ORDER_ETH_AMOUNT, address(token), ORDER_TOKEN_AMOUNT
        );

        vm.prank(creator);
        uint256 orderId2 = bartMart.createOrder{value: ORDER_ETH_AMOUNT * 2}(
            address(0), ORDER_ETH_AMOUNT * 2, address(token), ORDER_TOKEN_AMOUNT * 2
        );

        assertEq(orderId1, 0);
        assertEq(orderId2, 1);
        assertEq(bartMart.orderCounter(), 2);
    }

    function test_CreateOrder_RevertIf_InvalidTokenPair() public {
        vm.prank(creator);
        vm.expectRevert(BartMart.InvalidTokenPair.selector);
        bartMart.createOrder{value: ORDER_ETH_AMOUNT}(
            address(token),
            ORDER_TOKEN_AMOUNT,
            address(token), // Same token
            ORDER_TOKEN_AMOUNT
        );
    }

    function test_CreateOrder_RevertIf_ZeroInputAmount() public {
        vm.prank(creator);
        vm.expectRevert(BartMart.InvalidAmount.selector);
        bartMart.createOrder{value: 0}(address(0), 0, address(token), ORDER_TOKEN_AMOUNT);
    }

    function test_CreateOrder_RevertIf_ZeroOutputAmount() public {
        vm.prank(creator);
        vm.expectRevert(BartMart.InvalidAmount.selector);
        bartMart.createOrder{value: ORDER_ETH_AMOUNT}(address(0), ORDER_ETH_AMOUNT, address(token), 0);
    }

    function test_CreateOrder_RevertIf_EthAmountMismatch() public {
        vm.prank(creator);
        vm.expectRevert(BartMart.InsufficientETH.selector);
        bartMart.createOrder{value: ORDER_ETH_AMOUNT / 2}(
            address(0), ORDER_ETH_AMOUNT, address(token), ORDER_TOKEN_AMOUNT
        );
    }

    // ============ fulfilOrder Tests ============

    function test_FulfilOrder_ETHToToken() public {
        // Create ETH -> Token order
        vm.prank(creator);
        uint256 orderId = bartMart.createOrder{value: ORDER_ETH_AMOUNT}(
            address(0), ORDER_ETH_AMOUNT, address(token), ORDER_TOKEN_AMOUNT
        );

        uint256 creatorTokenBalanceBefore = token.balanceOf(creator);
        uint256 fulfillerEthBalanceBefore = fulfiller.balance;
        uint256 fulfillerTokenBalanceBefore = token.balanceOf(fulfiller);

        // Approve tokens
        vm.prank(fulfiller);
        token.approve(address(bartMart), ORDER_TOKEN_AMOUNT);

        // Fulfill order
        vm.prank(fulfiller);
        bartMart.fulfilOrder(orderId);

        // Check balances
        assertEq(token.balanceOf(creator), creatorTokenBalanceBefore + ORDER_TOKEN_AMOUNT);
        assertEq(fulfiller.balance, fulfillerEthBalanceBefore + ORDER_ETH_AMOUNT);
        assertEq(token.balanceOf(fulfiller), fulfillerTokenBalanceBefore - ORDER_TOKEN_AMOUNT);

        // Check order status
        (,,,,, bool fulfilled, bool cancelled) = bartMart.getOrder(orderId);
        assertTrue(fulfilled);
        assertFalse(cancelled);
    }

    function test_FulfilOrder_EmitsEvent() public {
        // Create order
        vm.prank(creator);
        uint256 orderId = bartMart.createOrder{value: ORDER_ETH_AMOUNT}(
            address(0), ORDER_ETH_AMOUNT, address(token), ORDER_TOKEN_AMOUNT
        );

        // Approve tokens
        vm.prank(fulfiller);
        token.approve(address(bartMart), ORDER_TOKEN_AMOUNT);

        // Expect event
        vm.expectEmit(true, true, true, false);
        emit BartMart.OrderFulfilled(
            orderId, fulfiller, creator, address(0), ORDER_ETH_AMOUNT, address(token), ORDER_TOKEN_AMOUNT
        );

        // Fulfill order
        vm.prank(fulfiller);
        bartMart.fulfilOrder(orderId);
    }

    function test_FulfilOrder_RevertIf_OrderNotFound() public {
        vm.prank(fulfiller);
        vm.expectRevert(BartMart.OrderNotFound.selector);
        bartMart.fulfilOrder(999);
    }

    function test_FulfilOrder_RevertIf_AlreadyFulfilled() public {
        // Create and fulfill order
        vm.prank(creator);
        uint256 orderId = bartMart.createOrder{value: ORDER_ETH_AMOUNT}(
            address(0), ORDER_ETH_AMOUNT, address(token), ORDER_TOKEN_AMOUNT
        );

        vm.prank(fulfiller);
        token.approve(address(bartMart), ORDER_TOKEN_AMOUNT);
        vm.prank(fulfiller);
        bartMart.fulfilOrder(orderId);

        // Try to fulfill again
        vm.prank(fulfiller);
        token.approve(address(bartMart), ORDER_TOKEN_AMOUNT);
        vm.prank(fulfiller);
        vm.expectRevert(BartMart.OrderAlreadyFulfilled.selector);
        bartMart.fulfilOrder(orderId);
    }

    function test_FulfilOrder_RevertIf_OrderCancelled() public {
        // Create and cancel order
        vm.prank(creator);
        uint256 orderId = bartMart.createOrder{value: ORDER_ETH_AMOUNT}(
            address(0), ORDER_ETH_AMOUNT, address(token), ORDER_TOKEN_AMOUNT
        );

        vm.prank(creator);
        bartMart.cancelOrder(orderId);

        // Try to fulfill cancelled order
        vm.prank(fulfiller);
        token.approve(address(bartMart), ORDER_TOKEN_AMOUNT);
        vm.prank(fulfiller);
        vm.expectRevert(BartMart.OrderIsCancelled.selector);
        bartMart.fulfilOrder(orderId);
    }

    function test_FulfilOrder_RevertIf_InsufficientAllowance() public {
        // Create order
        vm.prank(creator);
        uint256 orderId = bartMart.createOrder{value: ORDER_ETH_AMOUNT}(
            address(0), ORDER_ETH_AMOUNT, address(token), ORDER_TOKEN_AMOUNT
        );

        // Approve insufficient amount
        vm.prank(fulfiller);
        token.approve(address(bartMart), ORDER_TOKEN_AMOUNT / 2);

        // Try to fulfill
        vm.prank(fulfiller);
        vm.expectRevert(BartMart.InsufficientTokenAllowance.selector);
        bartMart.fulfilOrder(orderId);
    }

    function test_FulfilOrder_RevertIf_NoAllowance() public {
        // Create order
        vm.prank(creator);
        uint256 orderId = bartMart.createOrder{value: ORDER_ETH_AMOUNT}(
            address(0), ORDER_ETH_AMOUNT, address(token), ORDER_TOKEN_AMOUNT
        );

        // Try to fulfill without approval
        vm.prank(fulfiller);
        vm.expectRevert(BartMart.InsufficientTokenAllowance.selector);
        bartMart.fulfilOrder(orderId);
    }

    // ============ cancelOrder Tests ============

    function test_CancelOrder() public {
        // Create order
        vm.prank(creator);
        uint256 orderId = bartMart.createOrder{value: ORDER_ETH_AMOUNT}(
            address(0), ORDER_ETH_AMOUNT, address(token), ORDER_TOKEN_AMOUNT
        );

        uint256 creatorEthBalanceBefore = creator.balance;

        // Cancel order
        vm.prank(creator);
        bartMart.cancelOrder(orderId);

        // Check ETH refunded
        assertEq(creator.balance, creatorEthBalanceBefore + ORDER_ETH_AMOUNT);

        // Check order status
        (,,,,, bool fulfilled, bool cancelled) = bartMart.getOrder(orderId);
        assertFalse(fulfilled);
        assertTrue(cancelled);
    }

    function test_CancelOrder_EmitsEvent() public {
        // Create order
        vm.prank(creator);
        uint256 orderId = bartMart.createOrder{value: ORDER_ETH_AMOUNT}(
            address(0), ORDER_ETH_AMOUNT, address(token), ORDER_TOKEN_AMOUNT
        );

        // Expect event
        vm.expectEmit(true, true, false, false);
        emit BartMart.OrderCancelled(orderId, creator);

        // Cancel order
        vm.prank(creator);
        bartMart.cancelOrder(orderId);
    }

    function test_CancelOrder_RevertIf_OrderNotFound() public {
        vm.prank(creator);
        vm.expectRevert(BartMart.OrderNotFound.selector);
        bartMart.cancelOrder(999);
    }

    function test_CancelOrder_RevertIf_AlreadyFulfilled() public {
        // Create and fulfill order
        vm.prank(creator);
        uint256 orderId = bartMart.createOrder{value: ORDER_ETH_AMOUNT}(
            address(0), ORDER_ETH_AMOUNT, address(token), ORDER_TOKEN_AMOUNT
        );

        vm.prank(fulfiller);
        token.approve(address(bartMart), ORDER_TOKEN_AMOUNT);
        vm.prank(fulfiller);
        bartMart.fulfilOrder(orderId);

        // Try to cancel fulfilled order
        vm.prank(creator);
        vm.expectRevert(BartMart.OrderAlreadyFulfilled.selector);
        bartMart.cancelOrder(orderId);
    }

    function test_CancelOrder_RevertIf_AlreadyCancelled() public {
        // Create and cancel order
        vm.prank(creator);
        uint256 orderId = bartMart.createOrder{value: ORDER_ETH_AMOUNT}(
            address(0), ORDER_ETH_AMOUNT, address(token), ORDER_TOKEN_AMOUNT
        );

        vm.prank(creator);
        bartMart.cancelOrder(orderId);

        // Try to cancel again
        vm.prank(creator);
        vm.expectRevert(BartMart.OrderIsCancelled.selector);
        bartMart.cancelOrder(orderId);
    }

    function test_CancelOrder_RevertIf_NotCreator() public {
        // Create order
        vm.prank(creator);
        uint256 orderId = bartMart.createOrder{value: ORDER_ETH_AMOUNT}(
            address(0), ORDER_ETH_AMOUNT, address(token), ORDER_TOKEN_AMOUNT
        );

        // Try to cancel as non-creator
        vm.prank(fulfiller);
        vm.expectRevert("Only creator can cancel order");
        bartMart.cancelOrder(orderId);
    }

    // ============ getOrder Tests ============

    function test_GetOrder() public {
        // Create order
        vm.prank(creator);
        uint256 orderId = bartMart.createOrder{value: ORDER_ETH_AMOUNT}(
            address(0), ORDER_ETH_AMOUNT, address(token), ORDER_TOKEN_AMOUNT
        );

        (
            address orderCreator,
            address inputToken,
            uint256 inputAmount,
            address outputToken,
            uint256 outputAmount,
            bool fulfilled,
            bool cancelled
        ) = bartMart.getOrder(orderId);

        assertEq(orderCreator, creator);
        assertEq(inputToken, address(0));
        assertEq(inputAmount, ORDER_ETH_AMOUNT);
        assertEq(outputToken, address(token));
        assertEq(outputAmount, ORDER_TOKEN_AMOUNT);
        assertFalse(fulfilled);
        assertFalse(cancelled);
    }

    function test_GetOrder_NonExistentOrder() public {
        (
            address orderCreator,
            address inputToken,
            uint256 inputAmount,
            address outputToken,
            uint256 outputAmount,
            bool fulfilled,
            bool cancelled
        ) = bartMart.getOrder(999);

        assertEq(orderCreator, address(0));
        assertEq(inputToken, address(0));
        assertEq(inputAmount, 0);
        assertEq(outputToken, address(0));
        assertEq(outputAmount, 0);
        assertFalse(fulfilled);
        assertFalse(cancelled);
    }

    // ============ Integration Tests ============

    function test_FullFlow_CreateFulfillCancel() public {
        // Create order
        vm.prank(creator);
        uint256 orderId = bartMart.createOrder{value: ORDER_ETH_AMOUNT}(
            address(0), ORDER_ETH_AMOUNT, address(token), ORDER_TOKEN_AMOUNT
        );

        // Verify order created
        (,,,,, bool fulfilled, bool cancelled) = bartMart.getOrder(orderId);
        assertFalse(fulfilled);
        assertFalse(cancelled);

        // Fulfill order
        vm.prank(fulfiller);
        token.approve(address(bartMart), ORDER_TOKEN_AMOUNT);
        vm.prank(fulfiller);
        bartMart.fulfilOrder(orderId);

        // Verify order fulfilled
        (,,,,, fulfilled, cancelled) = bartMart.getOrder(orderId);
        assertTrue(fulfilled);
        assertFalse(cancelled);

        // Verify balances
        assertEq(token.balanceOf(creator), INITIAL_TOKEN_BALANCE + ORDER_TOKEN_AMOUNT);
        assertEq(fulfiller.balance, 10 ether + ORDER_ETH_AMOUNT);
    }

    function test_MultipleOrders_DifferentFulfillers() public {
        // Create two orders
        vm.prank(creator);
        uint256 orderId1 = bartMart.createOrder{value: ORDER_ETH_AMOUNT}(
            address(0), ORDER_ETH_AMOUNT, address(token), ORDER_TOKEN_AMOUNT
        );

        vm.prank(creator);
        uint256 orderId2 = bartMart.createOrder{value: ORDER_ETH_AMOUNT * 2}(
            address(0), ORDER_ETH_AMOUNT * 2, address(token), ORDER_TOKEN_AMOUNT * 2
        );

        // Fulfill first order
        vm.prank(fulfiller);
        token.approve(address(bartMart), ORDER_TOKEN_AMOUNT);
        vm.prank(fulfiller);
        bartMart.fulfilOrder(orderId1);

        // Setup second fulfiller
        address fulfiller2 = address(4);
        vm.deal(fulfiller2, 10 ether);
        token.mint(fulfiller2, INITIAL_TOKEN_BALANCE);

        // Fulfill second order
        vm.prank(fulfiller2);
        token.approve(address(bartMart), ORDER_TOKEN_AMOUNT * 2);
        vm.prank(fulfiller2);
        bartMart.fulfilOrder(orderId2);

        // Verify both orders fulfilled
        (,,,,, bool fulfilled1,) = bartMart.getOrder(orderId1);
        (,,,,, bool fulfilled2,) = bartMart.getOrder(orderId2);
        assertTrue(fulfilled1);
        assertTrue(fulfilled2);

        // Verify balances
        assertEq(token.balanceOf(creator), INITIAL_TOKEN_BALANCE + ORDER_TOKEN_AMOUNT * 3);
        assertEq(fulfiller.balance, 10 ether + ORDER_ETH_AMOUNT);
        assertEq(fulfiller2.balance, 10 ether + ORDER_ETH_AMOUNT * 2);
    }

    // ============ Token -> ETH Tests ============

    function test_CreateOrder_TokenToETH() public {
        vm.prank(creator);
        token.approve(address(bartMart), ORDER_TOKEN_AMOUNT);

        vm.prank(creator);
        uint256 orderId = bartMart.createOrder(
            address(token),
            ORDER_TOKEN_AMOUNT,
            address(0), // outputToken: ETH
            ORDER_ETH_AMOUNT
        );

        assertEq(orderId, 0);
        assertEq(bartMart.orderCounter(), 1);

        (
            address orderCreator,
            address inputToken,
            uint256 inputAmount,
            address outputToken,
            uint256 outputAmount,
            bool fulfilled,
            bool cancelled
        ) = bartMart.getOrder(orderId);

        assertEq(orderCreator, creator);
        assertEq(inputToken, address(token));
        assertEq(inputAmount, ORDER_TOKEN_AMOUNT);
        assertEq(outputToken, address(0));
        assertEq(outputAmount, ORDER_ETH_AMOUNT);
        assertFalse(fulfilled);
        assertFalse(cancelled);
    }

    function test_FulfilOrder_TokenToETH() public {
        // Create Token -> ETH order
        vm.prank(creator);
        token.approve(address(bartMart), ORDER_TOKEN_AMOUNT);
        vm.prank(creator);
        uint256 orderId = bartMart.createOrder(address(token), ORDER_TOKEN_AMOUNT, address(0), ORDER_ETH_AMOUNT);

        uint256 creatorEthBalanceBefore = creator.balance;
        uint256 fulfillerTokenBalanceBefore = token.balanceOf(fulfiller);
        uint256 fulfillerEthBalanceBefore = fulfiller.balance;

        // Fulfill order (fulfiller sends ETH)
        vm.prank(fulfiller);
        bartMart.fulfilOrder{value: ORDER_ETH_AMOUNT}(orderId);

        // Check balances
        assertEq(creator.balance, creatorEthBalanceBefore + ORDER_ETH_AMOUNT);
        assertEq(token.balanceOf(fulfiller), fulfillerTokenBalanceBefore + ORDER_TOKEN_AMOUNT);
        assertEq(fulfiller.balance, fulfillerEthBalanceBefore - ORDER_ETH_AMOUNT);

        // Check order status
        (,,,,, bool fulfilled, bool cancelled) = bartMart.getOrder(orderId);
        assertTrue(fulfilled);
        assertFalse(cancelled);
    }

    function test_CancelOrder_TokenToETH() public {
        // Create Token -> ETH order
        vm.prank(creator);
        token.approve(address(bartMart), ORDER_TOKEN_AMOUNT);
        vm.prank(creator);
        uint256 orderId = bartMart.createOrder(address(token), ORDER_TOKEN_AMOUNT, address(0), ORDER_ETH_AMOUNT);

        uint256 creatorTokenBalanceBefore = token.balanceOf(creator);

        // Cancel order
        vm.prank(creator);
        bartMart.cancelOrder(orderId);

        // Check tokens refunded
        assertEq(token.balanceOf(creator), creatorTokenBalanceBefore + ORDER_TOKEN_AMOUNT);

        // Check order status
        (,,,,, bool fulfilled, bool cancelled) = bartMart.getOrder(orderId);
        assertFalse(fulfilled);
        assertTrue(cancelled);
    }

    // ============ Token -> Token Tests ============

    function test_CreateOrder_TokenToToken() public {
        vm.prank(creator);
        token.approve(address(bartMart), ORDER_TOKEN_AMOUNT);

        vm.prank(creator);
        uint256 orderId =
            bartMart.createOrder(address(token), ORDER_TOKEN_AMOUNT, address(token2), ORDER_TOKEN_AMOUNT * 2);

        assertEq(orderId, 0);
        assertEq(bartMart.orderCounter(), 1);

        (
            address orderCreator,
            address inputToken,
            uint256 inputAmount,
            address outputToken,
            uint256 outputAmount,
            bool fulfilled,
            bool cancelled
        ) = bartMart.getOrder(orderId);

        assertEq(orderCreator, creator);
        assertEq(inputToken, address(token));
        assertEq(inputAmount, ORDER_TOKEN_AMOUNT);
        assertEq(outputToken, address(token2));
        assertEq(outputAmount, ORDER_TOKEN_AMOUNT * 2);
        assertFalse(fulfilled);
        assertFalse(cancelled);
    }

    function test_FulfilOrder_TokenToToken() public {
        // Create Token -> Token order
        vm.prank(creator);
        token.approve(address(bartMart), ORDER_TOKEN_AMOUNT);
        vm.prank(creator);
        uint256 orderId =
            bartMart.createOrder(address(token), ORDER_TOKEN_AMOUNT, address(token2), ORDER_TOKEN_AMOUNT * 2);

        uint256 creatorToken2BalanceBefore = token2.balanceOf(creator);
        uint256 fulfillerTokenBalanceBefore = token.balanceOf(fulfiller);
        uint256 fulfillerToken2BalanceBefore = token2.balanceOf(fulfiller);

        // Approve output tokens
        vm.prank(fulfiller);
        token2.approve(address(bartMart), ORDER_TOKEN_AMOUNT * 2);

        // Fulfill order
        vm.prank(fulfiller);
        bartMart.fulfilOrder(orderId);

        // Check balances
        assertEq(token2.balanceOf(creator), creatorToken2BalanceBefore + ORDER_TOKEN_AMOUNT * 2);
        assertEq(token.balanceOf(fulfiller), fulfillerTokenBalanceBefore + ORDER_TOKEN_AMOUNT);
        assertEq(token2.balanceOf(fulfiller), fulfillerToken2BalanceBefore - ORDER_TOKEN_AMOUNT * 2);

        // Check order status
        (,,,,, bool fulfilled, bool cancelled) = bartMart.getOrder(orderId);
        assertTrue(fulfilled);
        assertFalse(cancelled);
    }

    function test_CancelOrder_TokenToToken() public {
        // Create Token -> Token order
        vm.prank(creator);
        token.approve(address(bartMart), ORDER_TOKEN_AMOUNT);
        vm.prank(creator);
        uint256 orderId =
            bartMart.createOrder(address(token), ORDER_TOKEN_AMOUNT, address(token2), ORDER_TOKEN_AMOUNT * 2);

        uint256 creatorTokenBalanceBefore = token.balanceOf(creator);

        // Cancel order
        vm.prank(creator);
        bartMart.cancelOrder(orderId);

        // Check tokens refunded
        assertEq(token.balanceOf(creator), creatorTokenBalanceBefore + ORDER_TOKEN_AMOUNT);

        // Check order status
        (,,,,, bool fulfilled, bool cancelled) = bartMart.getOrder(orderId);
        assertFalse(fulfilled);
        assertTrue(cancelled);
    }
}

