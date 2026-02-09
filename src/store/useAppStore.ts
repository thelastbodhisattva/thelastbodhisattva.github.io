import { create } from "zustand";

interface MouseState {
    x: number;
    y: number;
    normalizedX: number;
    normalizedY: number;
}

interface AppState {
    // Mouse tracking
    mouse: MouseState;
    setMouse: (x: number, y: number) => void;

    // Scroll tracking
    scrollProgress: number;
    setScrollProgress: (progress: number) => void;

    // WebGL capability
    webglSupported: boolean;
    setWebglSupported: (supported: boolean) => void;

    // Active section for navigation
    activeSection: string;
    setActiveSection: (section: string) => void;

    // Loading state
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    // Mouse state
    mouse: { x: 0, y: 0, normalizedX: 0, normalizedY: 0 },
    setMouse: (x, y) =>
        set({
            mouse: {
                x,
                y,
                normalizedX: (x / window.innerWidth) * 2 - 1,
                normalizedY: -(y / window.innerHeight) * 2 + 1,
            },
        }),

    // Scroll state
    scrollProgress: 0,
    setScrollProgress: (progress) => set({ scrollProgress: progress }),

    // WebGL support
    webglSupported: true,
    setWebglSupported: (supported) => set({ webglSupported: supported }),

    // Active section
    activeSection: "hero",
    setActiveSection: (section) => set({ activeSection: section }),

    // Loading
    isLoading: true,
    setIsLoading: (loading) => set({ isLoading: loading }),
}));
