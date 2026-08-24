import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { WorkSection } from '@/components/sections/WorkSection';
import { ToolsSection } from '@/components/sections/ToolsSection';
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
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 10 }
        }
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <main>
          <HeroSection />
          <AboutSection />
          <WorkSection />
          <ToolsSection />
          <ContactSection />
        </main>

        <Footer />
      </motion.div>
    </div>
  );
}
