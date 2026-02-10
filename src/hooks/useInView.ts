"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
    threshold?: number;
    rootMargin?: string;
    once?: boolean;
}

export function useInView({
    threshold = 0.15,
    rootMargin = "0px 0px -60px 0px",
    once = true,
}: UseInViewOptions = {}) {
    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Respect reduced motion preference
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            setIsInView(true);
            el.setAttribute("data-reveal", "visible");
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    el.setAttribute("data-reveal", "visible");
                    if (once) observer.unobserve(el);
                } else if (!once) {
                    setIsInView(false);
                    el.setAttribute("data-reveal", "");
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, rootMargin, once]);

    return { ref, isInView };
}
