"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/data/projects";
import { useCardTilt } from "@/hooks/useCardTilt";

/* ═══════════════════════════════════════════
   Props
   ═══════════════════════════════════════════ */

interface ProjectCardProps
    extends Omit<ComponentPropsWithoutRef<"article">, "children"> {
    project: Project;
    index?: number;
}

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
    ({ project, index = 0, className, ...props }, forwardedRef) => {
        const status = project.featured
            ? "featured"
            : project.archived
                ? "archived"
                : "default";

        const { ref: tiltRef, onMouseMove, onMouseLeave } = useCardTilt({
            maxTilt: 6,
            perspective: 900,
        });

        return (
            <div
                ref={(node) => {
                    (tiltRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
                    if (typeof forwardedRef === "function") forwardedRef(node);
                    else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
                }}
                className={cn(
                    "glass-card group relative flex flex-col p-6 sm:p-8 animate-fade-in-up",
                    project.featured && "ring-1 ring-white/10",
                    project.archived && "opacity-80",
                    className
                )}
                role="article"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                {...props}
            >
                {/* Badges */}
                {project.featured && (
                    <Badge variant="featured" className="absolute -top-2 -right-2">
                        Featured
                    </Badge>
                )}
                {project.archived && (
                    <Badge variant="archived" className="absolute -top-2 -left-2">
                        Archived
                    </Badge>
                )}

                <div className="flex-1">
                    {/* Category */}
                    <div className="mb-4">
                        <Badge variant="category">{project.category}</Badge>
                    </div>

                    {/* Title */}
                    <h3
                        className="mb-3 font-medium text-white transition-colors group-hover:text-white/80"
                        style={{ fontSize: "var(--text-xl)" }}
                    >
                        {project.title}
                    </h3>

                    {/* Description */}
                    <p
                        className="mb-6 leading-relaxed text-white/50"
                        style={{ fontSize: "var(--text-sm)" }}
                    >
                        {project.description}
                    </p>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                            <Badge key={tech} variant="default" size="sm" className="font-mono">
                                {tech}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Links */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        {project.repoUrl && (
                            <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-white/40 transition-colors hover:text-white"
                                style={{ fontSize: "var(--text-sm)" }}
                                aria-label={`View ${project.title} source code`}
                            >
                                <svg
                                    className="h-4 w-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                <span>Source</span>
                            </a>
                        )}
                        {project.demoUrl && (
                            <a
                                href={project.demoUrl}
                                className="flex items-center gap-2 text-white/40 transition-colors hover:text-white"
                                style={{ fontSize: "var(--text-sm)" }}
                                aria-label={`View ${project.title} demo`}
                            >
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                                <span>{project.archived ? "Archive" : "Demo"}</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        );
    }
);
ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
