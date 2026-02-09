"use client";

import { projects, featuredProjects } from "@/data/projects";
import ProjectCard from "./ProjectCard";

interface ProjectsGridProps {
    showFeaturedOnly?: boolean;
}

export default function ProjectsGrid({
    showFeaturedOnly = false,
}: ProjectsGridProps) {
    const displayProjects = showFeaturedOnly ? featuredProjects : projects;

    return (
        <section
            id="projects"
            className="section"
            aria-label="Projects section"
        >
            <div className="mx-auto max-w-5xl">
                {/* Section header */}
                <header className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-medium text-white sm:text-4xl">
                        Projects
                    </h2>
                    <p className="mx-auto max-w-lg text-white/40 text-sm">
                        Blockchain infrastructure, on-chain analytics, and DeFi systems.
                    </p>
                </header>

                {/* Projects grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {displayProjects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
