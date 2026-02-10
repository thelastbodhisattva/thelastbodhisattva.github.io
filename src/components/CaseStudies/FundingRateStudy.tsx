"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInView } from "@/hooks/useInView";

const FundingRateStudy = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"article">>(
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
                            Market Intelligence
                        </Badge>
                        <h3
                            className="font-medium text-white mb-2"
                            style={{ fontSize: "var(--text-xl)" }}
                        >
                            Calibrasteme
                        </h3>
                        <p className="text-white/40" style={{ fontSize: "var(--text-sm)" }}>
                            Unified market monitoring system combining funding rate predictions,
                            options gamma exposure, whale tracking, and solana meme token discovery.
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
                                Manually checking 8+ sites every hour. Funding spikes noticed 6 hours late.
                                Whale movements seen on X after dumps already happened.
                            </p>
                        </section>

                        {/* Features */}
                        <section>
                            <h4
                                className="font-medium text-white/50 uppercase tracking-wider mb-3"
                                style={{ fontSize: "var(--text-xs)" }}
                            >
                                Features
                            </h4>
                            <div className="space-y-2">
                                {[
                                    {
                                        title: "Funding Rate Predictor",
                                        desc: "Z-scores + ML capped at ±30%. Auto-fallback when Brier > 0.25",
                                    },
                                    {
                                        title: "Options Gamma Exposure",
                                        desc: "Deribit BTC options chain. Negative GEX = amplified volatility",
                                    },
                                    {
                                        title: "Whale Tracking",
                                        desc: "$5M+ movements via Alchemy. Multi-wallet exchange flow detection",
                                    },
                                    {
                                        title: "Solana Meme Token Discovery",
                                        desc: "DexScreener scanning every 15min. Auto-tracks score >70",
                                    },
                                ].map((feature) => (
                                    <div key={feature.title} className="glass p-3 rounded-xl">
                                        <h5
                                            className="text-white/80 mb-1"
                                            style={{ fontSize: "var(--text-sm)" }}
                                        >
                                            {feature.title}
                                        </h5>
                                        <p className="text-white/30" style={{ fontSize: "var(--text-xs)" }}>
                                            {feature.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </CardContent>

                    <CardFooter className="justify-between">
                        <div className="flex gap-2 flex-wrap">
                            {["Python", "ML", "Alchemy", "Deribit"].map((tech) => (
                                <Badge key={tech} variant="default" size="sm" className="font-mono">
                                    {tech}
                                </Badge>
                            ))}
                        </div>
                        <a
                            href="https://github.com/thelastbodhisattva/calibrasteme"
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
FundingRateStudy.displayName = "FundingRateStudy";

export default FundingRateStudy;
