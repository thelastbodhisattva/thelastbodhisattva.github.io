"use client";

import dynamic from "next/dynamic";

const WhaleVisualizer = dynamic(() => import("@/components/WhaleVisualizer"), {
    ssr: false,
    loading: () => (
        <div className="glass rounded-2xl p-6 h-[400px] flex items-center justify-center">
            <div className="w-6 h-6 border border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
    ),
});

const FundingRateChart = dynamic(() => import("@/components/FundingRateChart"), {
    ssr: false,
    loading: () => (
        <div className="glass rounded-2xl p-6 h-[400px] flex items-center justify-center">
            <div className="w-6 h-6 border border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
    ),
});

export default function LiveDemos() {
    return (
        <section
            id="demos"
            className="section"
            aria-label="Live demos section"
        >
            <div className="mx-auto max-w-6xl">
                {/* Section header */}
                <header className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-medium text-white sm:text-4xl">
                        Live Demos
                    </h2>
                    <p className="mx-auto max-w-lg text-white/40 text-sm">
                        Real-time blockchain analytics and predictive models.
                    </p>
                </header>

                {/* Demo grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Whale Tracker Demo */}
                    <div id="whale-demo">
                        <WhaleVisualizer />
                    </div>

                    {/* Funding Rate Demo */}
                    <div id="funding-demo">
                        <FundingRateChart />
                    </div>
                </div>

                {/* Data notice */}
                <p className="mt-8 text-center text-xs text-white/20">
                    Demo uses sample data. Connect API keys for live data.
                </p>
            </div>
        </section>
    );
}
