"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import { Badge } from "@/components/ui/badge";
import type { PostMeta } from "@/lib/blog";

interface BlogSectionClientProps {
    posts: PostMeta[];
}

export default function BlogSectionClient({ posts }: BlogSectionClientProps) {
    const displayPosts = posts.slice(0, 3);
    const { ref: headerRef } = useInView();
    const { ref: contentRef } = useInView();

    return (
        <section id="blog" className="section" aria-label="Blog and notes">
            <div className="mx-auto max-w-3xl">
                {/* Section header */}
                <header ref={headerRef} data-reveal="" className="mb-12 text-center">
                    <h2
                        className="mb-4 font-medium text-white"
                        style={{ fontSize: "var(--text-3xl)" }}
                    >
                        Notes
                    </h2>
                    <p className="text-white/40" style={{ fontSize: "var(--text-sm)" }}>
                        Technical writings on blockchain and quantitative research.
                    </p>
                </header>

                {/* Posts */}
                <div ref={contentRef} data-reveal="">
                    {displayPosts.length === 0 ? (
                        <div className="glass rounded-2xl p-12 text-center">
                            <p
                                className="text-white/60 mb-2"
                                style={{ fontSize: "var(--text-lg)" }}
                            >
                                Coming Soon
                            </p>
                            <p className="text-white/30" style={{ fontSize: "var(--text-sm)" }}>
                                Follow on{" "}
                                <a
                                    href="https://github.com/thelastbodhisattva"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/50 hover:text-white transition-colors"
                                >
                                    GitHub
                                </a>{" "}
                                for updates.
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
                                            <h3
                                                className="font-medium text-white group-hover:text-white/80 transition-colors mb-2"
                                                style={{ fontSize: "var(--text-lg)" }}
                                            >
                                                {post.title}
                                            </h3>
                                            <p
                                                className="text-white/40 line-clamp-2 mb-3"
                                                style={{ fontSize: "var(--text-sm)" }}
                                            >
                                                {post.description}
                                            </p>
                                            <div
                                                className="flex items-center gap-3 text-white/30"
                                                style={{ fontSize: "var(--text-xs)" }}
                                            >
                                                <time>{post.date}</time>
                                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                                <span>{post.readingTime} min read</span>
                                                {post.tags.slice(0, 2).map((tag) => (
                                                    <Badge key={tag} variant="default" size="sm">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-white/20 group-hover:text-white/40 group-hover:translate-x-1 transition-all mt-1">
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
                                        className="text-white/40 hover:text-white transition-colors"
                                        style={{ fontSize: "var(--text-sm)" }}
                                    >
                                        View all posts →
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
