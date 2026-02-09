"use client";

export default function WhaleTrackerStudy() {
    return (
        <article className="glass p-8 h-full flex flex-col">
            <header className="mb-8">
                <span className="tag uppercase mb-4 inline-block">
                    Analytics Platform
                </span>
                <h3 className="text-2xl font-medium text-white mb-2">
                    GottaTrackEmAll
                </h3>
                <p className="text-white/40 text-sm">
                    Real-time Polymarket whale &amp; insider detection with 11-factor scoring,
                    leaderboards, watchlists, and multi-channel alerts.
                </p>
            </header>

            <div className="space-y-6 flex-1">
                {/* Problem */}
                <section>
                    <h4 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                        Problem
                    </h4>
                    <p className="text-sm text-white/30">
                        Polymarket&apos;s prediction markets attract sophisticated traders.
                        Detecting smart money movements in real-time before information becomes stale.
                    </p>
                </section>

                {/* Solution */}
                <section>
                    <h4 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">
                        Solution
                    </h4>
                    <ul className="space-y-2 text-sm text-white/40">
                        <li className="flex gap-2">
                            <span className="text-white/20">→</span>
                            <span>WebSocket CLOB feed, filtering trades &gt;$15k</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-white/20">→</span>
                            <span>11-factor scoring: wallet age, timing, sizing, clusters, correlation</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-white/20">→</span>
                            <span>Smart profile resolution (Proxy/Kernel/EOA detection)</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-white/20">→</span>
                            <span>Leaderboard with ROI tracking, custom watchlists</span>
                        </li>
                    </ul>
                </section>

                {/* Stack */}
                <section>
                    <h4 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">
                        Architecture
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="glass p-3 rounded-xl text-center">
                            <div className="text-white/70">Backend</div>
                            <div className="text-white/30 mt-1">Node.js, TypeScript</div>
                        </div>
                        <div className="glass p-3 rounded-xl text-center">
                            <div className="text-white/70">Frontend</div>
                            <div className="text-white/30 mt-1">React, Vite</div>
                        </div>
                        <div className="glass p-3 rounded-xl text-center">
                            <div className="text-white/70">Data</div>
                            <div className="text-white/30 mt-1">MongoDB, Redis</div>
                        </div>
                        <div className="glass p-3 rounded-xl text-center">
                            <div className="text-white/70">Infra</div>
                            <div className="text-white/30 mt-1">Docker Compose</div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                    {["TypeScript", "Node.js", "React", "MongoDB"].map((tech) => (
                        <span key={tech} className="tag">{tech}</span>
                    ))}
                </div>
                <a
                    href="https://github.com/thelastbodhisattva/GottaTrackEmAll"
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
