"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function CustomCursor() {
    const [isFinePointer, setIsFinePointer] = useState(false);
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const mouse = useRef({ x: 0, y: 0 });
    const ring = useRef({ x: 0, y: 0 });
    const raf = useRef<number>(0);
    const isVisible = useRef(false);
    const hasMounted = useRef(false);

    // Detect fine pointer on mount
    useEffect(() => {
        setIsFinePointer(window.matchMedia("(pointer: fine)").matches);
    }, []);

    // Show/hide the cursor elements
    const setVisible = useCallback((v: boolean) => {
        isVisible.current = v;
        if (dotRef.current) dotRef.current.style.opacity = v ? "1" : "0";
        if (ringRef.current) ringRef.current.style.opacity = v ? "1" : "0";
    }, []);

    useEffect(() => {
        // Only show on devices with fine pointer (no touch)
        const hasPointer = window.matchMedia("(pointer: fine)").matches;
        if (!hasPointer) return;

        hasMounted.current = true;

        const onMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
            if (!isVisible.current) setVisible(true);

            // Dot follows instantly
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            }
        };

        const onLeave = () => setVisible(false);
        const onEnter = () => setVisible(true);

        // Ring follows with lerp
        const animate = () => {
            ring.current.x += (mouse.current.x - ring.current.x) * 0.15;
            ring.current.y += (mouse.current.y - ring.current.y) * 0.15;

            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
            }

            raf.current = requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", onMove);
        document.addEventListener("mouseleave", onLeave);
        document.addEventListener("mouseenter", onEnter);
        raf.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseleave", onLeave);
            document.removeEventListener("mouseenter", onEnter);
            cancelAnimationFrame(raf.current);
        };
    }, [setVisible]);

    // Detect interactive elements for ring expansion
    useEffect(() => {
        const onOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive =
                target.closest("a, button, [role='button'], input, textarea, select, label");
            if (ringRef.current) {
                const size = isInteractive ? "48px" : "32px";
                const margin = isInteractive ? "-24px" : "-16px";
                ringRef.current.style.width = size;
                ringRef.current.style.height = size;
                ringRef.current.style.marginLeft = margin;
                ringRef.current.style.marginTop = margin;
                ringRef.current.style.borderColor = isInteractive
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(255,255,255,0.15)";
            }
        };
        document.addEventListener("mouseover", onOver);
        return () => document.removeEventListener("mouseover", onOver);
    }, []);

    // Don't render anything on touch devices
    if (!isFinePointer) return null;

    return (
        <>
            {/* Dot — pixel-precise */}
            <div
                ref={dotRef}
                className="pointer-events-none fixed top-0 left-0 z-[9999]"
                style={{
                    width: "6px",
                    height: "6px",
                    marginLeft: "-3px",
                    marginTop: "-3px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.8)",
                    willChange: "transform",
                    opacity: 0,
                }}
            />
            {/* Ring — trails with lerp */}
            <div
                ref={ringRef}
                className="pointer-events-none fixed top-0 left-0 z-[9998]"
                style={{
                    width: "32px",
                    height: "32px",
                    marginLeft: "-16px",
                    marginTop: "-16px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.15)",
                    transition: "width 0.2s, height 0.2s, border-color 0.2s, margin 0.2s",
                    willChange: "transform",
                    opacity: 0,
                }}
            />
            {/* Hide default cursor */}
            <style jsx global>{`
                @media (pointer: fine) {
                    * { cursor: none !important; }
                }
            `}</style>
        </>
    );
}
