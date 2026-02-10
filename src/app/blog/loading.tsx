export default function Loading() {
    return (
        <main className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
            {/* Header skeleton */}
            <header className="pt-24 pb-16 px-6 text-center">
                <div className="h-4 w-16 rounded bg-white/5 mx-auto mb-8 animate-pulse" />
                <div className="h-8 w-32 rounded bg-white/5 mx-auto mb-4 animate-pulse" />
                <div className="h-4 w-64 rounded bg-white/5 mx-auto animate-pulse" />
            </header>

            {/* Post list skeleton */}
            <section className="max-w-3xl mx-auto px-6 pb-24 space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="glass rounded-2xl p-6 animate-pulse"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-3 w-20 rounded bg-white/5" />
                            <div className="h-3 w-14 rounded bg-white/5" />
                        </div>
                        <div className="h-5 w-3/4 rounded bg-white/5 mb-2" />
                        <div className="h-3 w-full rounded bg-white/5" />
                        <div className="h-3 w-2/3 rounded bg-white/5 mt-1" />
                    </div>
                ))}
            </section>
        </main>
    );
}
