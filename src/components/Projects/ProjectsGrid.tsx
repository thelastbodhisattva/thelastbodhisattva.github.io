"use client";

import { useState, useMemo } from "react";
import { useInView } from "@/hooks/useInView";
import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";

/* Extract unique categories and tech from projects */
type Category = "all" | "analytics" | "trading" | "infrastructure" | "research" | "token";

const categories: { label: string; value: Category }[] = [
    { label: "All", value: "all" },
    { label: "Analytics", value: "analytics" },
    { label: "Trading", value: "trading" },
    { label: "Infra", value: "infrastructure" },
    { label: "Research", value: "research" },
    { label: "Token", value: "token" },
];

interface ProjectsGridProps {
    showFeaturedOnly?: boolean;
}

export default function ProjectsGrid({
    showFeaturedOnly = false,
}: ProjectsGridProps) {
    const [activeCategory, setActiveCategory] = useState<Category>("all");
    const { ref: headerRef } = useInView();

    const displayProjects = useMemo(() => {
        let filtered = showFeaturedOnly
            ? projects.filter((p) => p.featured)
            : projects;

        if (activeCategory !== "all") {
            filtered = filtered.filter((p) => p.category === activeCategory);
        }

        return filtered;
    }, [showFeaturedOnly, activeCategory]);

    return (
        <section
            id="projects"
            className="section"
            aria-label="Projects section"
        >
            <div className="mx-auto max-w-5xl">
                {/* Section header */}
                <header ref={headerRef} data-reveal="" className="mb-16 text-center">
                    <h2
                        className="mb-4 font-medium text-[var(--text-primary)]"
                        style={{ fontSize: 'var(--text-3xl)' }}
                    >
                        Projects
                    </h2>
                    <p className="mx-auto max-w-lg text-[var(--text-secondary)]" style={{ fontSize: 'var(--text-sm)' }}>
                        Blockchain infrastructure, on-chain analytics, and DeFi systems.
                    </p>
                </header>

                {/* Filter chips */}
                {!showFeaturedOnly && (
                    <div className="flex flex-wrap justify-center gap-2 mb-12">
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => setActiveCategory(cat.value)}
                                className="rounded-full px-4 py-1.5 transition-all duration-200"
                                style={{
                                    fontSize: "var(--text-xs)",
                                    background:
                                        activeCategory === cat.value
                                            ? "rgba(255,255,255,0.1)"
                                            : "transparent",
                                    border: `1px solid ${activeCategory === cat.value
                                        ? "rgba(255,255,255,0.15)"
                                        : "rgba(255,255,255,0.06)"
                                        }`,
                                    color:
                                        activeCategory === cat.value
                                            ? "rgba(255,255,255,0.8)"
                                            : "rgba(255,255,255,0.35)",
                                }}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Projects grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {displayProjects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>

                {/* Empty state */}
                {displayProjects.length === 0 && (
                    <p className="text-center text-white/30 mt-12" style={{ fontSize: "var(--text-sm)" }}>
                        No projects in this category.
                    </p>
                )}
            </div>
        </section>
    );
}
