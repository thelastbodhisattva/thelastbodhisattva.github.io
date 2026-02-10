"use client";

import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { fetchWhales, formatAddress, formatUsd, formatTimeAgo, WhaleWallet } from "@/lib/blockchain";

/* ─────────────────────────── Canvas Particles ─────────────── */

function TransactionCanvas({ transactions }: { transactions: WhaleWallet["recentTransactions"] }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        resize();
        window.addEventListener("resize", resize);

        interface Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
            alpha: number;
            life: number;
            isOut: boolean;
        }

        const particles: Particle[] = [];
        const maxParticles = 40;

        // Seed from real transactions
        transactions.forEach((tx, i) => {
            const isOut = tx.type === "out";
            particles.push({
                x: isOut ? 20 : canvas.offsetWidth - 20,
                y: 30 + i * 25,
                vx: isOut ? 1.5 : -1.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.min(6, Math.max(2, tx.valueUsd / 5000000)),
                alpha: 0.5,
                life: 100 + Math.random() * 50,
                isOut,
            });
        });

        let animationId: number;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

            // Subtle connection line
            const gradient = ctx.createLinearGradient(20, 0, canvas.offsetWidth - 20, 0);
            gradient.addColorStop(0, "rgba(52, 211, 153, 0.06)");
            gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.03)");
            gradient.addColorStop(1, "rgba(239, 68, 68, 0.06)");
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(20, canvas.offsetHeight / 2);
            ctx.lineTo(canvas.offsetWidth - 20, canvas.offsetHeight / 2);
            ctx.stroke();

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.5;
                p.alpha = Math.max(0, (p.life / 100) * 0.5);

                if (p.life <= 0) {
                    p.x = p.isOut ? 20 : canvas.offsetWidth - 20;
                    p.y = 20 + Math.random() * (canvas.offsetHeight - 40);
                    p.life = 100 + Math.random() * 50;
                    p.alpha = 0.5;
                }

                // Color-coded: green inflow, red outflow
                const color = p.isOut
                    ? `rgba(239, 68, 68, ${p.alpha})`     // red outflow
                    : `rgba(52, 211, 153, ${p.alpha})`;    // green inflow

                // Glow
                ctx.shadowColor = p.isOut
                    ? "rgba(239, 68, 68, 0.3)"
                    : "rgba(52, 211, 153, 0.3)";
                ctx.shadowBlur = 8;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();

                ctx.shadowBlur = 0;
            }

            // Spawn new particles
            if (Math.random() < 0.03 && particles.length < maxParticles) {
                const isOut = Math.random() > 0.5;
                particles.push({
                    x: isOut ? 20 : canvas.offsetWidth - 20,
                    y: 20 + Math.random() * (canvas.offsetHeight - 40),
                    vx: isOut ? 1 + Math.random() : -(1 + Math.random()),
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: 2 + Math.random() * 3,
                    alpha: 0.5,
                    life: 100 + Math.random() * 50,
                    isOut,
                });
            }

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationId);
        };
    }, [transactions]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
        />
    );
}

/* ─────────────────────────── Constants ─────────────────────── */

const DEFAULT_WHALE_ADDRESSES = [
    "0x28C6c06298d514Db089934071355E5743bf21d60",
    "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d",
];

/* ═══════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════ */

