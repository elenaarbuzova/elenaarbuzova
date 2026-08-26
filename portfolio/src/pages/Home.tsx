import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageEnter } from '@/components/layout/PageTransition';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { WorkSection } from '@/components/sections/WorkSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { useLanguage } from '@/i18n/LanguageContext';

export default function Home() {
  const { contentVisible } = useLanguage();

  return (
    <div className="bg-background text-foreground min-h-screen font-sans selection:bg-foreground selection:text-background">
      <Navbar />

      <PageEnter animateKey="home">
        <motion.div
          initial={false}
          animate={
            contentVisible
              ? { opacity: 1 }
              : { opacity: 0 }
          }
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <main>
            <HeroSection />
            <AboutSection />
            <WorkSection />
            <ContactSection />
          </main>

          <Footer />
        </motion.div>
      </PageEnter>
    </div>
  );
}
