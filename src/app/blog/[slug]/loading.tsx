export default function Loading() {
    return (
        <main className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
            {/* Header skeleton */}
            <header className="pt-24 pb-12 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="h-4 w-16 rounded bg-white/5 mb-8 animate-pulse" />
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-5 w-20 rounded-full bg-white/5 animate-pulse" />
                        <div className="h-5 w-16 rounded-full bg-white/5 animate-pulse" />
                    </div>
                    <div className="h-10 w-3/4 rounded bg-white/5 mb-4 animate-pulse" />
                    <div className="h-4 w-full rounded bg-white/5 mb-2 animate-pulse" />
                    <div className="h-4 w-2/3 rounded bg-white/5 animate-pulse" />
                </div>
            </header>

            {/* Content skeleton */}
            <div className="max-w-5xl mx-auto px-6 pb-24">
                <div className="space-y-4">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="h-4 rounded bg-white/5 animate-pulse"
                            style={{
                                width: `${70 + Math.random() * 30}%`,
                                animationDelay: `${i * 50}ms`,
                            }}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
