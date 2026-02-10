"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInView } from "@/hooks/useInView";

const WhaleTrackerStudy = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"article">>(
    ({ className, ...props }, ref) => {
        const { ref: revealRef } = useInView();

        return (
            <Card
                ref={ref}
                variant="subtle"
                className={cn("p-8 h-full", className)}
                {...props}
                role="article"
            >
                <div ref={revealRef} data-reveal="">
                    <header className="mb-8">
                        <Badge variant="category" className="mb-4">
                            Analytics Platform
                        </Badge>
                        <h3
                            className="font-medium text-white mb-2"
                            style={{ fontSize: "var(--text-xl)" }}
                        >
                            GottaTrackEmAll
                        </h3>
                        <p className="text-white/40" style={{ fontSize: "var(--text-sm)" }}>
                            Real-time Polymarket whale &amp; insider detection with 11-factor scoring,
                            leaderboards, watchlists, and multi-channel alerts.
                        </p>
                    </header>

                    <CardContent className="space-y-6">
                        {/* Problem */}
                        <section>
                            <h4
                                className="font-medium text-white/50 uppercase tracking-wider mb-2"
                                style={{ fontSize: "var(--text-xs)" }}
                            >
                                Problem
                            </h4>
                            <p className="text-white/30" style={{ fontSize: "var(--text-sm)" }}>
                                Polymarket&apos;s prediction markets attract sophisticated traders.
                                Detecting smart money movements in real-time before information becomes stale.
                            </p>
                        </section>

                        {/* Solution */}
                        <section>
                            <h4
                                className="font-medium text-white/50 uppercase tracking-wider mb-3"
                                style={{ fontSize: "var(--text-xs)" }}
                            >
                                Solution
                            </h4>
                            <ul className="space-y-2 text-white/40" style={{ fontSize: "var(--text-sm)" }}>
                                {[
                                    "WebSocket CLOB feed, filtering trades >$15k",
                                    "11-factor scoring: wallet age, timing, sizing, clusters, correlation",
                                    "Smart profile resolution (Proxy/Kernel/EOA detection)",
                                    "Leaderboard with ROI tracking, custom watchlists",
                                ].map((item) => (
                                    <li key={item} className="flex gap-2">
                                        <span className="text-white/20 shrink-0">→</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Architecture */}
                        <section>
                            <h4
                                className="font-medium text-white/50 uppercase tracking-wider mb-3"
                                style={{ fontSize: "var(--text-xs)" }}
                            >
                                Architecture
                            </h4>
                            <div className="grid grid-cols-2 gap-2" style={{ fontSize: "var(--text-xs)" }}>
                                {[
                                    { label: "Backend", value: "Node.js, TypeScript" },
                                    { label: "Frontend", value: "React, Vite" },
                                    { label: "Data", value: "MongoDB, Redis" },
                                    { label: "Infra", value: "Docker Compose" },
                                ].map((item) => (
                                    <div key={item.label} className="glass p-3 rounded-xl text-center">
                                        <div className="text-white/70">{item.label}</div>
                                        <div className="text-white/30 mt-1">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </CardContent>

                    <CardFooter className="justify-between">
                        <div className="flex gap-2 flex-wrap">
                            {["TypeScript", "Node.js", "React", "MongoDB"].map((tech) => (
                                <Badge key={tech} variant="default" size="sm" className="font-mono">
                                    {tech}
                                </Badge>
                            ))}
                        </div>
                        <a
                            href="https://github.com/thelastbodhisattva/GottaTrackEmAll"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/30 hover:text-white transition-colors"
                            style={{ fontSize: "var(--text-sm)" }}
                        >
                            Source →
                        </a>
                    </CardFooter>
                </div>
            </Card>
        );
    }
);
WhaleTrackerStudy.displayName = "WhaleTrackerStudy";

export default WhaleTrackerStudy;
