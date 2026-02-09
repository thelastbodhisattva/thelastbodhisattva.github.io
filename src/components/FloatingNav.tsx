"use client";

import { useState, useEffect } from "react";

const navItems = [
    { label: "Projects", href: "#projects" },
    { label: "Demos", href: "#demos" },
    { label: "Case Studies", href: "#case-studies" },
    { label: "Contact", href: "#contact" },
];

export default function FloatingNav() {
    const [isVisible, setIsVisible] = useState(false);
    const [activeSection, setActiveSection] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            // Show nav after scrolling past hero (100vh)
            setIsVisible(window.scrollY > window.innerHeight * 0.5);

            // Determine active section
            const sections = navItems.map(item => item.href.substring(1));
            for (const section of sections.reverse()) {
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

    return (
        <nav
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4 pointer-events-none"
                }`}
            aria-label="Main navigation"
        >
            <div className="glass rounded-full px-2 py-2 flex items-center gap-1">
                {navItems.map((item) => (
                    <a
                        key={item.href}
                        href={item.href}
                        className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${activeSection === item.href.substring(1)
                                ? "bg-white/10 text-white"
                                : "text-white/50 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        {item.label}
                    </a>
                ))}
            </div>
        </nav>
    );
}
