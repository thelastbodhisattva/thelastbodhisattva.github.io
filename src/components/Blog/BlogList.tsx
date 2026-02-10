"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { PostMeta } from "@/lib/blog";

const POSTS_PER_PAGE = 6;

interface BlogListProps {
    posts: PostMeta[];
}

export default function BlogList({ posts }: BlogListProps) {
    const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

    const visiblePosts = posts.slice(0, visibleCount);
    const hasMore = visibleCount < posts.length;

    return (
        <>
            <div className="space-y-4">
                {visiblePosts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="block glass-card p-6 group"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <h2
                                    className="font-medium text-white group-hover:text-white/80 transition-colors mb-2"
                                    style={{ fontSize: "var(--text-lg)" }}
                                >
                                    {post.title}
                                </h2>
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
                                    <span className="w-1 h-1 rounded-full bg-white/20" />
                                    <div className="flex gap-2">
                                        {post.tags.slice(0, 3).map((tag) => (
                                            <Badge key={tag} variant="default" size="sm">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <span className="text-white/20 group-hover:text-white/40 group-hover:translate-x-1 transition-all">
                                →
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Load more */}
            {hasMore && (
                <div className="text-center pt-8">
                    <button
                        onClick={() => setVisibleCount((prev) => prev + POSTS_PER_PAGE)}
                        className="glass glass-hover rounded-full px-6 py-3 text-white/50 hover:text-white transition-colors"
                        style={{ fontSize: "var(--text-sm)" }}
                    >
                        Load more posts
                    </button>
                </div>
            )}
        </>
    );
}
