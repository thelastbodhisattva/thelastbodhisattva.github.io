"use client";

export default function FundingRateStudy() {
    return (
        <article className="glass p-8 h-full flex flex-col">
            <header className="mb-8">
                <span className="tag uppercase mb-4 inline-block">
                    Market Intelligence
                </span>
                <h3 className="text-2xl font-medium text-white mb-2">
                    Calibrasteme
                </h3>
                <p className="text-white/40 text-sm">
                    Unified market monitoring system combining funding rate predictions,
                    options gamma exposure, whale tracking, and solana meme token discovery.
                </p>
            </header>

            <div className="space-y-6 flex-1">
                {/* Problem */}
                <section>
                    <h4 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                        Problem
                    </h4>
                    <p className="text-sm text-white/30">
                        Manually checking 8+ sites every hour. Funding spikes noticed 6 hours late.
                        Whale movements seen on X after dumps already happened.
                    </p>
                </section>

                {/* Features */}
                <section>
                    <h4 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">
                        Features
                    </h4>
                    <div className="space-y-2">
                        <div className="glass p-3 rounded-xl">
                            <h5 className="text-sm text-white/80 mb-1">Funding Rate Predictor</h5>
                            <p className="text-xs text-white/30">Z-scores + ML capped at ±30%. Auto-fallback when Brier &gt; 0.25</p>
                        </div>
                        <div className="glass p-3 rounded-xl">
                            <h5 className="text-sm text-white/80 mb-1">Options Gamma Exposure</h5>
                            <p className="text-xs text-white/30">Deribit BTC options chain. Negative GEX = amplified volatility</p>
                        </div>
                        <div className="glass p-3 rounded-xl">
                            <h5 className="text-sm text-white/80 mb-1">Whale Tracking</h5>
                            <p className="text-xs text-white/30">$5M+ movements via Alchemy. Multi-wallet exchange flow detection</p>
                        </div>
                        <div className="glass p-3 rounded-xl">
                            <h5 className="text-sm text-white/80 mb-1">Solana Meme Token Discovery</h5>
                            <p className="text-xs text-white/30">DexScreener scanning every 15min. Auto-tracks score &gt;70</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                    {["Python", "ML", "Alchemy", "Deribit"].map((tech) => (
                        <span key={tech} className="tag">{tech}</span>
                    ))}
                </div>
                <a
                    href="https://github.com/thelastbodhisattva/calibrasteme"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/30 hover:text-white transition-colors"
                >
                    Source →
                </a>
            </footer>
        </article>
    );
}
