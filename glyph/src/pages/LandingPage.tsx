import { useCallback, useRef, useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Check,
} from 'lucide-react';
import { LandingNav } from '@/components/landing/LandingNav';
import { ReasonsOrbit } from '@/components/landing/ReasonsOrbit';
import { LandingChatWidget } from '@/components/landing/LandingChatWidget';
import { HowItWorksSticky } from '@/components/landing/HowItWorksSticky';
import { FeatureShowcase } from '@/components/landing/FeatureShowcase';
import { ResearchNetwork } from '@/components/landing/ResearchNetwork';
import { DnaBackground } from '@/components/background/DnaBackground';
import { Reveal, Section } from '@/components/ui/Reveal';
import { Logo } from '@/components/ui/Logo';
import { FAQS, PLANS } from '@/lib/data';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    quote:
      'LabAgent replaced our SharePoint scavenger hunts. New hires ask the AI for an SOP and get the exact protocol with page-level citations — usually in under a minute. It feels like institutional memory that never leaves the lab.',
    name: 'Dr. Amira Hassan',
    role: 'Head of Discovery at Helix Bio',
    photo:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    quote:
      'What sold us on LabAgent was the citation quality. It isn’t a generic chatbot — it answers only from our papers, SOPs, and datasets, and every claim links back to a source. Scientists finally trust the AI enough to use it at the bench.',
    name: 'James Okonkwo',
    role: 'VP R&D Operations at Northstar Pharma',
    photo:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    quote:
      'Protocol deviations dropped once LabAgent became the single source of truth. The AI always surfaces the current SOP version, flags critical steps, and cites the document — so people stop improvising from outdated PDFs.',
    name: 'Elena Vogt',
    role: 'Lab Manager at Cascade Genomics',
    photo:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    quote:
      'Onboarding used to take a full quarter of shadowing. With LabAgent, scientists query our corpus on day one — reagents, methods, safety notes — and run safer experiments sooner. The AI compresses years of tribal knowledge into a searchable assistant.',
    name: 'Marcus Chen',
    role: 'Director of Research Ops at Meridian Labs',
    photo:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    quote:
      'Audit prep went from a scramble to a checklist. LabAgent’s answers carry provenance we can hand straight to QA — who asked what, which protocol was cited, and when. It’s the first research AI that feels built for compliance, not demos.',
    name: 'Sofia Alvarez',
    role: 'Quality Lead at Vertex Bio',
    photo:
      'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=200&h=200&q=80',
  },
];

function PillBlack({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <span
        className={cn(
          'inline-flex h-12 items-center justify-center rounded-full bg-black px-6 text-[12px] font-semibold tracking-wide text-white transition-colors hover:bg-zinc-800',
          className,
        )}
      >
        {children}
      </span>
    </Link>
  );
}

