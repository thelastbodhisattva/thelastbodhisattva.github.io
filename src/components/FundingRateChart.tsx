"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { fetchFundingRatePrediction } from "@/lib/blockchain";

interface ChartPoint {
    x: number;
    y: number;
    value: number;
}

export default function FundingRateChart() {
    const { data, isLoading } = useSWR(
        "funding-rate",
        () => fetchFundingRatePrediction({ hours: 24 }),
        {
            refreshInterval: 60000,
            revalidateOnFocus: false,
        }
    );

    const fundingData = data || [];

    // Chart calculations
    const chartData = useMemo(() => {
        if (fundingData.length === 0) return { actualPoints: [], predictedPoints: [], minY: 0, maxY: 0 };

        const padding = 40;
        const width = 100;
        const height = 200;

        const values = fundingData.flatMap((d) => [d.actual, d.predicted]);
        const minY = Math.min(...values) - 0.01;
        const maxY = Math.max(...values) + 0.01;
        const yRange = maxY - minY;

        const actualPoints: ChartPoint[] = fundingData.map((d, i) => ({
            x: (i / (fundingData.length - 1)) * (width - padding * 2) + padding,
            y: height - ((d.actual - minY) / yRange) * (height - padding) - padding / 2,
            value: d.actual,
        }));

        const predictedPoints: ChartPoint[] = fundingData.map((d, i) => ({
            x: (i / (fundingData.length - 1)) * (width - padding * 2) + padding,
            y: height - ((d.predicted - minY) / yRange) * (height - padding) - padding / 2,
            value: d.predicted,
        }));

        return { actualPoints, predictedPoints, minY, maxY };
    }, [fundingData]);

    // Create SVG path from points
    const createPath = (points: ChartPoint[]) => {
        if (points.length === 0) return "";
        return points.reduce((path, point, i) => {
            return path + (i === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
        }, "");
    };

    // Calculate accuracy
    const accuracy = useMemo(() => {
        if (fundingData.length === 0) return 0;

        let correct = 0;
        for (let i = 1; i < fundingData.length; i++) {
            const actualDir = fundingData[i].actual > fundingData[i - 1].actual;
            const predictedDir = fundingData[i].predicted > fundingData[i - 1].predicted;
            if (actualDir === predictedDir) correct++;
        }
        return ((correct / (fundingData.length - 1)) * 100).toFixed(1);
    }, [fundingData]);

    if (isLoading) {
        return (
            <div className="glass rounded-2xl p-6 h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-6 h-6 border border-white/20 border-t-white/60 rounded-full animate-spin" />
                    <p className="text-white/40 text-sm">Loading funding rate data...</p>
                </div>
            </div>
        );
    }

    const latestData = fundingData[fundingData.length - 1];

    return (
        <div className="glass rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-medium text-white">Funding Rate Predictor</h3>
                    <p className="text-sm text-white/30">ML-powered 24h prediction</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-md bg-white/5 text-white/50 text-xs">
                        {accuracy}% Accuracy
                    </span>
                </div>
            </div>

            {/* Current stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-3 rounded-xl bg-white/3 text-center">
                    <p className="text-xs text-white/30 mb-1">Current Rate</p>
                    <p className="text-lg font-medium text-white">
                        {latestData?.actual.toFixed(4)}%
                    </p>
                </div>
                <div className="p-3 rounded-xl bg-white/3 text-center">
                    <p className="text-xs text-white/30 mb-1">Predicted</p>
                    <p className="text-lg font-medium text-white/70">
                        {latestData?.predicted.toFixed(4)}%
                    </p>
                </div>
                <div className="p-3 rounded-xl bg-white/3 text-center">
                    <p className="text-xs text-white/30 mb-1">Confidence</p>
                    <p className="text-lg font-medium text-white/50">
                        {((latestData?.confidence || 0) * 100).toFixed(0)}%
                    </p>
                </div>
            </div>

            {/* Chart */}
            <div className="relative h-[180px] rounded-xl bg-black/20 overflow-hidden">
                <svg
                    viewBox="0 0 100 200"
                    preserveAspectRatio="none"
                    className="w-full h-full"
                >
                    {/* Grid */}
                    <defs>
                        <pattern id="grid" width="10" height="20" patternUnits="userSpaceOnUse">
                            <path
                                d="M 10 0 L 0 0 0 20"
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.03)"
                                strokeWidth="0.2"
                            />
                        </pattern>
                    </defs>
                    <rect width="100" height="200" fill="url(#grid)" />

                    {/* Zero line */}
                    {chartData.minY < 0 && chartData.maxY > 0 && (
                        <line
                            x1="0"
                            y1={200 - ((0 - chartData.minY) / (chartData.maxY - chartData.minY)) * 180 - 10}
                            x2="100"
                            y2={200 - ((0 - chartData.minY) / (chartData.maxY - chartData.minY)) * 180 - 10}
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="0.3"
                            strokeDasharray="2,2"
                        />
                    )}

                    {/* Predicted line (dashed) */}
                    <path
                        d={createPath(chartData.predictedPoints)}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth="0.8"
                        strokeDasharray="2,1"
                    />

                    {/* Actual line */}
                    <path
                        d={createPath(chartData.actualPoints)}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.7)"
                        strokeWidth="1"
                    />

                    {/* Gradient fill */}
                    <defs>
                        <linearGradient id="actualGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="white" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path
                        d={`${createPath(chartData.actualPoints)} L 95 200 L 5 200 Z`}
                        fill="url(#actualGradient)"
                    />
                </svg>

                {/* Y-axis labels */}
                <div className="absolute left-2 top-2 text-xs text-white/20 font-mono">
                    {chartData.maxY.toFixed(3)}%
                </div>
                <div className="absolute left-2 bottom-2 text-xs text-white/20 font-mono">
                    {chartData.minY.toFixed(3)}%
                </div>

                {/* X-axis label */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white/20">
                    Last 24 hours
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 text-xs text-white/30">
                <span className="flex items-center gap-1.5">
                    <span className="w-4 h-0.5 bg-white/70 rounded" />
                    Actual
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-4 h-0.5 bg-white/30 rounded" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.3) 4px, transparent 4px, transparent 6px)" }} />
                    Predicted
                </span>
            </div>

            {/* Model info */}
            <div className="mt-6 p-4 rounded-xl bg-white/3 text-xs text-white/30">
                <p className="mb-1">
                    <span className="text-white/50">Model:</span> Gradient Boosted Trees + LSTM Ensemble
                </p>
                <p>
                    <span className="text-white/50">Features:</span> Order book depth, open interest, historical funding
                </p>
            </div>
        </div>
    );
}
