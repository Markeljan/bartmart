import {
    type Address,
    type Chain,
    createPublicClient,
    createWalletClient,
    decodeEventLog,
    http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { z } from "zod";

// Contract ABI
const BARTMART_ABI = [
    {
        inputs: [
            { internalType: "address", name: "inputToken", type: "address" },
            { internalType: "uint256", name: "inputAmount", type: "uint256" },
            { internalType: "address", name: "outputToken", type: "address" },
            { internalType: "uint256", name: "outputAmount", type: "uint256" },
        ],
        name: "createOrder",
        outputs: [{ internalType: "uint256", name: "orderId", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "orderId", type: "uint256" }],
        name: "getOrder",
        outputs: [
            { internalType: "address", name: "creator", type: "address" },
            { internalType: "address", name: "inputToken", type: "address" },
            { internalType: "uint256", name: "inputAmount", type: "uint256" },
            { internalType: "address", name: "outputToken", type: "address" },
            { internalType: "uint256", name: "outputAmount", type: "uint256" },
            { internalType: "bool", name: "fulfilled", type: "bool" },
            { internalType: "bool", name: "cancelled", type: "bool" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "orderCounter",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
] as const;

// Contract address on Base
const BARTMART_ADDRESS =
    "0x03735E64c156d8C0D79a0cc5Fd979A95f67FC94C" as Address;

// ETH address (address(0))
const ETH_ADDRESS = "0x0000000000000000000000000000000000000000" as Address;

// Get RPC URL from environment or use default
function getRpcUrl(): string {
    return (
        process.env.BASE_RPC_URL ||
        "https://base-mainnet.g.alchemy.com/v2/uO_tPEMd7YY8g49_xLGGFp-8GMRxGcs8"
    );
}

// Initialize clients
function getClients() {
    const rpcUrl = getRpcUrl();
    const chain: Chain = base;

    const publicClient = createPublicClient({
        chain,
        transport: http(rpcUrl),
    });

    const accountPk = process.env.ACCOUNT_PK;
    if (!accountPk) {
        throw new Error(
            "ACCOUNT_PK environment variable is required for creating orders",
        );
    }

    const account = privateKeyToAccount(accountPk as `0x${string}`);
    const walletClient = createWalletClient({
        account,
        chain,
        transport: http(rpcUrl),
    });

    return { publicClient, walletClient, account };
}

// Helper to parse address (handle ETH)
function parseTokenAddress(address: string): Address {
    if (
        address.toLowerCase() === "eth" ||
        address.toLowerCase() === "0x0" ||
        address === "0x0000000000000000000000000000000000000000"
    ) {
        return ETH_ADDRESS;
    }
    return address as Address;
}

// Helper to parse amount string to bigint
function parseAmount(amount: string): bigint {
    try {
        return BigInt(amount);
    } catch {
        throw new Error(`Invalid amount: ${amount}`);
    }
}

/**
 * AI SDK compatible tool for creating an order on BartMart
 */
export const createOrderTool = {
    description:
        "Create a new swap order on BartMart. Supports ETH (use '0x0' or 'eth' for ETH) and ERC20 tokens. The order will be created using the ACCOUNT_PK private key.",
    parameters: z.object({
        inputToken: z
            .string()
            .describe("Input token address (use '0x0' or 'eth' for ETH)"),
        inputAmount: z
            .string()
            .describe(
                "Input amount as a string (e.g., '1000000000000000000' for 1 ETH)",
            ),
        outputToken: z
            .string()
            .describe("Output token address (use '0x0' or 'eth' for ETH)"),
        outputAmount: z
            .string()
            .describe(
                "Output amount as a string (e.g., '2000000000000000000' for 2 tokens)",
            ),
    }),
    execute: async (params: {
        inputToken: string;
        inputAmount: string;
        outputToken: string;
        outputAmount: string;
    }) => {
        try {
            const { publicClient, walletClient } = getClients();

            const inputToken = parseTokenAddress(params.inputToken);
            const outputToken = parseTokenAddress(params.outputToken);
            const inputAmount = parseAmount(params.inputAmount);
            const outputAmount = parseAmount(params.outputAmount);

            // Validate that tokens are different
            if (inputToken.toLowerCase() === outputToken.toLowerCase()) {
                throw new Error("Input and output tokens must be different");
            }

            // Validate amounts
            if (inputAmount === 0n || outputAmount === 0n) {
                throw new Error("Amounts must be greater than zero");
            }

            // Determine if we need to send ETH (when inputToken is ETH)
            const value = inputToken === ETH_ADDRESS ? inputAmount : undefined;

            // Create the order
            const hash = await walletClient.writeContract({
                address: BARTMART_ADDRESS,
                abi: BARTMART_ABI,
                functionName: "createOrder",
                args: [inputToken, inputAmount, outputToken, outputAmount],
                value,
            });

            // Wait for transaction receipt
            const receipt = await publicClient.waitForTransactionReceipt({ hash });

            // Extract orderId from logs (OrderCreated event)
            let orderId: bigint | null = null;
            if (receipt.logs) {
                for (const log of receipt.logs) {
                    try {
                        const decoded = decodeEventLog({
                            abi: BARTMART_ABI,
                            data: log.data,
                            topics: log.topics,
                        });
                        if (decoded.eventName === "OrderCreated") {
                            const args = decoded.args as { orderId: bigint };
                            orderId = args.orderId;
                            break;
                        }
                    } catch {
                        // Continue searching
                    }
                }
            }

            // If we couldn't find orderId from logs, try reading from contract
            if (orderId === null) {
                // Get the order counter and subtract 1 (since it increments after creation)
                const counter = await publicClient.readContract({
                    address: BARTMART_ADDRESS,
                    abi: BARTMART_ABI,
                    functionName: "orderCounter",
                });
                orderId = (counter as bigint) - 1n;
            }

            return {
                success: true,
                orderId: orderId.toString(),
                transactionHash: hash,
                blockNumber: receipt.blockNumber.toString(),
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error),
            };
        }
    },
};

/**
 * AI SDK compatible tool for fetching orders from BartMart
 */
export const fetchOrdersTool = {
    description:
        "Fetch order(s) from BartMart. Can fetch a specific order by ID or fetch multiple orders up to a limit.",
    parameters: z.object({
        orderId: z
            .number()
            .optional()
            .describe(
                "Specific order ID to fetch (if not provided, fetches recent orders)",
            ),
        limit: z
            .number()
            .optional()
            .describe(
                "Maximum number of orders to fetch (default: 10, max: 100). Only used when orderId is not provided.",
            ),
    }),
    execute: async (params: { orderId?: number; limit?: number }) => {
        try {
            const { publicClient } = getClients();

            // If orderId is provided, fetch that specific order
            if (params.orderId !== undefined) {
                const order = await publicClient.readContract({
                    address: BARTMART_ADDRESS,
                    abi: BARTMART_ABI,
                    functionName: "getOrder",
                    args: [BigInt(params.orderId)],
                });

                const [
                    creator,
                    inputToken,
                    inputAmount,
                    outputToken,
                    outputAmount,
                    fulfilled,
                    cancelled,
                ] = order as [
                    Address,
                    Address,
                    bigint,
                    Address,
                    bigint,
                    boolean,
                    boolean,
                ];

                // Check if order exists (creator is not zero address)
                if (creator === "0x0000000000000000000000000000000000000000") {
                    return {
                        success: false,
                        error: `Order ${params.orderId} not found`,
                    };
                }

                return {
                    success: true,
                    orders: [
                        {
                            orderId: params.orderId.toString(),
                            creator,
                            inputToken,
                            inputAmount: inputAmount.toString(),
                            outputToken,
                            outputAmount: outputAmount.toString(),
                            fulfilled,
                            cancelled,
                        },
                    ],
                };
            }

            // Otherwise, fetch recent orders
            const limit = Math.min(params.limit || 10, 100);
            const counter = await publicClient.readContract({
                address: BARTMART_ADDRESS,
                abi: BARTMART_ABI,
                functionName: "orderCounter",
            });

            const totalOrders = Number(counter);
            if (totalOrders === 0) {
                return {
                    success: true,
                    orders: [],
                };
            }

            // Fetch orders starting from the most recent
            const startId = Math.max(0, totalOrders - limit);
            const orders = [];

            for (let i = startId; i < totalOrders; i++) {
                try {
                    const order = await publicClient.readContract({
                        address: BARTMART_ADDRESS,
                        abi: BARTMART_ABI,
                        functionName: "getOrder",
                        args: [BigInt(i)],
                    });

                    const [
                        creator,
                        inputToken,
                        inputAmount,
                        outputToken,
                        outputAmount,
                        fulfilled,
                        cancelled,
                    ] = order as [
                        Address,
                        Address,
                        bigint,
                        Address,
                        bigint,
                        boolean,
                        boolean,
                    ];

                    // Only include orders that exist (creator is not zero address)
                    if (creator !== "0x0000000000000000000000000000000000000000") {
                        orders.push({
                            orderId: i.toString(),
                            creator,
                            inputToken,
                            inputAmount: inputAmount.toString(),
                            outputToken,
                            outputAmount: outputAmount.toString(),
                            fulfilled,
                            cancelled,
                        });
                    }
                } catch { }
            }

            return {
                success: true,
                orders,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error),
            };
        }
    },
};

// Export tools as an array for easy use with AI SDK
export const bartmartTools = [createOrderTool, fetchOrdersTool];

// Export individual tools
export { createOrderTool as createOrder, fetchOrdersTool as fetchOrders };