function PillOutline({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <span
        className={cn(
          'inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-[12px] font-semibold tracking-wide text-black transition-colors hover:bg-zinc-50',
          className,
        )}
        style={{
          border: '1.5px solid transparent',
          backgroundImage:
            'linear-gradient(#fff, #fff), linear-gradient(105deg, #ff4d2e, #ff8a3d)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        {children}
      </span>
    </Link>
  );
}

export function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [gather, setGather] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reasonsRef = useRef<HTMLDivElement>(null);
  const onGatherChange = useCallback((t: number) => setGather(t), []);

  return (
    <div
      ref={scrollRef}
      className="relative min-h-screen overflow-x-clip bg-white text-black"
    >
      <DnaBackground
        scrollTarget={scrollRef}
        reasonsTarget={reasonsRef}
        theme="light"
        onGatherChange={onGatherChange}
      />
      <LandingNav />
      <LandingChatWidget />
      {/* HERO — Casely split composition */}
      <section className="relative z-10 min-h-[100svh] px-6 pb-16 pt-24 md:pb-20 md:pt-28">
        <div className="relative mx-auto flex min-h-[calc(100svh-7rem)] w-full max-w-6xl flex-col">
          {/* Top-left cluster */}
          <div className="relative z-20 max-w-xl pt-2 md:pt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center rounded-full border border-black/10 bg-white/80 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-black/70 backdrop-blur-sm"
              style={{
                boxShadow: '0 0 24px rgba(255, 77, 46, 0.18)',
              }}
            >
              <span
                className="mr-2 bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #ff4d2e, #ff8a3d)',
                }}
              >
                LAB
              </span>
              Your Future AI{' '}
              <ArrowRight className="ml-1.5 h-3 w-3 text-black/40" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.06 }}
              className="font-display text-[2.5rem] font-bold leading-[1.05] tracking-[-0.045em] text-black md:text-[3.75rem] lg:text-[4.25rem]"
            >
              Turn every research
              <br />
              document into
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="mt-6 max-w-sm text-sm leading-relaxed text-zinc-500 md:text-[15px]"
            >
              LabAgent transforms protocols, publications, and SOPs into a secure research
              assistant — with citations your scientists can trust.
            </motion.p>
          </div>

          {/* Spacer for DNA */}
          <div className="pointer-events-none flex-1" aria-hidden />

          {/* Bottom-right cluster */}
          <div className="relative z-20 ml-auto w-full max-w-md pb-4 text-left md:text-right">
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-display text-[2.5rem] font-bold leading-[1.05] tracking-[-0.045em] text-black md:text-[3.75rem] lg:text-[4.25rem]"
            >
              an AI scientist.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.32 }}
              className="mt-8 flex flex-wrap items-center gap-3 md:justify-end"
            >
              <PillBlack href="/tutorial">START FOR FREE</PillBlack>
              <PillOutline href="/signup">LEARN MORE</PillOutline>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY — stars gather into sphere + hotspot reasons */}
      <div ref={reasonsRef}>
        <ReasonsOrbit gather={gather} />
      </div>

      {/* HOW — Apple-style sticky scroll */}
      <HowItWorksSticky />

      {/* FEATURES — live product previews */}
      <FeatureShowcase />

      {/* TESTIMONIALS */}
      <ResearchNetwork items={testimonials} />

      {/* PRICING — white cards, black type, soft orange glow on Research */}
      <section
        id="pricing"
        className="relative z-10 overflow-hidden bg-white px-6 py-24 md:py-32"
      >
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ff4d2e]">
              Pricing
            </p>
            <h2 className="max-w-xl font-display text-3xl font-bold tracking-tight text-black md:text-5xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-3 max-w-md text-sm text-zinc-500 md:text-base">
              No contracts. No surprise fees.
            </p>
          </Reveal>

          <div className="mt-14 grid items-stretch gap-4 md:mt-16 md:gap-5 lg:grid-cols-3">
            {Object.values(PLANS).map((plan, i) => {
              const isStarter = plan.id === 'starter';
              const isResearch = plan.id === 'research';
              const priceLabel =
                plan.price === null ? 'Custom' : `$${plan.price}`;
              const showPeriod = plan.price !== null;
              const cta = isStarter
                ? 'Current plan'
                : isResearch
                  ? 'Select'
                  : 'Contact sales';

              return (
                <Reveal key={plan.id} delay={i * 0.08} className="h-full">
                  <div
                    className={cn(
                      'relative flex h-full flex-col rounded-2xl bg-white p-6 md:rounded-[1.25rem] md:p-7',
                      isResearch
                        ? 'shadow-[0_0_0_1.5px_rgba(255,77,46,0.45),0_0_32px_rgba(255,77,46,0.18)]'
                        : 'shadow-[0_0_0_1px_rgba(0,0,0,0.08)]',
                    )}
                  >
                    <div>
                      <p className="font-display text-xl font-semibold tracking-tight text-black">
                        {plan.name}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                        {plan.description}
                      </p>
                    </div>

                    <p className="mt-7 font-display text-4xl font-bold tracking-tight text-black md:text-[2.75rem]">
                      {priceLabel}
                      {showPeriod ? (
                        <span className="ml-1 text-base font-medium text-zinc-400">
                          /mo
                        </span>
                      ) : null}
                    </p>

                    <ul className="mt-8 flex-1 space-y-3">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2.5 text-[13px] leading-snug text-zinc-700"
                        >
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-[#ff4d2e]"
                            strokeWidth={2.5}
                          />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link href="/signup" className="mt-8 block">
                      <span
                        className={cn(
                          'inline-flex h-11 w-full items-center justify-center rounded-full text-[13px] font-semibold tracking-wide transition-all duration-300',
                          isResearch
                            ? 'bg-black text-white hover:bg-zinc-800'
                            : 'border border-black/10 bg-white text-black hover:border-black/20 hover:bg-zinc-50',
                        )}
                      >
                        {cta}
                      </span>
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Section id="faq" className="bg-zinc-50/80">
        <Reveal>
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ff4d2e]">
            FAQ
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-black md:text-5xl">
            Straight answers.
          </h2>
        </Reveal>
        <div className="mt-14 max-w-3xl space-y-3">
          {FAQS.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 0.04}>
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                className="w-full rounded-2xl border border-black/[0.06] bg-white px-6 py-5 text-left transition-all duration-300 hover:border-black/10"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-black md:text-base">{faq.q}</span>
                  <span className="text-[#ff4d2e]">{openFaq === i ? '−' : '+'}</span>
                </div>
                <AnimatePresence>
                  {openFaq === i ? (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden text-sm leading-relaxed text-zinc-500"
                    >
                      <span className="mt-3 block pb-1">{faq.a}</span>
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </button>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-white">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-black/[0.06] bg-zinc-50 px-8 py-16 text-center md:px-16 md:py-24">
            <h2 className="font-display text-3xl font-bold tracking-tight text-black md:text-5xl">
              Give your lab a memory
              <br />
              that never leaves.
            </h2>
            <p className="mx-auto mt-6 max-w-md text-zinc-500">
              Start with one protocol library. Ship a research assistant before the next experiment.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <PillBlack href="/signup">START FREE</PillBlack>
              <PillOutline href="/docs">READ THE DOCS</PillOutline>
            </div>
          </div>
        </Reveal>
      </Section>

      <footer className="relative z-10 border-t border-black/[0.06] bg-white px-6 py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 md:flex-row md:justify-between">
          <div>
            <Logo variant="light" />
            <p className="mt-4 max-w-xs text-sm text-zinc-500">
              AI knowledge platform for scientific laboratories, biotech, and R&D teams.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-400">Product</p>
              <div className="mt-4 flex flex-col gap-2.5 text-sm text-zinc-500">
                <a href="#features" className="hover:text-black">
                  Features
                </a>
                <a href="#pricing" className="hover:text-black">
                  Pricing
                </a>
                <Link href="/docs" className="hover:text-black">
                  Docs
                </Link>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-400">Company</p>
              <div className="mt-4 flex flex-col gap-2.5 text-sm text-zinc-500">
                <Link href="/security" className="hover:text-black">
                  Security
                </Link>
                <Link href="/tutorial" className="hover:text-black">
                  Demo
                </Link>
                <Link href="/login" className="hover:text-black">
                  Sign in
                </Link>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-400">Legal</p>
              <div className="mt-4 flex flex-col gap-2.5 text-sm text-zinc-500">
                <span>Privacy</span>
                <span>Terms</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-6xl border-t border-black/[0.06] pt-8 text-xs text-zinc-400">
          © {new Date().getFullYear()} LabAgent.ai — Built for science.
        </div>
      </footer>
    </div>
  );
}
