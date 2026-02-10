"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { fetchFundingRatePrediction } from "@/lib/blockchain";

/* ─────────────────────────── types ─────────────────────────── */

interface ChartPoint {
    x: number;
    y: number;
    value: number;
}

/* ═══════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════ */

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

    /* ── Chart calculations ── */
    const chartData = useMemo(() => {
        if (fundingData.length === 0) return { actualPoints: [], predictedPoints: [], minY: 0, maxY: 0, zeroY: 100 };

        const padding = 40;
        const width = 100;
        const height = 200;

        const values = fundingData.flatMap((d) => [d.actual, d.predicted]);
        const minY = Math.min(...values) - 0.01;
        const maxY = Math.max(...values) + 0.01;
        const yRange = maxY - minY;

        const scaleY = (v: number) => height - ((v - minY) / yRange) * (height - padding) - padding / 2;

        const actualPoints: ChartPoint[] = fundingData.map((d, i) => ({
            x: (i / (fundingData.length - 1)) * (width - padding * 2) + padding,
            y: scaleY(d.actual),
            value: d.actual,
        }));

        const predictedPoints: ChartPoint[] = fundingData.map((d, i) => ({
            x: (i / (fundingData.length - 1)) * (width - padding * 2) + padding,
            y: scaleY(d.predicted),
            value: d.predicted,
        }));

        const zeroY = minY < 0 && maxY > 0 ? scaleY(0) : -1;

        return { actualPoints, predictedPoints, minY, maxY, zeroY };
    }, [fundingData]);

    /* ── SVG path builder ── */
    const createPath = (points: ChartPoint[]) => {
        if (points.length === 0) return "";
        return points.reduce((path, point, i) => {
            return path + (i === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
        }, "");
    };

    /* ── Accuracy ── */
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

    /* ── Derived state ── */
    const latestData = fundingData[fundingData.length - 1];
    const isPositive = latestData && latestData.actual >= 0;
    const rateColor = isPositive ? "#34d399" : "#ef4444";
    const rateGlow = isPositive ? "rgba(52,211,153,0.25)" : "rgba(239,68,68,0.25)";

    /* ── Loading ── */
    if (isLoading) {
        return (
            <div className="glass rounded-2xl p-6 h-[400px] flex flex-col gap-4 animate-pulse">
                <div className="h-5 w-1/3 rounded bg-white/5" />
                <div className="h-3 w-2/3 rounded bg-white/5" />
                <div className="flex-1 rounded-xl bg-white/[0.02]" />
                <div className="flex gap-3">
                    <div className="h-8 w-20 rounded-full bg-white/5" />
                    <div className="h-8 w-20 rounded-full bg-white/5" />
                </div>
            </div>
        );
    }

    return (
        <div className="glass rounded-2xl h-full flex flex-col overflow-hidden">
            {/* ── Header ── */}
            <div className="p-5 pb-0 sm:p-6 sm:pb-0 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h3
                            className="font-medium text-white"
                            style={{ fontSize: "var(--text-lg)" }}
                        >
                            Funding Rate Predictor
                        </h3>
                        <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-medium"
                            style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.4)",
                            }}
                        >
                            ML Model
                        </span>
                    </div>
                    <p className="text-white/30" style={{ fontSize: "var(--text-xs)" }}>
                        24h prediction · GBT + LSTM Ensemble
                    </p>
                </div>

                {/* Accuracy badge */}
                <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                    style={{
                        background: `linear-gradient(135deg, ${rateGlow}, transparent)`,
                        border: `1px solid ${rateColor}33`,
                    }}
                >
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{
                            background: rateColor,
                            boxShadow: `0 0 8px ${rateGlow}`,
                        }}
                    />
                    <span
                        className="font-medium tabular-nums"
                        style={{ color: rateColor, fontSize: "var(--text-sm)" }}
                    >
                        {accuracy}%
                    </span>
                    <span className="text-white/25" style={{ fontSize: "10px" }}>
                        ACC
                    </span>
                </div>
            </div>

            {/* ── Stats Row ── */}
            <div
                className="grid grid-cols-3 gap-px mx-5 sm:mx-6 mt-4 rounded-lg overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)" }}
            >
                {[
                    {
                        label: "Current Rate",
                        value: `${latestData?.actual.toFixed(4)}%`,
                        color: isPositive ? "#34d399" : "#ef4444",
                    },
                    {
                        label: "Predicted",
                        value: `${latestData?.predicted.toFixed(4)}%`,
                        color: "rgba(255,255,255,0.5)",
                    },
                    {
                        label: "Confidence",
                        value: `${((latestData?.confidence || 0) * 100).toFixed(0)}%`,
                        color: "rgba(255,255,255,0.5)",
                    },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="px-3 py-2.5 sm:px-4 sm:py-3"
                        style={{ background: "rgba(10,10,10,0.6)" }}
                    >
                        <div
                            className="font-medium tabular-nums"
                            style={{ fontSize: "var(--text-sm)", color: stat.color }}
                        >
                            {stat.value}
                        </div>
                        <div
                            className="text-white/25 uppercase tracking-wider"
                            style={{ fontSize: "10px" }}
                        >
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Chart ── */}
            <div
                className="relative flex-1 min-h-0 mx-5 sm:mx-6 mt-4 rounded-xl overflow-hidden"
                style={{ background: "rgba(0,0,0,0.2)" }}
            >
                <svg
                    viewBox="0 0 100 200"
                    preserveAspectRatio="none"
                    className="w-full h-full"
                >
                    {/* Grid */}
                    <defs>
                        <pattern id="fr-grid" width="10" height="20" patternUnits="userSpaceOnUse">
                            <path
                                d="M 10 0 L 0 0 0 20"
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.03)"
                                strokeWidth="0.2"
                            />
                        </pattern>
                        {/* Positive gradient (green) */}
                        <linearGradient id="positiveGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#34d399" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                        </linearGradient>
                        {/* Negative gradient (red) */}
                        <linearGradient id="negativeGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <rect width="100" height="200" fill="url(#fr-grid)" />

                    {/* Zero line */}
                    {chartData.zeroY > 0 && (
                        <line
                            x1="0"
                            y1={chartData.zeroY}
                            x2="100"
                            y2={chartData.zeroY}
                            stroke="rgba(255, 255, 255, 0.08)"
                            strokeWidth="0.3"
                            strokeDasharray="2,2"
                        />
                    )}

                    {/* Gradient fill — color-coded */}
                    <path
                        d={`${createPath(chartData.actualPoints)} L 95 200 L 5 200 Z`}
                        fill={isPositive ? "url(#positiveGradient)" : "url(#negativeGradient)"}
                    />

                    {/* Predicted line (dashed) */}
                    <path
                        d={createPath(chartData.predictedPoints)}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.25)"
                        strokeWidth="0.6"
                        strokeDasharray="2,1"
                    />

                    {/* Actual line — color-coded */}
                    <path
                        d={createPath(chartData.actualPoints)}
                        fill="none"
                        stroke={rateColor}
                        strokeWidth="1"
                        strokeOpacity="0.8"
                    />

                    {/* Endpoint dot */}
                    {chartData.actualPoints.length > 0 && (
                        <>
                            <circle
                                cx={chartData.actualPoints[chartData.actualPoints.length - 1].x}
                                cy={chartData.actualPoints[chartData.actualPoints.length - 1].y}
                                r="1.5"
                                fill={rateColor}
                            />
                            <circle
                                cx={chartData.actualPoints[chartData.actualPoints.length - 1].x}
                                cy={chartData.actualPoints[chartData.actualPoints.length - 1].y}
                                r="3"
                                fill={rateColor}
                                opacity="0.2"
                            />
                        </>
                    )}
                </svg>

                {/* Y-axis labels */}
                <div className="absolute left-2 top-2 font-mono text-white/20" style={{ fontSize: "10px" }}>
                    {chartData.maxY.toFixed(3)}%
                </div>
                <div className="absolute left-2 bottom-2 font-mono text-white/20" style={{ fontSize: "10px" }}>
                    {chartData.minY.toFixed(3)}%
                </div>

                {/* X-axis label */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/15" style={{ fontSize: "10px" }}>
                    Last 24 hours
                </div>
            </div>

            {/* ── Legend + Model Info ── */}
            <div className="p-5 sm:p-6 pt-4 flex flex-col gap-3">
                {/* Legend */}
                <div className="flex items-center gap-5" style={{ fontSize: "10px" }}>
                    <span className="flex items-center gap-1.5 text-white/30">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: rateColor }} />
                        Actual
                    </span>
                    <span className="flex items-center gap-1.5 text-white/30">
                        <span
                            className="w-4 h-px"
                            style={{
                                backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.25), rgba(255,255,255,0.25) 3px, transparent 3px, transparent 5px)",
                            }}
                        />
                        Predicted
                    </span>
                </div>

                {/* Model info */}
                <div
                    className="flex flex-wrap gap-x-4 gap-y-1 text-white/20"
                    style={{ fontSize: "10px" }}
                >
                    <span>
                        <span className="text-white/35">Model</span>{" "}
                        GBT + LSTM Ensemble
                    </span>
                    <span>
                        <span className="text-white/35">Features</span>{" "}
                        Order book · Open interest · Historical funding
                    </span>
                </div>
            </div>
        </div>
    );
}
