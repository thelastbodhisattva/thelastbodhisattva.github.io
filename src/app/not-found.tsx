import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center px-6">
            <div className="text-center">
                <h1
                    className="font-medium text-white mb-4"
                    style={{ fontSize: "var(--text-display)" }}
                >
                    404
                </h1>
                <p
                    className="text-white/40 mb-8"
                    style={{ fontSize: "var(--text-lg)" }}
                >
                    This page doesn&apos;t exist.
                </p>
                <Link
                    href="/"
                    className="glass glass-hover inline-flex items-center gap-2 rounded-full px-6 py-3 text-white/70 hover:text-white transition-colors"
                    style={{ fontSize: "var(--text-sm)" }}
                >
                    ← Back home
                </Link>
            </div>
        </main>
    );
}
