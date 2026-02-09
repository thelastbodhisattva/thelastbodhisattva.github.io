import Hero from "@/components/Hero";
import ProjectsGrid from "@/components/Projects/ProjectsGrid";
import LiveDemos from "@/components/LiveDemos";
import CaseStudiesSection from "@/components/CaseStudies";
import BlogSection from "@/components/Blog/BlogSection";
import ContactSection from "@/components/Contact/ContactSection";
import FloatingNav from "@/components/FloatingNav";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  return (
    <main className="relative">
      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Floating Navigation */}
      <FloatingNav />

      {/* Hero Section */}
      <Hero />

      {/* Projects Section */}
      <ProjectsGrid />

      {/* Live Demos Section */}
      <LiveDemos />

      {/* Case Studies Section */}
      <CaseStudiesSection />

      {/* Blog/Notes Section */}
      <BlogSection />

      {/* Contact Section */}
      <ContactSection />
    </main>
  );
}
