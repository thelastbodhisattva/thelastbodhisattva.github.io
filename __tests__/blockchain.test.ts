/**
 * @jest-environment jsdom
 */
import { fetchWhales, fetchFundingRatePrediction, formatAddress, formatUsd, formatTimeAgo } from "../src/lib/blockchain";

// Mock the environment
beforeAll(() => {
    // Ensure we use mock data
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY = "demo_key";
    process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY = "demo_key";
});

describe("blockchain API wrapper", () => {
    describe("fetchWhales", () => {
        it("returns mock data when using demo key", async () => {
            const result = await fetchWhales([
                "0x28C6c06298d514Db089934071355E5743bf21d60",
            ]);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
            expect(result[0]).toHaveProperty("address");
            expect(result[0]).toHaveProperty("balance");
            expect(result[0]).toHaveProperty("balanceUsd");
            expect(result[0]).toHaveProperty("recentTransactions");
        });

        it("returns transactions with correct structure", async () => {
            const result = await fetchWhales([
                "0x28C6c06298d514Db089934071355E5743bf21d60",
            ]);

            const transactions = result[0].recentTransactions;
            expect(Array.isArray(transactions)).toBe(true);

            if (transactions.length > 0) {
                const tx = transactions[0];
                expect(tx).toHaveProperty("hash");
                expect(tx).toHaveProperty("value");
                expect(tx).toHaveProperty("valueUsd");
                expect(tx).toHaveProperty("timestamp");
                expect(tx).toHaveProperty("type");
                expect(["in", "out"]).toContain(tx.type);
            }
        });
    });

    describe("fetchFundingRatePrediction", () => {
        it("returns funding rate predictions", async () => {
            const result = await fetchFundingRatePrediction({
                symbol: "BTC-PERP",
                exchange: "binance",
                hours: 24,
            });

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
        });

        it("predictions have correct structure", async () => {
            const result = await fetchFundingRatePrediction();

            if (result.length > 0) {
                const prediction = result[0];
                expect(prediction).toHaveProperty("timestamp");
                expect(prediction).toHaveProperty("actual");
                expect(prediction).toHaveProperty("predicted");
                expect(prediction).toHaveProperty("confidence");
                expect(typeof prediction.actual).toBe("number");
                expect(typeof prediction.predicted).toBe("number");
                expect(prediction.confidence).toBeGreaterThanOrEqual(0);
                expect(prediction.confidence).toBeLessThanOrEqual(1);
            }
        });
    });

    describe("utility functions", () => {
        describe("formatAddress", () => {
            it("truncates address correctly", () => {
                const address = "0x28C6c06298d514Db089934071355E5743bf21d60";
                const formatted = formatAddress(address);

                expect(formatted).toBe("0x28C6...1d60");
                expect(formatted.length).toBe(13);
            });
        });

        describe("formatUsd", () => {
            it("formats millions correctly", () => {
                expect(formatUsd(1234567)).toBe("$1.23M");
                expect(formatUsd(50000000)).toBe("$50.00M");
            });

            it("formats thousands correctly", () => {
                expect(formatUsd(12345)).toBe("$12.35K");
                expect(formatUsd(5000)).toBe("$5.00K");
            });

            it("formats small values correctly", () => {
                expect(formatUsd(123.45)).toBe("$123.45");
                expect(formatUsd(0.99)).toBe("$0.99");
            });
        });

        describe("formatTimeAgo", () => {
            it("formats seconds correctly", () => {
                const now = Date.now();
                expect(formatTimeAgo(now - 30000)).toBe("30s ago");
            });

            it("formats minutes correctly", () => {
                const now = Date.now();
                expect(formatTimeAgo(now - 1000 * 60 * 5)).toBe("5m ago");
            });

            it("formats hours correctly", () => {
                const now = Date.now();
                expect(formatTimeAgo(now - 1000 * 60 * 60 * 3)).toBe("3h ago");
            });

            it("formats days correctly", () => {
                const now = Date.now();
                expect(formatTimeAgo(now - 1000 * 60 * 60 * 24 * 2)).toBe("2d ago");
            });
        });
    });
});
