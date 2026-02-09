import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        // Heading styles
        h1: ({ children }) => (
            <h1 className="text-3xl font-medium text-white mb-6 mt-10 first:mt-0">
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-2xl font-medium text-white mb-4 mt-8">
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-xl font-medium text-white mb-3 mt-6">
                {children}
            </h3>
        ),

        // Paragraph
        p: ({ children }) => (
            <p className="text-white/60 leading-relaxed mb-4">
                {children}
            </p>
        ),

        // Links
        a: ({ href, children }) => (
            <a
                href={href}
                className="text-white/80 underline underline-offset-2 hover:text-white transition-colors"
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
                {children}
            </a>
        ),

        // Lists
        ul: ({ children }) => (
            <ul className="list-disc list-inside text-white/60 mb-4 space-y-2">
                {children}
            </ul>
        ),
        ol: ({ children }) => (
            <ol className="list-decimal list-inside text-white/60 mb-4 space-y-2">
                {children}
            </ol>
        ),
        li: ({ children }) => (
            <li className="text-white/60">
                {children}
            </li>
        ),

        // Code
        code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded bg-white/5 text-white/80 font-mono text-sm">
                {children}
            </code>
        ),
        pre: ({ children }) => (
            <pre className="p-4 rounded-xl bg-white/3 border border-white/5 overflow-x-auto mb-4 font-mono text-sm">
                {children}
            </pre>
        ),

        // Blockquote
        blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-white/20 pl-4 italic text-white/50 mb-4">
                {children}
            </blockquote>
        ),

        // Horizontal rule
        hr: () => (
            <hr className="border-white/10 my-8" />
        ),

        // Strong and emphasis
        strong: ({ children }) => (
            <strong className="font-medium text-white/90">
                {children}
            </strong>
        ),
        em: ({ children }) => (
            <em className="italic text-white/70">
                {children}
            </em>
        ),

        ...components,
    };
}
