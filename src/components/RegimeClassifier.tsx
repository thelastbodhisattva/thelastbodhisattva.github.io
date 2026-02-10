"use client";

import { useEffect, useState, useMemo } from "react";

/* ─────────────────────────── types ─────────────────────────── */

interface RegimeTransition {
    from: string;
    to: string;
    ts: number;
    conf: number;
    indicators: number;
    confirmations: number;
}

interface CrisisAlert {
    type: string;
    ts: number;
    price: number;
    qty: number;
    usd: number;
    side: "BUY" | "SELL";
}

interface ShadowData {
    currentRegime: string;
    startTime: number;
    runtime: number;
    classificationCount: number;
    totalTransitions: number;
    totalAlerts: number;
    regimeHistory: RegimeTransition[];
    crisisAlerts: CrisisAlert[];
    regimeDurations: Record<string, number>;
    extractedAt: number;
}

/* ─────────────────────────── regime color map ─────────────── */

const REGIME_META: Record<string, { color: string; glow: string; label: string }> = {
    ACCUMULATION: { color: "#34d399", glow: "rgba(52,211,153,0.25)", label: "Accumulation" },
    BOUNCE: { color: "#22d3ee", glow: "rgba(34,211,238,0.25)", label: "Bounce" },
    VOL_COMPRESSION: { color: "#fbbf24", glow: "rgba(251,191,36,0.25)", label: "Vol Compression" },
    TRENDING_DOWN: { color: "#fb923c", glow: "rgba(251,146,60,0.25)", label: "Trending Down" },
    GRINDING_BEAR: { color: "#ef4444", glow: "rgba(239,68,68,0.25)", label: "Grinding Bear" },
    HIGH_VOL_CRASH: { color: "#e11d48", glow: "rgba(225,29,72,0.25)", label: "High Vol Crash" },
    CAPITULATION: { color: "#d946ef", glow: "rgba(217,70,239,0.25)", label: "Capitulation" },
    DISTRIBUTION: { color: "#eab308", glow: "rgba(234,179,8,0.25)", label: "Distribution" },
    RANGE_LOW_VOL: { color: "#a1a1aa", glow: "rgba(161,161,170,0.25)", label: "Range (Low Vol)" },
    RANGE_HIGH_VOL: { color: "#a78bfa", glow: "rgba(167,139,250,0.25)", label: "Range (High Vol)" },
    BLOW_OFF_TOP: { color: "#f472b6", glow: "rgba(244,114,182,0.25)", label: "Blow Off Top" },
    SLOW_GRIND_CRASH: { color: "#b91c1c", glow: "rgba(185,28,28,0.25)", label: "Slow Grind Crash" },
};

function getRegimeMeta(regime: string) {
    return REGIME_META[regime] || { color: "#71717a", glow: "rgba(113,113,122,0.2)", label: regime };
}

/* ─────────────────────────── helpers ─────────────────────────── */

function formatDuration(ms: number): string {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    if (h > 24) {
        const d = Math.floor(h / 24);
        return `${d}d ${h % 24}h`;
    }
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatUsd(n: number): string {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n}`;
}

function timeAgo(ts: number): string {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days}d ago`;
    if (hrs > 0) return `${hrs}h ago`;
    return `${mins}m ago`;
}

function formatNumber(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
}

/* ═══════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════ */