export default function WhaleVisualizer() {
    const [selectedWallet, setSelectedWallet] = useState(0);

    const { data, isLoading, error } = useSWR(
        "whale-data",
        () => fetchWhales(DEFAULT_WHALE_ADDRESSES),
        {
            refreshInterval: 30000,
            revalidateOnFocus: false,
        }
    );

    const whales = data || [];
    const currentWhale = whales[selectedWallet];

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

    /* ── Error ── */
    if (error || whales.length === 0) {
        return (
            <div className="glass rounded-2xl p-6 h-[400px] flex items-center justify-center">
                <p className="text-white/30" style={{ fontSize: "var(--text-sm)" }}>
                    Unable to load whale data.
                </p>
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
                            Whale Wallet Tracker
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
                                className="inline-block w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse"
                            />
                            Live
                        </span>
                    </div>
                    <p className="text-white/30" style={{ fontSize: "var(--text-xs)" }}>
                        Large transaction monitoring · Etherscan
                    </p>
                </div>
            </div>

            {/* ── Wallet selector ── */}
            <div className="flex gap-2 px-5 sm:px-6 mt-4">
                {whales.map((whale, i) => (
                    <button
                        key={whale.address}
                        onClick={() => setSelectedWallet(i)}
                        className="px-3 py-1.5 rounded-lg font-mono transition-all"
                        style={{
                            fontSize: "11px",
                            background: selectedWallet === i
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(255,255,255,0.03)",
                            border: `1px solid ${selectedWallet === i ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)"}`,
                            color: selectedWallet === i
                                ? "rgba(255,255,255,0.8)"
                                : "rgba(255,255,255,0.35)",
                        }}
                    >
                        {whale.label || formatAddress(whale.address)}
                    </button>
                ))}
            </div>

            {/* ── Visualization area ── */}
            <div className="relative h-[140px] mx-5 sm:mx-6 mt-4 rounded-xl overflow-hidden"
                style={{ background: "rgba(0,0,0,0.2)" }}
            >
                {currentWhale && (
                    <TransactionCanvas transactions={currentWhale.recentTransactions} />
                )}

                {/* Center node — SVG icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div
                        className="w-11 h-11 rounded-full flex items-center justify-center"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            boxShadow: "0 0 20px rgba(255,255,255,0.03)",
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/50">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                        </svg>
                    </div>
                    <p className="mt-1.5 font-mono text-white/25" style={{ fontSize: "10px" }}>
                        {formatAddress(currentWhale?.address || "")}
                    </p>
                </div>

                {/* Legend */}
                <div className="absolute bottom-2 right-3 flex items-center gap-3"
                    style={{ fontSize: "10px" }}
                >
                    <span className="flex items-center gap-1.5 text-white/25">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#34d399" }} />
                        Inflow
                    </span>
                    <span className="flex items-center gap-1.5 text-white/25">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#ef4444" }} />
                        Outflow
                    </span>
                </div>
            </div>

            {/* ── Stats Row ── */}
            <div
                className="grid grid-cols-3 gap-px mx-5 sm:mx-6 mt-4 rounded-lg overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)" }}
            >
                {[
                    { label: "Balance", value: currentWhale ? `${currentWhale.balance} ETH` : "—" },
                    { label: "USD Value", value: currentWhale ? formatUsd(currentWhale.balanceUsd) : "—" },
                    { label: "Transactions", value: currentWhale ? currentWhale.recentTransactions.length.toString() : "—" },
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

            {/* ── Recent Transactions ── */}
            <div className="p-5 sm:p-6 pt-4 flex-1 min-h-0 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                    <div
                        className="text-white/30 uppercase tracking-wider"
                        style={{ fontSize: "10px" }}
                    >
                        Recent Transactions
                    </div>
                    <div className="text-white/20 tabular-nums" style={{ fontSize: "10px" }}>
                        {currentWhale ? currentWhale.recentTransactions.length : 0} txns
                    </div>
                </div>
                <div
                    className="flex flex-col gap-0.5 overflow-y-auto pr-1 flex-1"
                >
                    {(currentWhale?.recentTransactions || []).map((tx) => (
                        <div
                            key={tx.hash}
                            className="flex items-center justify-between py-1.5 px-2.5 rounded-md transition-colors hover:bg-white/[0.02]"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                                    style={{
                                        color: tx.type === "in" ? "#34d399" : "#ef4444",
                                        background:
                                            tx.type === "in"
                                                ? "rgba(52,211,153,0.1)"
                                                : "rgba(239,68,68,0.1)",
                                    }}
                                >
                                    {tx.type === "in" ? "IN" : "OUT"}
                                </span>
                                <span
                                    className="text-white/40 tabular-nums"
                                    style={{ fontSize: "11px" }}
                                >
                                    {tx.value} {tx.token}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span
                                    className="text-white/50 tabular-nums font-medium"
                                    style={{ fontSize: "11px" }}
                                >
                                    {formatUsd(tx.valueUsd)}
                                </span>
                                <span
                                    className="text-white/20 tabular-nums"
                                    style={{ fontSize: "10px" }}
                                >
                                    {formatTimeAgo(tx.timestamp)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
