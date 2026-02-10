"use client";

import { forwardRef, useState, useEffect, type ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════
   Nav Item CVA
   ═══════════════════════════════════════════ */

const navItemVariants = cva(
    "px-4 py-2 rounded-full transition-all duration-200",
    {
        variants: {
            state: {
                active: "bg-white/10 text-white",
                inactive: "text-white/50 hover:text-white hover:bg-white/5",
            },
        },
        defaultVariants: {
            state: "inactive",
        },
    }
);

/* ═══════════════════════════════════════════
   Nav Items Config
   ═══════════════════════════════════════════ */

const navItems = [
    { label: "Projects", href: "#projects" },
    { label: "Demos", href: "#demos" },
    { label: "Case Studies", href: "#case-studies" },
    { label: "Notes", href: "#blog" },
    { label: "Contact", href: "#contact" },
];

/* ═══════════════════════════════════════════
   NavItem Sub-component
   ═══════════════════════════════════════════ */

interface NavItemProps
    extends ComponentPropsWithoutRef<"a">,
    VariantProps<typeof navItemVariants> { }

const NavItem = forwardRef<HTMLAnchorElement, NavItemProps>(
    ({ className, state, ...props }, ref) => (
        <a
            ref={ref}
            className={cn(navItemVariants({ state }), className)}
            style={{ fontSize: "var(--text-sm)" }}
            {...props}
        />
    )
);
NavItem.displayName = "NavItem";

/* ═══════════════════════════════════════════
   FloatingNav
   ═══════════════════════════════════════════ */

const FloatingNav = forwardRef<HTMLElement, ComponentPropsWithoutRef<"nav">>(
    ({ className, ...props }, ref) => {
        const [isVisible, setIsVisible] = useState(false);
        const [activeSection, setActiveSection] = useState("");
        const [mobileOpen, setMobileOpen] = useState(false);

        useEffect(() => {
            const handleScroll = () => {
                setIsVisible(window.scrollY > window.innerHeight * 0.5);

                const sections = navItems.map((item) => item.href.substring(1));
                for (const section of [...sections].reverse()) {
                    const element = document.getElementById(section);
                    if (element) {
                        const rect = element.getBoundingClientRect();
                        if (rect.top <= window.innerHeight * 0.4) {
                            setActiveSection(section);
                            break;
                        }
                    }
                }
            };

            window.addEventListener("scroll", handleScroll, { passive: true });
            return () => window.removeEventListener("scroll", handleScroll);
        }, []);

        // Close mobile menu on resize to desktop
        useEffect(() => {
            const mq = window.matchMedia("(min-width: 640px)");
            const handler = () => { if (mq.matches) setMobileOpen(false); };
            mq.addEventListener("change", handler);
            return () => mq.removeEventListener("change", handler);
        }, []);

        const glassStyle = {
            background: "rgba(10, 10, 10, 0.7)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
        };

        return (
            <nav
                ref={ref}
                className={cn(
                    "fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500",
                    isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-4 pointer-events-none",
                    className
                )}
                aria-label="Main navigation"
                {...props}
            >
                {/* ── Desktop: horizontal pill bar ── */}
                <div
                    className="hidden sm:flex rounded-full px-2 py-2 items-center gap-1"
                    style={glassStyle}
                >
                    {navItems.map((item) => (
                        <NavItem
                            key={item.href}
                            href={item.href}
                            state={
                                activeSection === item.href.substring(1)
                                    ? "active"
                                    : "inactive"
                            }
                        >
                            {item.label}
                        </NavItem>
                    ))}
                </div>

                {/* ── Mobile: hamburger + dropdown ── */}
                <div className="sm:hidden relative">
                    <button
                        onClick={() => setMobileOpen((v) => !v)}
                        className="rounded-full p-3 flex items-center justify-center"
                        style={glassStyle}
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-nav-menu"
                        aria-label="Toggle navigation"
                    >
                        <svg
                            className="w-5 h-5 text-white/70"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            {mobileOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            )}
                        </svg>
                    </button>

                    {mobileOpen && (
                        <div
                            id="mobile-nav-menu"
                            className="absolute top-full right-0 mt-2 rounded-2xl py-2 px-1 min-w-[180px] flex flex-col gap-1 animate-fade-in"
                            style={glassStyle}
                        >
                            {navItems.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        "px-4 py-2.5 rounded-xl transition-all duration-200",
                                        activeSection === item.href.substring(1)
                                            ? "bg-white/10 text-white"
                                            : "text-white/50 hover:text-white hover:bg-white/5"
                                    )}
                                    style={{ fontSize: "var(--text-sm)" }}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </nav>
        );
    }
);
FloatingNav.displayName = "FloatingNav";

export default FloatingNav;
export { NavItem, navItemVariants };
