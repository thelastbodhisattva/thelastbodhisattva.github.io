"use client";

import { useEffect, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";

export default function Hero() {
    const { setMouse, setScrollProgress } = useAppStore();

    // Mouse tracking
    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            setMouse(e.clientX, e.clientY);
        },
        [setMouse]
    );

    // Scroll tracking
    const handleScroll = useCallback(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollTop / docHeight : 0;
        setScrollProgress(Math.min(1, Math.max(0, progress)));
    }, [setScrollProgress]);

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [handleMouseMove, handleScroll]);

    return (
        <section
            id="hero"
            className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a]"
            aria-label="Hero section"
        >
            {/* Glassmorphism background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Large blurred glass orb - top right */}
                <div
                    className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30"
                    style={{
                        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                    }}
                />

                {/* Medium glass orb - bottom left */}
                <div
                    className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
                        filter: 'blur(50px)',
                    }}
                />

                {/* Subtle center glow */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
                    style={{
                        background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 60%)',
                        filter: 'blur(80px)',
                    }}
                />

                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '80px 80px'
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
                <div className="animate-fade-in-up">
                    {/* Name */}
                    <h1 className="mb-6 text-5xl font-medium tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-white">
                        ael
                    </h1>

                    {/* Role */}
                    <p className="mx-auto max-w-xl text-lg text-white/50 sm:text-xl">
                        Web3 Developer &amp; Blockchain Dev
                    </p>

                    {/* Subtitle */}
                    <p className="mx-auto mt-4 max-w-lg text-sm text-white/30">
                        On-chain analytics · DeFi systems · Smart contracts
                    </p>

                    {/* CTA */}
                    <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <a
                            href="#projects"
                            className="glass glass-hover rounded-full px-8 py-3 text-sm text-white/70 transition-colors hover:text-white"
                        >
                            View Projects
                        </a>
                        <a
                            href="https://github.com/thelastbodhisattva"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border border-white/10 px-8 py-3 text-sm text-white/50 transition-all hover:border-white/20 hover:text-white"
                        >
                            GitHub →
                        </a>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
                    <div className="flex flex-col items-center gap-2 text-white/20">
                        <span className="text-xs uppercase tracking-widest">Scroll</span>
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
}
