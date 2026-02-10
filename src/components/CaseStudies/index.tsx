"use client";

import { useInView } from "@/hooks/useInView";
import FundingRateStudy from "./FundingRateStudy";
import WhaleTrackerStudy from "./WhaleTrackerStudy";

export default function CaseStudiesSection() {
    const { ref: headerRef } = useInView();
    const { ref: gridRef } = useInView();

    return (
        <section
            id="case-studies"
            className="section"
            aria-label="Technical case studies"
        >
            <div className="mx-auto max-w-6xl">
                {/* Section header */}
                <header ref={headerRef} data-reveal="" className="mb-16 text-center">
                    <h2
                        className="mb-4 font-medium text-white"
                        style={{ fontSize: 'var(--text-3xl)' }}
                    >
                        Case Studies
                    </h2>
                    <p className="mx-auto max-w-lg text-white/40" style={{ fontSize: 'var(--text-sm)' }}>
                        Technical deep-dives into the architecture and problem-solving approaches.
                    </p>
                </header>

                {/* Case studies grid */}
                <div ref={gridRef} data-reveal="" className="grid gap-6 lg:grid-cols-2">
                    <FundingRateStudy />
                    <WhaleTrackerStudy />
                </div>
            </div>
        </section>
    );
}
