"use client";

import FundingRateStudy from "./FundingRateStudy";
import WhaleTrackerStudy from "./WhaleTrackerStudy";

export default function CaseStudiesSection() {
    return (
        <section
            id="case-studies"
            className="section"
            aria-label="Technical case studies"
        >
            <div className="mx-auto max-w-6xl">
                {/* Section header */}
                <header className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-medium text-white sm:text-4xl">
                        Case Studies
                    </h2>
                    <p className="mx-auto max-w-lg text-white/40 text-sm">
                        Technical deep-dives into the architecture and problem-solving approaches.
                    </p>
                </header>

                {/* Case studies grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <FundingRateStudy />
                    <WhaleTrackerStudy />
                </div>
            </div>
        </section>
    );
}
