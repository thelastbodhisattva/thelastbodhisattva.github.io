"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseMagneticOptions {
    strength?: number;
    radius?: number;
}

export function useMagnetic<T extends HTMLElement>({
    strength = 0.3,
    radius = 40,
}: UseMagneticOptions = {}) {
    const ref = useRef<T>(null);

    const handleMove = useCallback(
        (e: MouseEvent) => {
            const el = ref.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < radius + rect.width / 2) {
                const pull = Math.max(0, 1 - dist / (radius + rect.width / 2));
                el.style.transform = `translate(${dx * strength * pull}px, ${dy * strength * pull}px)`;
            } else {
                el.style.transform = "";
            }
        },
        [strength, radius]
    );

    const handleLeave = useCallback(() => {
        if (ref.current) {
            ref.current.style.transform = "";
            ref.current.style.transition = "transform 0.3s ease-out";
            leaveTimeout.current = setTimeout(() => {
                if (ref.current) ref.current.style.transition = "";
            }, 300);
        }
    }, []);

    const leaveTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        window.addEventListener("mousemove", handleMove);
        const el = ref.current;
        el?.addEventListener("mouseleave", handleLeave);

        return () => {
            window.removeEventListener("mousemove", handleMove);
            el?.removeEventListener("mouseleave", handleLeave);
            if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
        };
    }, [handleMove, handleLeave]);

    return ref;
}
