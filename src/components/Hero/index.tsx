"use client";

import { useEffect, useCallback, useRef, useState, forwardRef, type ComponentPropsWithoutRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useMagnetic } from "@/hooks/useMagnetic";

const Hero = forwardRef<HTMLElement, ComponentPropsWithoutRef<"section">>((props, ref) => {
    const { setMouse, setScrollProgress } = useAppStore();
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
    const orbRef1 = useRef<HTMLDivElement>(null);
    const orbRef2 = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    const ctaRef1 = useMagnetic<HTMLAnchorElement>({ strength: 0.3, radius: 50 });
    const ctaRef2 = useMagnetic<HTMLAnchorElement>({ strength: 0.3, radius: 50 });

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            setMouse(e.clientX, e.clientY);
            setMousePos({
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
            });
        },
        [setMouse]
    );

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

    // 3-layer parallax: grid (slowest) < orbs (medium) < content (static)
    useEffect(() => {
        const updateOrbs = () => {
            const dx = (mousePos.x - 0.5) * 30;
            const dy = (mousePos.y - 0.5) * 30;

            // Grid moves slowest
            if (gridRef.current) {
                gridRef.current.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px)`;
            }

            // Orbs move at medium speed
            if (orbRef1.current) {
                orbRef1.current.style.transform = `translate(${dx}px, ${dy}px)`;
            }
            if (orbRef2.current) {
                orbRef2.current.style.transform = `translate(${-dx * 0.6}px, ${-dy * 0.6}px)`;
            }
        };

        requestAnimationFrame(updateOrbs);
    }, [mousePos]);

    const title = "ael";

    return (
        <section
            id="hero"
            className="relative min-h-screen w-full overflow-hidden"
            style={{ background: "var(--bg-primary)" }}
            aria-label="Hero section"
        >
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Orb 1 — top right, reacts to mouse */}
                <div
                    ref={orbRef1}
                    className="absolute -top-32 -right-32 w-48 h-48 sm:w-96 sm:h-96 rounded-full opacity-30"
                    style={{
                        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                        transition: 'transform 0.3s ease-out',
                        willChange: 'transform',
                    }}
                />

                {/* Orb 2 — bottom left, counter-reacts */}
                <div
                    ref={orbRef2}
                    className="absolute -bottom-24 -left-24 w-40 h-40 sm:w-80 sm:h-80 rounded-full opacity-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
                        filter: 'blur(50px)',
                        transition: 'transform 0.3s ease-out',
                        willChange: 'transform',
                    }}
                />

                {/* Center glow */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full opacity-10"
                    style={{
                        background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 60%)',
                        filter: 'blur(80px)',
                    }}
                />

                {/* Grid pattern — slowest parallax layer */}
                <div
                    ref={gridRef}
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '80px 80px',
                        transition: 'transform 0.4s ease-out',
                        willChange: 'transform',
                    }}
                />
            </div>

            {/* Content — static layer (fastest by default) */}
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
                <div className="animate-fade-in-up">
                    {/* Staggered letter title with gradient */}
                    <h1
                        className="mb-6 font-medium tracking-tight"
                        style={{ fontSize: 'var(--text-display)' }}
                        aria-label={title}
                    >
                        {title.split("").map((char, i) => (
                            <span
                                key={i}
                                className="letter text-gradient"
                                style={{ animationDelay: `${i * 80}ms` }}
                            >
                                {char}
                            </span>
                        ))}
                    </h1>

                    {/* Role */}
                    <p
                        className="mx-auto max-w-xl text-white/50"
                        style={{ fontSize: 'var(--text-xl)' }}
                    >
                        Web3 Developer &amp; Blockchain Developer
                    </p>

                    {/* Accent line */}
                    <div
                        className="mx-auto mt-6 h-px w-16"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        }}
                    />

                    {/* Subtitle */}
                    <p
                        className="mx-auto mt-6 max-w-lg text-white/30"
                        style={{ fontSize: 'var(--text-sm)' }}
                    >
                        On-chain analytics · DeFi systems · Smart contracts
                    </p>

                    {/* CTA with magnetic hover */}
                    <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <a
                            ref={ctaRef1}
                            href="#projects"
                            className="glass glass-hover rounded-full px-8 py-3 text-white/70 transition-colors hover:text-white"
                            style={{ fontSize: 'var(--text-sm)' }}
                        >
                            View Projects
                        </a>
                        <a
                            ref={ctaRef2}
                            href="https://github.com/thelastbodhisattva"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border border-white/10 px-8 py-3 text-white/50 transition-all hover:border-white/20 hover:text-white"
                            style={{ fontSize: 'var(--text-sm)' }}
                        >
                            GitHub →
                        </a>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
                    <div className="flex flex-col items-center gap-2 text-white/20">
                        <span className="uppercase tracking-widest" style={{ fontSize: 'var(--text-xs)' }}>Scroll</span>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
});
Hero.displayName = "Hero";

export default Hero;
