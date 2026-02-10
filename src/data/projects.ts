export interface Project {
    id: string;
    title: string;
    description: string;
    longDescription?: string;
    tech: string[];
    repoUrl?: string;
    demoUrl?: string;
    featured: boolean;
    category: "analytics" | "trading" | "infrastructure" | "research" | "token";
    image?: string;
    archived?: boolean;
}

export const projects: Project[] = [
    {
        id: "calibrasteme",
        title: "Calibrasteme - Market Intelligence Daemon",
        description:
            "Unified crypto trading intelligence: funding rate predictions with ML, options gamma exposure analysis, whale tracking, and solana meme token discovery.",
        longDescription: `A single daemon consolidating multiple market intelligence systems. Features a Funding Rate 
    Predictor using z-scores and ML (capped at ±30% adjustment with auto-fallback when Brier score > 0.25), 
    Options Gamma Exposure calculator scraping Deribit BTC options chain, whale wallet tracking via Alchemy 
    (filtering for $5M+ movements), and automated solana meme tokens discovery scanning DexScreener every 15 minutes.`,
        tech: ["Python", "ML/AI", "Alchemy", "Deribit API", "DexScreener", "Discord"],
        repoUrl: "https://github.com/thelastbodhisattva/calibrasteme",
        demoUrl: "#funding-demo",
        featured: true,
        category: "research",
    },
    {
        id: "whale-wallet-tracker",
        title: "GottaTrackEmAll - Polymarket Whale x Insider Tracker",
        description:
            "Real-time Polymarket whale & insider tracking with 11-factor scoring, Discord/Telegram alerts, leaderboards, and watchlists.",
        longDescription: `Enterprise-grade tracking system monitoring whale trades on Polymarket's CLOB WebSocket feed. 
    Features an 11-factor scoring algorithm analyzing wallet age, trade timing, position sizing, cluster behavior, 
    order flow patterns, and cross-market correlation. Includes Discord/Telegram alerts, a live "Whale Tape" feed, 
    wallet leaderboards with ROI tracking, and custom watchlist management. Smart profile resolution automatically 
    detects Proxy, Kernel, or EOA wallets for accurate trade history linking.`,
        tech: ["TypeScript", "Node.js", "React", "MongoDB", "Redis", "WebSocket", "Docker"],
        repoUrl: "https://github.com/thelastbodhisattva/GottaTrackEmAll",
        demoUrl: "#whale-demo",
        featured: true,
        category: "analytics",
    },
    {
        id: "kryptozgp",
        title: "KryptozGP",
        description:
            "BSC token project with custom tokenomics and community-driven mechanics. Full website and branding.",
        tech: ["BSC", "Web3.js", "React", "Node.js"],
        demoUrl: "https://web.archive.org/web/20241230011147/https://kryptozgp.com/",
        featured: false,
        category: "token",
        archived: true,
    },
    {
        id: "hdrogen",
        title: "HDROGEN",
        description:
            "BSC token with staking mechanics and reward distribution system. Built full frontend and smart contract integration.",
        tech: ["BSC", "Solidity", "Web3.js", "React"],
        demoUrl: "https://web.archive.org/web/20241227115111/https://hdrogen.com/",
        featured: false,
        category: "token",
        archived: true,
    },
    {
        id: "dragonbull",
        title: "DragonBull",
        description:
            "Solana meme token with gamified mechanics. Designed and built the landing page and token launch infrastructure.",
        tech: ["Solana", "TypeScript", "React", "Tailwind"],
        demoUrl: "https://web.archive.org/web/20250316152346/https://dragonbull.xyz/",
        featured: false,
        category: "token",
        archived: true,
    },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const allProjects = projects;
export const archivedProjects = projects.filter((p) => p.archived);
