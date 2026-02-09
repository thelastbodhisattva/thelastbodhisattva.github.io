import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = getAllPostSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return { title: "Post Not Found" };
    }

    return {
        title: `${post.title} | ael`,
        description: post.description,
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a]">
            {/* Header */}
            <header className="pt-24 pb-12 px-6">
                <div className="max-w-2xl mx-auto">
                    <Link
                        href="/blog"
                        className="inline-block mb-8 text-white/30 hover:text-white transition-colors text-sm"
                    >
                        ← All Posts
                    </Link>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                            <span key={tag} className="tag">{tag}</span>
                        ))}
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-medium text-white mb-4">
                        {post.title}
                    </h1>

                    <p className="text-white/40 mb-4">
                        {post.description}
                    </p>

                    <time className="text-sm text-white/30">
                        {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </time>
                </div>
            </header>

            {/* Content */}
            <article className="max-w-2xl mx-auto px-6 pb-24">
                <div className="prose prose-invert max-w-none">
                    <MDXRemote source={post.content} />
                </div>
            </article>

            {/* Footer */}
            <footer className="max-w-2xl mx-auto px-6 pb-24">
                <div className="border-t border-white/10 pt-8">
                    <Link
                        href="/blog"
                        className="text-white/40 hover:text-white transition-colors text-sm"
                    >
                        ← Back to all posts
                    </Link>
                </div>
            </footer>
        </main>
    );
}
