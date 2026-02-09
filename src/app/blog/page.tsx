import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
    title: "Notes | ael",
    description: "Technical writings on blockchain, DeFi, and quantitative research.",
};

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <main className="min-h-screen bg-[#0a0a0a]">
            {/* Header */}
            <header className="pt-24 pb-16 px-6 text-center">
                <Link
                    href="/"
                    className="inline-block mb-8 text-white/30 hover:text-white transition-colors text-sm"
                >
                    ← Back
                </Link>
                <h1 className="text-4xl font-medium text-white mb-4">Notes</h1>
                <p className="text-white/40 max-w-md mx-auto">
                    Technical writings on blockchain, DeFi, and quantitative research.
                </p>
            </header>

            {/* Posts grid */}
            <section className="max-w-3xl mx-auto px-6 pb-24">
                {posts.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <p className="text-white/40">No posts yet. Check back soon.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="block glass-card p-6 group"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h2 className="text-lg font-medium text-white group-hover:text-white/80 transition-colors mb-2">
                                            {post.title}
                                        </h2>
                                        <p className="text-sm text-white/40 line-clamp-2 mb-3">
                                            {post.description}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-white/30">
                                            <time>{post.date}</time>
                                            <span className="w-1 h-1 rounded-full bg-white/20" />
                                            <div className="flex gap-2">
                                                {post.tags.slice(0, 3).map((tag) => (
                                                    <span key={tag} className="tag">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-white/20 group-hover:text-white/40 transition-colors">
                                        →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
