// ═══════════════════════════════════════════════════════════
// Blockchain API Wrapper
// Alchemy & Etherscan integration with mock fallbacks
// ═══════════════════════════════════════════════════════════

import { mockWhaleData, mockFundingRateData } from "./mockData";

// ═══════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════

export interface WhaleTransaction {
    address: string;
    hash: string;
    value: string;
    valueUsd: number;
    timestamp: number;
    type: "in" | "out";
    token: string;
}

export interface WhaleWallet {
    address: string;
    label?: string;
    balance: string;
    balanceUsd: number;
    recentTransactions: WhaleTransaction[];
}

export interface FundingRateData {
    timestamp: number;
    exchange: string;
    symbol: string;
    actual: number;
    predicted: number;
    confidence: number;
}

export interface PredictionParams {
    symbol?: string;
    exchange?: string;
    hours?: number;
}

// ═══════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════

/**
 * Get API keys from environment variables.
 *
 * To use live data, create a .env.local file with:
 *   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
 *   NEXT_PUBLIC_ETHERSCAN_API_KEY=your_etherscan_key
 *
 * Get free keys at:
 *   - Alchemy: https://www.alchemy.com/
 *   - Etherscan: https://etherscan.io/apis
 */
const getAlchemyKey = () =>
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "demo_key";
const getEtherscanKey = () =>
    process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || "demo_key";

const ALCHEMY_BASE_URL = "https://eth-mainnet.g.alchemy.com/v2";
const ETHERSCAN_BASE_URL = "https://api.etherscan.io/api";

// ═══════════════════════════════════════════════════════════
// Whale Tracking Functions
// ═══════════════════════════════════════════════════════════

/**
 * Fetch whale wallet data.
 *
 * @param addresses - Array of wallet addresses to track
 * @param apiKey - Optional Alchemy API key (uses env var if not provided)
 * @returns Array of whale wallet data with recent transactions
 *
 * @example
 * ```ts
 * const whales = await fetchWhales([
 *   "0x28C6c06298d514Db089934071355E5743bf21d60", // Binance 14
 *   "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d", // Bitfinex
 * ]);
 * ```
 */
export async function fetchWhales(
    addresses: string[],
    apiKey?: string
): Promise<WhaleWallet[]> {
    const key = apiKey || getAlchemyKey();

    // Return mock data if using demo key
    if (key === "demo_key") {
        console.log("[blockchain] Using mock whale data (no API key provided)");
        return mockWhaleData;
    }

    try {
        const results = await Promise.all(
            addresses.map(async (address) => {
                // Fetch balance using Alchemy
                const balanceResponse = await fetch(`${ALCHEMY_BASE_URL}/${key}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        jsonrpc: "2.0",
                        id: 1,
                        method: "eth_getBalance",
                        params: [address, "latest"],
                    }),
                });

                const balanceData = await balanceResponse.json();
                const balanceWei = BigInt(balanceData.result || "0");
                const balanceEth = Number(balanceWei) / 1e18;

                // Fetch recent transactions using Etherscan
                const txResponse = await fetch(
                    `${ETHERSCAN_BASE_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${getEtherscanKey()}`
                );

                const txData = await txResponse.json();
                const transactions: WhaleTransaction[] = (txData.result || [])
                    .slice(0, 5)
                    .map(
                        (tx: {
                            hash: string;
                            value: string;
                            timeStamp: string;
                            from: string;
                        }) => ({
                            address: tx.from,
                            hash: tx.hash,
                            value: (Number(tx.value) / 1e18).toFixed(4),
                            valueUsd: (Number(tx.value) / 1e18) * 2000, // Simplified ETH price
                            timestamp: parseInt(tx.timeStamp) * 1000,
                            type: tx.from.toLowerCase() === address.toLowerCase() ? "out" : "in",
                            token: "ETH",
                        })
                    );

                return {
                    address,
                    balance: balanceEth.toFixed(4),
                    balanceUsd: balanceEth * 2000, // Simplified ETH price
                    recentTransactions: transactions,
                };
            })
        );

        return results;
    } catch (error) {
        console.error("[blockchain] Error fetching whale data:", error);
        console.log("[blockchain] Falling back to mock data");
        return mockWhaleData;
    }
}

// ═══════════════════════════════════════════════════════════
// Funding Rate Prediction Functions
// ═══════════════════════════════════════════════════════════

/**
 * Fetch funding rate predictions.
 *
 * @param params - Prediction parameters
 * @returns Array of funding rate predictions with confidence scores
 *
 * @example
 * ```ts
 * const predictions = await fetchFundingRatePrediction({
 *   symbol: "BTC-PERP",
 *   exchange: "binance",
 *   hours: 24,
 * });
 * ```
 *
 * @note This is a placeholder for integration with a real ML model.
 * In production, this would call your deployed prediction API.
 */
export async function fetchFundingRatePrediction(
    params: PredictionParams = {}
): Promise<FundingRateData[]> {
    const { symbol = "BTC-PERP", exchange = "binance", hours = 24 } = params;

    // In production, replace with actual API endpoint:
    // const response = await fetch(`https://your-api.com/predict`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ symbol, exchange, hours }),
    // });
    // return response.json();

    console.log(
        `[blockchain] Fetching funding rate prediction for ${symbol} on ${exchange} (${hours}h)`
    );

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return mock data with the requested parameters
    return mockFundingRateData.map((d) => ({
        ...d,
        exchange,
        symbol,
    }));
}

// ═══════════════════════════════════════════════════════════
// Utility Functions
// ═══════════════════════════════════════════════════════════

/**
 * Format a wallet address for display.
 */
export function formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format a USD value with proper notation.
 */
export function formatUsd(value: number): string {
    if (value >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(2)}M`;
    }
    if (value >= 1_000) {
        return `$${(value / 1_000).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
}

/**
 * Format a timestamp to relative time.
 */
export function formatTimeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}
