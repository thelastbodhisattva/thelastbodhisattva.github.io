// ═══════════════════════════════════════════════════════════
// Mock Data for Development & Demo
// Replace with live API calls when keys are provided
// ═══════════════════════════════════════════════════════════

import { WhaleWallet, FundingRateData } from "./blockchain";

// ═══════════════════════════════════════════════════════════
// Mock Whale Data
// ═══════════════════════════════════════════════════════════

export const mockWhaleData: WhaleWallet[] = [
    {
        address: "0x28C6c06298d514Db089934071355E5743bf21d60",
        label: "Binance 14",
        balance: "348521.4523",
        balanceUsd: 697042904.6,
        recentTransactions: [
            {
                address: "0x28C6c06298d514Db089934071355E5743bf21d60",
                hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
                value: "5000.0000",
                valueUsd: 10000000,
                timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
                type: "out",
                token: "ETH",
            },
            {
                address: "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d",
                hash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab",
                value: "12500.0000",
                valueUsd: 25000000,
                timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
                type: "in",
                token: "ETH",
            },
            {
                address: "0x28C6c06298d514Db089934071355E5743bf21d60",
                hash: "0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd",
                value: "8750.0000",
                valueUsd: 17500000,
                timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
                type: "out",
                token: "ETH",
            },
        ],
    },
    {
        address: "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d",
        label: "Bitfinex",
        balance: "189234.1876",
        balanceUsd: 378468375.2,
        recentTransactions: [
            {
                address: "0x28C6c06298d514Db089934071355E5743bf21d60",
                hash: "0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                value: "3200.0000",
                valueUsd: 6400000,
                timestamp: Date.now() - 1000 * 60 * 15, // 15 minutes ago
                type: "in",
                token: "ETH",
            },
            {
                address: "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d",
                hash: "0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
                value: "7800.0000",
                valueUsd: 15600000,
                timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
                type: "out",
                token: "ETH",
            },
        ],
    },
    {
        address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8D2d3",
        label: "Unknown Whale",
        balance: "95123.5432",
        balanceUsd: 190247086.4,
        recentTransactions: [
            {
                address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8D2d3",
                hash: "0x6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
                value: "15000.0000",
                valueUsd: 30000000,
                timestamp: Date.now() - 1000 * 60 * 45, // 45 minutes ago
                type: "out",
                token: "ETH",
            },
        ],
    },
];

// ═══════════════════════════════════════════════════════════
// Mock Funding Rate Data
// ═══════════════════════════════════════════════════════════

const generateFundingRateHistory = (): FundingRateData[] => {
    const data: FundingRateData[] = [];
    const now = Date.now();
    const hourMs = 1000 * 60 * 60;

    for (let i = 23; i >= 0; i--) {
        const timestamp = now - i * hourMs;

        // Generate realistic-looking funding rates
        const baseRate = 0.01; // 0.01% base
        const volatility = Math.sin(i * 0.5) * 0.02 + Math.random() * 0.015;
        const actual = baseRate + volatility;

        // Prediction with 85%+ directional accuracy
        const predictionError = (Math.random() - 0.5) * 0.005;
        const predicted = actual + predictionError;

        // Confidence based on volatility
        const confidence = 0.8 + Math.random() * 0.15;

        data.push({
            timestamp,
            exchange: "binance",
            symbol: "BTC-PERP",
            actual: parseFloat((actual * 100).toFixed(4)),
            predicted: parseFloat((predicted * 100).toFixed(4)),
            confidence: parseFloat(confidence.toFixed(2)),
        });
    }

    return data;
};

export const mockFundingRateData: FundingRateData[] =
    generateFundingRateHistory();

// ═══════════════════════════════════════════════════════════
// Mock Transaction Stream (for real-time visualization)
// ═══════════════════════════════════════════════════════════

export const generateMockTransaction = () => {
    const addresses = [
        "0x28C6c06298d514Db089934071355E5743bf21d60",
        "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d",
        "0x742d35Cc6634C0532925a3b844Bc9e7595f8D2d3",
        "0x8103683202aa8da10536036edef04cdd865c225e",
        "0x4862733b5fddfd35f35ea8ccf08f5045e57388b3",
    ];

    const amount = Math.random() * 10000 + 100;

    return {
        id: Math.random().toString(36).substring(7),
        from: addresses[Math.floor(Math.random() * addresses.length)],
        to: addresses[Math.floor(Math.random() * addresses.length)],
        value: amount.toFixed(4),
        valueUsd: amount * 2000,
        timestamp: Date.now(),
        type: Math.random() > 0.5 ? "in" : "out",
        token: "ETH",
    };
};
