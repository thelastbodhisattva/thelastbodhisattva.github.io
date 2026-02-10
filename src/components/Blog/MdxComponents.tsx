"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
    getText: () => string;
}

export function CopyButton({ getText }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const handleCopy = useCallback(() => {
        const text = getText();
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setCopied(false), 2000);
        });
    }, [getText]);

    return (
        <button
            onClick={handleCopy}
            className="absolute top-3 right-3 rounded-md px-2 py-1 text-white/30 hover:text-white/60 transition-colors"
            style={{
                fontSize: "var(--text-xs)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
            }}
            aria-label="Copy code"
        >
            {copied ? "Copied!" : "Copy"}
        </button>
    );
}

/* MDX components override for code blocks with copy button */
interface PreProps extends React.HTMLAttributes<HTMLPreElement> {
    children?: React.ReactNode;
}

export function Pre({ children, className, ...props }: PreProps) {
    const ref = useRef<HTMLPreElement>(null);

    const getText = useCallback(() => {
        return ref.current?.textContent || "";
    }, []);

    return (
        <div className="relative group">
            <pre ref={ref} {...props} className={cn("relative", className)}>
                {children}
            </pre>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton getText={getText} />
            </div>
        </div>
    );
}

/* Table of Contents component */
interface TOCItem {
    text: string;
    level: number;
    id: string;
}

interface TableOfContentsProps {
    headings: TOCItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
    if (headings.length === 0) return null;

    return (
        <nav
            className="hidden lg:block sticky top-24"
            aria-label="Table of Contents"
        >
            <p
                className="font-medium text-white/50 uppercase tracking-wider mb-4"
                style={{ fontSize: "var(--text-xs)" }}
            >
                On this page
            </p>
            <ul className="space-y-2 border-l border-white/10">
                {headings.map((heading) => (
                    <li
                        key={heading.id}
                        style={{
                            paddingLeft: `${(heading.level - 1) * 12 + 12}px`,
                        }}
                    >
                        <a
                            href={`#${heading.id}`}
                            className="block text-white/30 hover:text-white/70 transition-colors leading-snug py-1"
                            style={{ fontSize: "var(--text-xs)" }}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
