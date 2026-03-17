import { Navbar } from "@/components/layout/Navbar";
import { SectionFlowTracker } from "@/components/motion/SectionFlowTracker";
import { ZoomSlide } from "@/components/motion/ZoomSlide";
import { ContactSection } from "@/components/sections/ContactSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { StackSection } from "@/components/sections/StackSection";

export default function Page() {
  return (
    <main className="bg-transparent text-white selection:bg-indigo-500/35">
      <SectionFlowTracker />
      <Navbar />
      <section data-flow-key="hero" data-flow-section>
        <ZoomSlide isFirst id="hero">
          <HeroSection />
        </ZoomSlide>
      </section>
      <section id="projetos" data-flow-key="projetos" data-flow-section>
        <ZoomSlide id="projetos">
          <ProjectsSection />
        </ZoomSlide>
      </section>
      <section id="stack" data-flow-key="stack" data-flow-section>
        <ZoomSlide id="stack">
          <StackSection />
        </ZoomSlide>
      </section>
      <section id="contato" data-flow-key="contato" data-flow-section>
        <ZoomSlide id="contato">
          <ContactSection />
        </ZoomSlide>
      </section>
    </main>
  );
}
