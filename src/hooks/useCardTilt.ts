"use client";

import { useRef, useCallback, type MouseEvent as ReactMouseEvent } from "react";

interface UseCardTiltOptions {
    maxTilt?: number;
    perspective?: number;
    glare?: boolean;
}

export function useCardTilt({
    maxTilt = 8,
    perspective = 800,
    glare = true,
}: UseCardTiltOptions = {}) {
    const ref = useRef<HTMLDivElement>(null);

    const onMove = useCallback(
        (e: ReactMouseEvent<HTMLDivElement>) => {
            const el = ref.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const tiltX = (0.5 - y) * maxTilt;
            const tiltY = (x - 0.5) * maxTilt;

            el.style.transform = `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

            if (glare) {
                el.style.setProperty("--glare-x", `${x * 100}%`);
                el.style.setProperty("--glare-y", `${y * 100}%`);
                el.style.setProperty("--glare-opacity", "1");
            }
        },
        [maxTilt, perspective, glare]
    );

    const onLeave = useCallback(() => {
        const el = ref.current;
        if (!el) return;

        el.style.transform = "";
        el.style.transition = "transform 0.4s ease-out";
        el.style.setProperty("--glare-opacity", "0");

        setTimeout(() => {
            if (el) el.style.transition = "";
        }, 400);
    }, []);

    return { ref, onMouseMove: onMove, onMouseLeave: onLeave };
}
