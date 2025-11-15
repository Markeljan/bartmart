// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {IERC20} from "forge-std/interfaces/IERC20.sol";

contract BartMart {
    // Use address(0) to represent ETH
    struct Order {
        address creator;
        address inputToken; // address(0) for ETH, otherwise ERC20 token address
        uint256 inputAmount;
        address outputToken; // address(0) for ETH, otherwise ERC20 token address
        uint256 outputAmount;
        bool fulfilled;
        bool cancelled;
    }

    mapping(uint256 => Order) public orders;
    uint256 public orderCounter;

    event OrderCreated(
        uint256 indexed orderId,
        address indexed creator,
        address indexed inputToken,
        uint256 inputAmount,
        address outputToken,
        uint256 outputAmount
    );

    event OrderFulfilled(
        uint256 indexed orderId,
        address indexed fulfiller,
        address indexed creator,
        address inputToken,
        uint256 inputAmount,
        address outputToken,
        uint256 outputAmount
    );

    event OrderCancelled(uint256 indexed orderId, address indexed creator);

    error OrderNotFound();
    error OrderAlreadyFulfilled();
    error OrderIsCancelled();
    error InsufficientETH();
    error InsufficientTokenAllowance();
    error TransferFailed();
    error InvalidTokenPair();
    error InvalidAmount();

    /**
     * @notice Create a new swap order
     * @param inputToken The input token address (address(0) for ETH)
     * @param inputAmount The amount of input tokens/ETH
     * @param outputToken The output token address (address(0) for ETH)
     * @param outputAmount The amount of output tokens/ETH desired
     * @return orderId The ID of the created order
     */
    function createOrder(address inputToken, uint256 inputAmount, address outputToken, uint256 outputAmount)
        external
        payable
        returns (uint256 orderId)
    {
        // Validate amounts
        if (inputAmount == 0 || outputAmount == 0) {
            revert InvalidAmount();
        }

        // Cannot swap same token to itself
        if (inputToken == outputToken) {
            revert InvalidTokenPair();
        }

        orderId = orderCounter++;

        // Handle ETH input (inputToken is address(0))
        if (inputToken == address(0)) {
            if (msg.value != inputAmount) {
                revert InsufficientETH();
            }
            // ETH is already in the contract via msg.value
        } else {
            // Handle token input
            if (msg.value != 0) {
                revert InsufficientETH(); // Should not send ETH when using token input
            }
            IERC20 token = IERC20(inputToken);
            uint256 allowance = token.allowance(msg.sender, address(this));
            if (allowance < inputAmount) {
                revert InsufficientTokenAllowance();
            }
            // Transfer tokens from creator to contract
            bool success = token.transferFrom(msg.sender, address(this), inputAmount);
            if (!success) {
                revert TransferFailed();
            }
        }

        orders[orderId] = Order({
            creator: msg.sender,
            inputToken: inputToken,
            inputAmount: inputAmount,
            outputToken: outputToken,
            outputAmount: outputAmount,
            fulfilled: false,
            cancelled: false
        });

        emit OrderCreated(orderId, msg.sender, inputToken, inputAmount, outputToken, outputAmount);
    }

    /**
     * @notice Fulfill an order by providing the output token/ETH and receiving the input token/ETH
     * @param orderId The ID of the order to fulfill
     */
    function fulfilOrder(uint256 orderId) external payable {
        Order storage order = orders[orderId];

        if (order.creator == address(0)) {
            revert OrderNotFound();
        }
        if (order.fulfilled) {
            revert OrderAlreadyFulfilled();
        }
        if (order.cancelled) {
            revert OrderIsCancelled();
        }

        // Handle output token (what fulfiller needs to provide)
        if (order.outputToken == address(0)) {
            // Output is ETH - fulfiller must send ETH
            if (msg.value < order.outputAmount) {
                revert InsufficientETH();
            }
            // Refund excess ETH if any
            if (msg.value > order.outputAmount) {
                (bool refundSent,) = payable(msg.sender).call{value: msg.value - order.outputAmount}("");
                if (!refundSent) {
                    revert TransferFailed();
                }
            }
        } else {
            // Output is a token - fulfiller must approve and transfer
            if (msg.value != 0) {
                revert InsufficientETH(); // Should not send ETH when using token output
            }
            IERC20 outputToken = IERC20(order.outputToken);
            uint256 allowance = outputToken.allowance(msg.sender, address(this));
            if (allowance < order.outputAmount) {
                revert InsufficientTokenAllowance();
            }
            // Transfer output tokens from fulfiller to contract
            bool success = outputToken.transferFrom(msg.sender, address(this), order.outputAmount);
            if (!success) {
                revert TransferFailed();
            }
        }

        // Mark order as fulfilled
        order.fulfilled = true;

        // Transfer input token/ETH from contract to fulfiller
        if (order.inputToken == address(0)) {
            // Input was ETH - send ETH to fulfiller
            (bool ethSent,) = payable(msg.sender).call{value: order.inputAmount}("");
            if (!ethSent) {
                revert TransferFailed();
            }
        } else {
            // Input was a token - send tokens to fulfiller
            IERC20 inputToken = IERC20(order.inputToken);
            bool success = inputToken.transfer(msg.sender, order.inputAmount);
            if (!success) {
                revert TransferFailed();
            }
        }

        // Transfer output token/ETH from contract to creator
        if (order.outputToken == address(0)) {
            // Output is ETH - send ETH to creator
            (bool ethSent,) = payable(order.creator).call{value: order.outputAmount}("");
            if (!ethSent) {
                revert TransferFailed();
            }
        } else {
            // Output is a token - send tokens to creator
            IERC20 outputToken = IERC20(order.outputToken);
            bool success = outputToken.transfer(order.creator, order.outputAmount);
            if (!success) {
                revert TransferFailed();
            }
        }

        emit OrderFulfilled(
            orderId,
            msg.sender,
            order.creator,
            order.inputToken,
            order.inputAmount,
            order.outputToken,
            order.outputAmount
        );
    }

    /**
     * @notice Cancel an order and refund input token/ETH to creator
     * @param orderId The ID of the order to cancel
     */
    function cancelOrder(uint256 orderId) external {
        Order storage order = orders[orderId];

        if (order.creator == address(0)) {
            revert OrderNotFound();
        }
        if (order.fulfilled) {
            revert OrderAlreadyFulfilled();
        }
        if (order.cancelled) {
            revert OrderIsCancelled();
        }
        require(msg.sender == order.creator, "Only creator can cancel order");

        order.cancelled = true;

        // Refund input token/ETH to creator
        if (order.inputToken == address(0)) {
            // Input was ETH - refund ETH
            (bool ethSent,) = payable(order.creator).call{value: order.inputAmount}("");
            if (!ethSent) {
                revert TransferFailed();
            }
        } else {
            // Input was a token - refund tokens
            IERC20 inputToken = IERC20(order.inputToken);
            bool success = inputToken.transfer(order.creator, order.inputAmount);
            if (!success) {
                revert TransferFailed();
            }
        }

        emit OrderCancelled(orderId, order.creator);
    }

    /**
     * @notice Get order details
     * @param orderId The ID of the order
     * @return creator The address of the order creator
     * @return inputToken The input token address (address(0) for ETH)
     * @return inputAmount The amount of input tokens/ETH
     * @return outputToken The output token address (address(0) for ETH)
     * @return outputAmount The amount of output tokens/ETH
     * @return fulfilled Whether the order is fulfilled
     * @return cancelled Whether the order is cancelled
     */
    function getOrder(uint256 orderId)
        external
        view
        returns (
            address creator,
            address inputToken,
            uint256 inputAmount,
            address outputToken,
            uint256 outputAmount,
            bool fulfilled,
            bool cancelled
        )
    {
        Order memory order = orders[orderId];
        return (
            order.creator,
            order.inputToken,
            order.inputAmount,
            order.outputToken,
            order.outputAmount,
            order.fulfilled,
            order.cancelled
        );
    }
}

