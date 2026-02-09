"use client";

import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { fetchWhales, formatAddress, formatUsd, formatTimeAgo, WhaleWallet } from "@/lib/blockchain";

// Canvas animation for transaction particles
function TransactionCanvas({ transactions }: { transactions: WhaleWallet["recentTransactions"] }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size
        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        resize();
        window.addEventListener("resize", resize);

        // Particle system
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
        const maxParticles = 30;

        // Create particles from transactions
        transactions.forEach((tx, i) => {
            const isOut = tx.type === "out";
            particles.push({
                x: isOut ? 20 : canvas.offsetWidth - 20,
                y: 30 + i * 25,
                vx: isOut ? 1.5 : -1.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.min(6, Math.max(2, tx.valueUsd / 5000000)),
                alpha: 0.4,
                life: 100 + Math.random() * 50,
                isOut,
            });
        });

        let animationId: number;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

            // Draw connection line
            ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(20, canvas.offsetHeight / 2);
            ctx.lineTo(canvas.offsetWidth - 20, canvas.offsetHeight / 2);
            ctx.stroke();

            // Update and draw particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.5;
                p.alpha = Math.max(0, (p.life / 100) * 0.4);

                if (p.life <= 0) {
                    // Reset particle
                    p.x = p.isOut ? 20 : canvas.offsetWidth - 20;
                    p.y = 20 + Math.random() * (canvas.offsetHeight - 40);
                    p.life = 100 + Math.random() * 50;
                    p.alpha = 0.4;
                }

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
                ctx.fill();
            }

            // Add new particles occasionally
            if (Math.random() < 0.02 && particles.length < maxParticles) {
                const isOut = Math.random() > 0.5;
                particles.push({
                    x: isOut ? 20 : canvas.offsetWidth - 20,
                    y: 20 + Math.random() * (canvas.offsetHeight - 40),
                    vx: isOut ? 1 + Math.random() : -(1 + Math.random()),
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: 2 + Math.random() * 3,
                    alpha: 0.4,
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

// Default whale addresses to track
const DEFAULT_WHALE_ADDRESSES = [
    "0x28C6c06298d514Db089934071355E5743bf21d60",
    "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d",
];

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

    if (isLoading) {
        return (
            <div className="glass rounded-2xl p-6 h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-6 h-6 border border-white/20 border-t-white/60 rounded-full animate-spin" />
                    <p className="text-white/40 text-sm">Loading whale data...</p>
                </div>
            </div>
        );
    }

    if (error || whales.length === 0) {
        return (
            <div className="glass rounded-2xl p-6 h-[400px] flex items-center justify-center">
                <p className="text-white/40 text-sm">Unable to load whale data.</p>
            </div>
        );
    }

    return (
        <div className="glass rounded-2xl p-6 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-medium text-white">Whale Wallet Tracker</h3>
                    <p className="text-sm text-white/30">Large transaction monitoring</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs text-white/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
                        Live
                    </span>
                </div>
            </div>

            {/* Wallet selector */}
            <div className="flex gap-2 mb-6">
                {whales.map((whale, i) => (
                    <button
                        key={whale.address}
                        onClick={() => setSelectedWallet(i)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${selectedWallet === i
                                ? "bg-white/10 text-white"
                                : "bg-white/5 text-white/40 hover:bg-white/10"
                            }`}
                    >
                        {whale.label || formatAddress(whale.address)}
                    </button>
                ))}
            </div>

            {/* Visualization area */}
            <div className="relative h-[160px] rounded-xl bg-black/20 overflow-hidden mb-6">
                {currentWhale && (
                    <TransactionCanvas transactions={currentWhale.recentTransactions} />
                )}

                {/* Center node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <span className="text-lg">🐋</span>
                    </div>
                    <p className="mt-2 text-xs font-mono text-white/30">
                        {formatAddress(currentWhale?.address || "")}
                    </p>
                </div>

                {/* Legend */}
                <div className="absolute bottom-2 right-3 flex items-center gap-4 text-xs text-white/20">
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        Inflow
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        Outflow
                    </span>
                </div>
            </div>

            {/* Stats */}
            {currentWhale && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-white/3">
                        <p className="text-xs text-white/30 mb-1">Balance</p>
                        <p className="text-xl font-medium text-white">{currentWhale.balance} ETH</p>
                        <p className="text-sm text-white/40">{formatUsd(currentWhale.balanceUsd)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/3">
                        <p className="text-xs text-white/30 mb-1">24h Transactions</p>
                        <p className="text-xl font-medium text-white">{currentWhale.recentTransactions.length}</p>
                        <p className="text-sm text-white/40">Recent activity</p>
                    </div>
                </div>
            )}

            {/* Recent transactions */}
            {currentWhale && (
                <div>
                    <h4 className="text-sm text-white/50 mb-3">Recent Transactions</h4>
                    <div className="space-y-2">
                        {currentWhale.recentTransactions.slice(0, 3).map((tx) => (
                            <div
                                key={tx.hash}
                                className="flex items-center justify-between p-3 rounded-lg bg-white/3"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm bg-white/5 text-white/50">
                                        {tx.type === "in" ? "↓" : "↑"}
                                    </span>
                                    <div>
                                        <p className="text-sm font-mono text-white/70">{tx.value} {tx.token}</p>
                                        <p className="text-xs text-white/30">{formatTimeAgo(tx.timestamp)}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-white/40">{formatUsd(tx.valueUsd)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
