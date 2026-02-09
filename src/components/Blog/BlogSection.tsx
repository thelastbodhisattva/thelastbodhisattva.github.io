import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export default function BlogSection() {
    const posts = getAllPosts();
    const displayPosts = posts.slice(0, 3); // Show max 3 posts on homepage

    return (
        <section
            id="blog"
            className="section"
            aria-label="Blog and notes"
        >
            <div className="mx-auto max-w-3xl">
                {/* Section header */}
                <header className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-medium text-white sm:text-4xl">
                        Notes
                    </h2>
                    <p className="text-white/40 text-sm">
                        Technical writings on blockchain and quantitative research.
                    </p>
                </header>

                {/* Posts */}
                {displayPosts.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <p className="text-white/60 text-lg mb-2">Coming Soon</p>
                        <p className="text-white/30 text-sm">
                            Follow on{" "}
                            <a
                                href="https://github.com/thelastbodhisattva"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/50 hover:text-white transition-colors"
                            >
                                GitHub
                            </a>
                            {" "}for updates.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {displayPosts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="block glass-card p-6 group"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-white group-hover:text-white/80 transition-colors mb-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-white/40 line-clamp-2 mb-3">
                                            {post.description}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-white/30">
                                            <time>{post.date}</time>
                                            {post.tags.slice(0, 2).map((tag) => (
                                                <span key={tag} className="tag">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-white/20 group-hover:text-white/40 transition-colors mt-1">
                                        →
                                    </span>
                                </div>
                            </Link>
                        ))}

                        {/* View all link */}
                        {posts.length > 3 && (
                            <div className="text-center pt-4">
                                <Link
                                    href="/blog"
                                    className="text-sm text-white/40 hover:text-white transition-colors"
                                >
                                    View all posts →
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
