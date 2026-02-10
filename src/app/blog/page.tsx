import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import BlogList from "@/components/Blog/BlogList";

export const metadata = {
    title: "Notes | ael",
    description: "Technical writings on blockchain, DeFi, and quantitative research.",
};

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <main className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
            {/* Header */}
            <header className="pt-24 pb-16 px-6 text-center">
                <Link
                    href="/"
                    className="inline-block mb-8 text-white/30 hover:text-white transition-colors"
                    style={{ fontSize: "var(--text-sm)" }}
                >
                    ← Back
                </Link>
                <h1
                    className="font-medium text-white mb-4"
                    style={{ fontSize: "var(--text-3xl)" }}
                >
                    Notes
                </h1>
                <p
                    className="text-white/40 max-w-md mx-auto"
                    style={{ fontSize: "var(--text-base)" }}
                >
                    Technical writings on blockchain, DeFi, and quantitative research.
                </p>
            </header>

            {/* Posts list with pagination */}
            <section className="max-w-3xl mx-auto px-6 pb-24">
                {posts.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <p className="text-white/40" style={{ fontSize: "var(--text-base)" }}>
                            No posts yet. Check back soon.
                        </p>
                    </div>
                ) : (
                    <BlogList posts={posts} />
                )}
            </section>
        </main>
    );
}