export default function RegimeClassifier() {
    const [data, setData] = useState<ShadowData | null>(null);
    const [error, setError] = useState(false);
    const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

    useEffect(() => {
        fetch("/data/shadow-regime.json")
            .then((r) => {
                if (!r.ok) throw new Error("Failed to fetch");
                return r.json();
            })
            .then((d: ShadowData) => setData(d))
            .catch(() => setError(true));
    }, []);

    /* ── Compute timeline segments ── */
    const segments = useMemo(() => {
        if (!data) return [];
        const history = data.regimeHistory;
        if (history.length === 0) return [];

        const result: Array<{
            regime: string;
            start: number;
            end: number;
            duration: number;
            widthPercent: number;
            conf: number;
        }> = [];

        const totalStart = history[0].ts;
        const totalEnd = data.extractedAt || Date.now();
        const totalDuration = totalEnd - totalStart;

        for (let i = 0; i < history.length; i++) {
            const t = history[i];
            const nextTs = i < history.length - 1 ? history[i + 1].ts : totalEnd;
            const duration = nextTs - t.ts;
            result.push({
                regime: t.to,
                start: t.ts,
                end: nextTs,
                duration,
                widthPercent: (duration / totalDuration) * 100,
                conf: t.conf,
            });
        }
        return result;
    }, [data]);

    /* ── Regime distribution (sorted) ── */
    const distribution = useMemo(() => {
        if (!data?.regimeDurations) return [];
        const total = Object.values(data.regimeDurations).reduce((a, b) => a + b, 0);
        return Object.entries(data.regimeDurations)
            .map(([regime, duration]) => ({
                regime,
                duration,
                percent: (duration / total) * 100,
            }))
            .sort((a, b) => b.percent - a.percent);
    }, [data]);

    /* ── Error state ── */
    if (error) {
        return (
            <div className="glass rounded-2xl p-6 h-[400px] flex items-center justify-center">
                <p className="text-white/30" style={{ fontSize: "var(--text-sm)" }}>
                    Shadow Mode data unavailable
                </p>
            </div>
        );
    }

    /* ── Loading state ── */
    if (!data) {
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

    const meta = getRegimeMeta(data.currentRegime);

    return (
        <div className="glass rounded-2xl overflow-hidden">
            {/* ── Header ── */}
            <div className="p-5 pb-0 sm:p-6 sm:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h3
                            className="font-medium text-white"
                            style={{ fontSize: "var(--text-lg)" }}
                        >
                            BTC Regime Classifier
                        </h3>
                        <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-medium"
                            style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.4)",
                            }}
                        >
                            <span
                                className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                                style={{ background: meta.color }}
                            />
                            Shadow Mode
                        </span>
                    </div>
                    <p className="text-white/30" style={{ fontSize: "var(--text-xs)" }}>
                        {formatNumber(data.classificationCount)} readings ·{" "}
                        Dataset from{" "}
                        {new Date(data.extractedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>

                {/* ── Current Regime Badge ── */}
                <div
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                    style={{
                        background: `linear-gradient(135deg, ${meta.glow}, transparent)`,
                        border: `1px solid ${meta.color}33`,
                    }}
                >
                    <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                            background: meta.color,
                            boxShadow: `0 0 12px ${meta.glow}`,
                            animation: "pulse 2s ease-in-out infinite",
                        }}
                    />
                    <div>
                        <div
                            className="font-semibold tracking-tight"
                            style={{ color: meta.color, fontSize: "var(--text-sm)" }}
                        >
                            {meta.label}
                        </div>
                        <div
                            className="text-white/30"
                            style={{ fontSize: "10px", letterSpacing: "0.05em" }}
                        >
                            CURRENT REGIME
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px mx-5 sm:mx-6 mt-4 rounded-lg overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)" }}
            >
                {[
                    { label: "Runtime", value: formatDuration(data.runtime) },
                    { label: "Classifications", value: formatNumber(data.classificationCount) },
                    { label: "Transitions", value: data.totalTransitions.toString() },
                    { label: "Alerts", value: formatNumber(data.totalAlerts) },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="px-3 py-2.5 sm:px-4 sm:py-3"
                        style={{ background: "rgba(10,10,10,0.6)" }}
                    >
                        <div
                            className="text-white/60 font-medium tabular-nums"
                            style={{ fontSize: "var(--text-sm)" }}
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

            {/* ── Regime Timeline ── */}
            <div className="px-5 sm:px-6 mt-5">
                <div
                    className="text-white/30 uppercase tracking-wider mb-2"
                    style={{ fontSize: "10px" }}
                >
                    Regime Timeline
                </div>
                <div className="flex h-8 rounded-lg overflow-hidden gap-px relative">
                    {segments.map((seg, i) => {
                        const m = getRegimeMeta(seg.regime);
                        const isHovered = hoveredSegment === i;
                        return (
                            <div
                                key={i}
                                className="relative transition-all duration-200 cursor-pointer"
                                style={{
                                    width: `${Math.max(seg.widthPercent, 0.3)}%`,
                                    background: isHovered
                                        ? `${m.color}50`
                                        : `${m.color}25`,
                                    borderBottom: `2px solid ${m.color}`,
                                }}
                                onMouseEnter={() => setHoveredSegment(i)}
                                onMouseLeave={() => setHoveredSegment(null)}
                            >
                                {/* Tooltip */}
                                {isHovered && (
                                    <div
                                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap px-3 py-2 rounded-lg pointer-events-none"
                                        style={{
                                            background: "rgba(0,0,0,0.9)",
                                            border: `1px solid ${m.color}33`,
                                            fontSize: "11px",
                                        }}
                                    >
                                        <span style={{ color: m.color }} className="font-medium">
                                            {m.label}
                                        </span>
                                        <span className="text-white/40 ml-2">
                                            {formatDuration(seg.duration)} · {(seg.conf * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Bottom Row: Distribution + Crisis Feed ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-5 sm:p-6 mt-1">
                {/* Distribution */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <div
                            className="text-white/30 uppercase tracking-wider"
                            style={{ fontSize: "10px" }}
                        >
                            Regime Distribution
                        </div>
                        <div
                            className="text-white/20 tabular-nums"
                            style={{ fontSize: "10px" }}
                        >
                            {distribution.length} regimes detected
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        {distribution.map((d) => {
                            const m = getRegimeMeta(d.regime);
                            return (
                                <div key={d.regime} className="flex items-center gap-2.5">
                                    <div
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{ background: m.color }}
                                    />
                                    <span
                                        className="text-white/50 w-24 sm:w-28 truncate shrink-0"
                                        style={{ fontSize: "11px" }}
                                    >
                                        {m.label}
                                    </span>
                                    {/* Bar */}
                                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{
                                                width: `${d.percent}%`,
                                                background: `linear-gradient(90deg, ${m.color}80, ${m.color}40)`,
                                            }}
                                        />
                                    </div>
                                    <span
                                        className="text-white/30 tabular-nums shrink-0 w-10 text-right"
                                        style={{ fontSize: "10px" }}
                                    >
                                        {d.percent.toFixed(1)}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Crisis Feed */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <div
                            className="text-white/30 uppercase tracking-wider"
                            style={{ fontSize: "10px" }}
                        >
                            Whale Trades
                        </div>
                        <div
                            className="text-white/20 tabular-nums"
                            style={{ fontSize: "10px" }}
                        >
                            {data.crisisAlerts.length} trades captured
                        </div>
                    </div>
                    <div
                        className="flex flex-col gap-0.5 overflow-y-auto pr-1"
                        style={{ maxHeight: "260px" }}
                    >
                        {[...data.crisisAlerts].reverse().map((alert, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between py-1.5 px-2.5 rounded-md transition-colors"
                                style={{ background: i === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                                        style={{
                                            color: alert.side === "BUY" ? "#34d399" : "#ef4444",
                                            background:
                                                alert.side === "BUY"
                                                    ? "rgba(52,211,153,0.1)"
                                                    : "rgba(239,68,68,0.1)",
                                        }}
                                    >
                                        {alert.side}
                                    </span>
                                    <span
                                        className="text-white/40 tabular-nums"
                                        style={{ fontSize: "11px" }}
                                    >
                                        {alert.qty.toFixed(2)} BTC
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span
                                        className="text-white/50 tabular-nums font-medium"
                                        style={{ fontSize: "11px" }}
                                    >
                                        {formatUsd(alert.usd)}
                                    </span>
                                    <span
                                        className="text-white/20 tabular-nums"
                                        style={{ fontSize: "10px" }}
                                    >
                                        ${alert.price.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
