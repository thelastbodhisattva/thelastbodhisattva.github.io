"use client";

import { useInView } from "@/hooks/useInView";
import dynamic from "next/dynamic";

const WhaleVisualizer = dynamic(() => import("@/components/WhaleVisualizer"), {
    ssr: false,
    loading: () => (
        <div className="glass rounded-2xl p-6 h-full flex flex-col gap-4 animate-pulse">
            <div className="h-5 w-1/3 rounded bg-white/5" />
            <div className="h-3 w-2/3 rounded bg-white/5" />
            <div className="flex-1 rounded-xl bg-white/[0.02]" />
            <div className="flex gap-3">
                <div className="h-8 w-20 rounded-full bg-white/5" />
                <div className="h-8 w-20 rounded-full bg-white/5" />
            </div>
        </div>
    ),
});

const FundingRateChart = dynamic(() => import("@/components/FundingRateChart"), {
    ssr: false,
    loading: () => (
        <div className="glass rounded-2xl p-6 h-full flex flex-col gap-4 animate-pulse">
            <div className="h-5 w-1/3 rounded bg-white/5" />
            <div className="h-3 w-2/3 rounded bg-white/5" />
            <div className="flex-1 rounded-xl bg-white/[0.02]" />
            <div className="flex gap-3">
                <div className="h-8 w-20 rounded-full bg-white/5" />
                <div className="h-8 w-20 rounded-full bg-white/5" />
            </div>
        </div>
    ),
});

const RegimeClassifier = dynamic(() => import("@/components/RegimeClassifier"), {
    ssr: false,
    loading: () => (
        <div className="glass rounded-2xl p-6 h-[400px] flex flex-col gap-4 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="h-5 w-1/3 rounded bg-white/5" />
                <div className="h-8 w-36 rounded-xl bg-white/5" />
            </div>
            <div className="grid grid-cols-4 gap-px rounded-lg overflow-hidden">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-14 bg-white/[0.02]" />
                ))}
            </div>
            <div className="h-8 rounded-lg bg-white/[0.02]" />
            <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white/[0.02]" />
                <div className="rounded-lg bg-white/[0.02]" />
            </div>
        </div>
    ),
});

export default function LiveDemos() {
    const { ref: headerRef } = useInView();
    const { ref: gridRef } = useInView();
    const { ref: regimeRef } = useInView();

    return (
        <section
            id="demos"
            className="section"
            aria-label="Live demos section"
        >
            <div className="mx-auto max-w-6xl">
                {/* Section header */}
                <header ref={headerRef} data-reveal="" className="mb-16 text-center">
                    <h2
                        className="mb-4 font-medium text-white"
                        style={{ fontSize: 'var(--text-3xl)' }}
                    >
                        Live Demos
                    </h2>
                    <p className="mx-auto max-w-lg text-white/40" style={{ fontSize: 'var(--text-sm)' }}>
                        Real-time blockchain analytics and predictive models.
                    </p>
                </header>

                {/* Demo grid */}
                <div ref={gridRef} data-reveal="" className="grid gap-6 lg:grid-cols-2 items-start">
                    <div id="whale-demo" className="demo-wrapper">
                        <WhaleVisualizer />
                    </div>
                    <div id="funding-demo" className="demo-wrapper">
                        <FundingRateChart />
                    </div>
                </div>

                {/* Regime Classifier — full-width row */}
                <div ref={regimeRef} data-reveal="" className="mt-6" id="regime-demo">
                    <RegimeClassifier />
                </div>

                {/* Data notice */}
                <p className="mt-8 text-center text-white/20" style={{ fontSize: 'var(--text-xs)' }}>
                    Demo uses sample data. Connect API keys for live data.
                </p>
            </div>
        </section>
    );
}
