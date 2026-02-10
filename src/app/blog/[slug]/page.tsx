import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Pre, TableOfContents } from "@/components/Blog/MdxComponents";
import ScrollProgress from "@/components/ScrollProgress";

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

/* Generate slug IDs identical to extractHeadings() in blog.ts */
function slugify(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function MdxH1(props: any) { return <h1 id={slugify(String(props.children ?? ""))} {...props} />; }
function MdxH2(props: any) { return <h2 id={slugify(String(props.children ?? ""))} {...props} />; }
function MdxH3(props: any) { return <h3 id={slugify(String(props.children ?? ""))} {...props} />; }

const mdxComponents = {
    pre: Pre,
    h1: MdxH1,
    h2: MdxH2,
    h3: MdxH3,
    table: (props: Record<string, unknown>) => (
        <div className="overflow-x-auto my-6">
            <table className="w-full text-left border-collapse" {...props} />
        </div>
    ),
    th: (props: Record<string, unknown>) => (
        <th className="border-b border-white/10 px-4 py-2 font-medium text-[var(--text-primary)]" style={{ fontSize: "var(--text-sm)" }} {...props} />
    ),
    td: (props: Record<string, unknown>) => (
        <td className="border-b border-white/5 px-4 py-2 text-[var(--text-secondary)]" style={{ fontSize: "var(--text-sm)" }} {...props} />
    ),
};

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    /* Article JSON-LD for SEO */
    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        author: {
            "@type": "Person",
            name: "ael",
            url: "https://saammaaeel.online",
        },
        keywords: post.tags.join(", "),
    };

    return (
        <main className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
            <ScrollProgress />
            {/* Article JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(articleJsonLd),
                }}
            />

            {/* Content with TOC sidebar */}
            <div className="max-w-5xl mx-auto px-6 pb-24 lg:grid lg:grid-cols-[1fr_200px] lg:gap-12">
                <div>
                    {/* Header */}
                    <header className="pt-24 pb-12">
                        <Link
                            href="/blog"
                            className="inline-block mb-8 text-white/30 hover:text-white transition-colors"
                            style={{ fontSize: "var(--text-sm)" }}
                        >
                            ← All Posts
                        </Link>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag) => (
                                <span key={tag} className="tag">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h1
                            className="font-medium text-white mb-4"
                            style={{ fontSize: "var(--text-3xl)" }}
                        >
                            {post.title}
                        </h1>

                        <p className="text-white/40 mb-4" style={{ fontSize: "var(--text-base)" }}>
                            {post.description}
                        </p>

                        <div className="flex items-center gap-4 text-white/30" style={{ fontSize: "var(--text-sm)" }}>
                            <time>
                                {new Date(post.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </time>
                            <span className="text-white/15">·</span>
                            <span>{post.readingTime} min read</span>
                        </div>
                    </header>

                    {/* Article */}
                    <article>
                        <div className="prose prose-invert max-w-none">
                            <MDXRemote
                                source={post.content}
                                components={mdxComponents}
                                options={{
                                    mdxOptions: {
                                        remarkPlugins: [remarkGfm],
                                    },
                                }}
                            />
                        </div>
                    </article>
                </div>

                {/* Sticky TOC */}
                <aside className="hidden lg:block">
                    <TableOfContents headings={post.headings} />
                </aside>
            </div>

            {/* Footer */}
            <footer className="max-w-2xl mx-auto px-6 pb-24">
                <div className="border-t border-white/10 pt-8">
                    <Link
                        href="/blog"
                        className="text-white/40 hover:text-white transition-colors"
                        style={{ fontSize: "var(--text-sm)" }}
                    >
                        ← Back to all posts
                    </Link>
                </div>
            </footer>
        </main>
    );
}
