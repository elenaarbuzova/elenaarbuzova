import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { WorkSection } from '@/components/sections/WorkSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { PhilosophySection } from '@/components/sections/PhilosophySection';
import { WhySection } from '@/components/sections/WhySection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Home() {
  const { contentVisible } = useLanguage();

  return (
    <div className="bg-background text-foreground min-h-screen font-sans selection:bg-foreground selection:text-background">
      <Navbar />

      <motion.div
        initial={false}
        animate={
          contentVisible
            ? { opacity: 1, y: 0, filter: 'blur(0px)' }
            : { opacity: 0, y: 10, filter: 'blur(1px)' }
        }
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <main>
          <HeroSection />
          <AboutSection />
          <WorkSection />
          <ProcessSection />
          <SkillsSection />
          <PhilosophySection />
          <WhySection />
          <TestimonialsSection />
          <ContactSection />
        </main>

        <Footer />
      </motion.div>
    </div>
  );
}
