import {
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

type Particle = {
  /** Floating / home scatter */
  fx: number;
  fy: number;
  /** Helix slot target */
  hx: number;
  hy: number;
  hz: number;
  x: number;
  y: number;
  size: number;
  alpha: number;
  phase: number;
  tone: number;
  /** Soft drift in float phase */
  driftAmp: number;
};

type Props = {
  children: ReactNode;
  className?: string;
};

/** Cycle phases (seconds) — total ~22s, seamless */
const T_GATHER = 5.5;
const T_HOLD = 4.2;
const T_DISSOLVE = 5.5;
const T_FLOAT = 6.5;
const CYCLE = T_GATHER + T_HOLD + T_DISSOLVE + T_FLOAT;

const BASE_COUNT = 1400;
const MAX_COUNT = 2200;

function countFor(w: number, h: number) {
  const area = w * h;
  const n = Math.round(BASE_COUNT * (area / (720 * 380)));
  return Math.max(900, Math.min(MAX_COUNT, n));
}

function easeInOut(t: number) {
  return t * t * (3 - 2 * t);
}

function clamp01(t: number) {
  return Math.min(1, Math.max(0, t));
}

/**
 * Abstract DNA helix in local 3D, projected to screen.
 * Two strands + occasional rung particles.
 */
function helixPoint(
  i: number,
  n: number,
  w: number,
  h: number,
  rotY: number,
  breath: number,
) {
  const turns = 2.6;
  const t = i / Math.max(1, n - 1);
  const strand = i % 2;
  // Full-height helix, large radius, anchored far right
  const along = (t - 0.5) * h * 1.05;
  const radius = Math.min(w * 0.32, h * 0.28) * breath;
  const angle = t * Math.PI * 2 * turns + rotY + strand * Math.PI;

  const x3 = Math.cos(angle) * radius;
  const y3 = along;
  const z3 = Math.sin(angle) * radius;

  // Slight tilt so it reads as 3D
  const tilt = -0.22;
  const yt = y3 * Math.cos(tilt) - z3 * Math.sin(tilt);
  const zt = y3 * Math.sin(tilt) + z3 * Math.cos(tilt);

  const perspective = 680;
  const scale = perspective / (perspective + zt + 40);
  const cx = w * 0.92;
  const cy = h * 0.5;

  return {
    x: cx + x3 * scale,
    y: cy + yt * scale,
    z: zt,
    scale,
  };
}

function seedParticles(w: number, h: number, n: number): Particle[] {
  const pts: Particle[] = [];
  for (let i = 0; i < n; i++) {
    // Prefer a soft field around the frame; denser toward mid-vertical band
    const fx = Math.random() * w;
    const fy =
      Math.random() < 0.55
        ? h * (0.08 + Math.random() * 0.84)
        : h * (0.25 + Math.random() * 0.5);
    const hp = helixPoint(i, n, w, h, 0, 1);
    pts.push({
      fx,
      fy,
      hx: hp.x,
      hy: hp.y,
      hz: hp.z,
      x: fx,
      y: fy,
      size: 1.35 + Math.random() * 1.65,
      alpha: 0.055 + Math.random() * 0.08,
      phase: Math.random() * Math.PI * 2,
      tone: Math.random() > 0.82 ? 1 : 0,
      driftAmp: 2 + Math.random() * 5,
    });
  }
  return pts;
}

/**
 * CTA frame — particles continuously organize into an abstract DNA helix,
 * then dissolve. Subtle enough that headline & CTAs stay primary.
 */
export function CtaParticleFrame({ children, className }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const size = useRef({ w: 1, h: 1 });
  const raf = useRef(0);
  const visible = useRef(false);
  const cycleStart = useRef(0);
  const links = useRef<{ a: number; b: number }[]>([]);

  const rebuildHelixTargets = useCallback((rotY: number, breath: number) => {
    const { w, h } = size.current;
    const pts = particles.current;
    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const hp = helixPoint(i, n, w, h, rotY, breath);
      pts[i].hx = hp.x;
      pts[i].hy = hp.y;
      pts[i].hz = hp.z;
    }
  }, []);

  const buildLinks = useCallback(() => {
    // Sparse strand neighbors + occasional rungs (every Nth pair)
    const n = particles.current.length;
    const edges: { a: number; b: number }[] = [];
    const step = Math.max(2, Math.floor(n / 180));
    for (let i = 0; i < n - step * 2; i += step) {
      edges.push({ a: i, b: i + step * 2 }); // same-parity strand approx
      if (i % (step * 4) === 0 && i + 1 < n) {
        edges.push({ a: i, b: i + 1 }); // rung
      }
    }
    links.current = edges;
  }, []);

  const resize = useCallback(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!frame || !canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = frame.getBoundingClientRect();
    size.current = { w: width, h: height };
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (width > 0 && height > 0) {
      const n = countFor(width, height);
      particles.current = seedParticles(width, height, n);
      rebuildHelixTargets(0, 1);
      buildLinks();
    }
  }, [buildLinks, rebuildHelixTargets]);

  useEffect(() => {
    resize();
    const ro = new ResizeObserver(resize);
    if (frameRef.current) ro.observe(frameRef.current);
    window.addEventListener('resize', resize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [resize]);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const on = entry.isIntersecting && entry.intersectionRatio > 0.2;
        if (on && !visible.current) {
          // Enter mid-float so loop has no hard “start”
          cycleStart.current =
            performance.now() - (T_GATHER + T_HOLD + T_DISSOLVE) * 1000;
        }
        visible.current = on;
      },
      { threshold: [0, 0.2, 0.4] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const phaseOf = (sec: number) => {
      const t = ((sec % CYCLE) + CYCLE) % CYCLE;
      if (t < T_GATHER) {
        return { name: 'gather' as const, u: t / T_GATHER, rot: 0 };
      }
      const t1 = t - T_GATHER;
      if (t1 < T_HOLD) {
        return {
          name: 'hold' as const,
          u: t1 / T_HOLD,
          rot: t1 * 0.22,
        };
      }
      const t2 = t1 - T_HOLD;
      if (t2 < T_DISSOLVE) {
        return {
          name: 'dissolve' as const,
          u: t2 / T_DISSOLVE,
          rot: T_HOLD * 0.22 + t2 * 0.12,
        };
      }
      const t3 = t2 - T_DISSOLVE;
      return {
        name: 'float' as const,
        u: t3 / T_FLOAT,
        rot: T_HOLD * 0.22 + T_DISSOLVE * 0.12,
      };
    };

    /** Blend amount toward helix (1) vs float (0) */
    const helixBlend = (name: string, u: number) => {
      if (name === 'gather') return easeInOut(clamp01(u));
      if (name === 'hold') return 1;
      if (name === 'dissolve') return 1 - easeInOut(clamp01(u));
      return 0;
    };

    const tick = (now: number) => {
      if (!visible.current) {
        raf.current = requestAnimationFrame(tick);
        return;
      }

      const { w, h } = size.current;
      ctx.clearRect(0, 0, w, h);

      if (!cycleStart.current) {
        // Begin mid-float so the loop has no hard start
        cycleStart.current =
          now - (T_GATHER + T_HOLD + T_DISSOLVE) * 1000;
      }

      const sec = (now - cycleStart.current) * 0.001;
      const ph = phaseOf(sec);
      const blend = helixBlend(ph.name, ph.u);
      const breath = 1 + Math.sin(sec * 0.35) * 0.018;

      rebuildHelixTargets(ph.rot, breath);

      const pts = particles.current;
      const n = pts.length;

      // Soft strand / rung links while structured
      if (blend > 0.08) {
        const linkA = blend * 0.065;
        ctx.lineWidth = 0.35;
        for (const e of links.current) {
          const a = pts[e.a];
          const b = pts[e.b];
          if (!a || !b) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > 110 * 110 || d2 < 4) continue;
          const depth = Math.min(a.hz, b.hz);
          const depthFade = 0.55 + 0.45 * clamp01((depth + 40) / 80);
          ctx.strokeStyle = `rgba(24, 24, 27, ${linkA * depthFade})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Sparse float-phase whispers
      if (blend < 0.35) {
        const whisper = (1 - blend / 0.35) * 0.022;
        ctx.lineWidth = 0.3;
        const step = Math.max(10, (n / 100) | 0);
        for (let i = 0; i < n; i += step) {
          const a = pts[i];
          const b = pts[Math.min(n - 1, i + step)];
          const d2 = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
          if (d2 > 42 * 42) continue;
          ctx.strokeStyle = `rgba(24, 24, 27, ${whisper})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Batch charcoal then orange to cut style switches
      ctx.fillStyle = 'rgb(24, 24, 27)';
      for (let i = 0; i < n; i++) {
        const p = pts[i];
        const driftX = Math.sin(sec * 0.18 + p.phase) * p.driftAmp;
        const driftY = Math.cos(sec * 0.14 + p.phase * 1.2) * p.driftAmp;
        const fx = p.fx + driftX;
        const fy = p.fy + driftY;

        const tx = fx + (p.hx - fx) * blend;
        const ty = fy + (p.hy - fy) * blend;
        const ease = 0.018 + blend * 0.012;
        p.x += (tx - p.x) * ease;
        p.y += (ty - p.y) * ease;

        if (p.tone > 0.5 && blend > 0.25) continue;

        const depthFade = 0.5 + 0.5 * clamp01((p.hz + 50) / 100);
        const structuredBoost = 0.75 + blend * 0.4;
        const pulse = 0.92 + 0.08 * Math.sin(sec * 0.4 + p.phase);
        ctx.globalAlpha = Math.min(
          0.18,
          p.alpha * structuredBoost * depthFade * pulse,
        );
        const r = p.size * (0.95 + blend * 0.2);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = 'rgb(234, 88, 12)';
      for (let i = 0; i < n; i++) {
        const p = pts[i];
        if (!(p.tone > 0.5 && blend > 0.25)) continue;
        const depthFade = 0.5 + 0.5 * clamp01((p.hz + 50) / 100);
        const pulse = 0.92 + 0.08 * Math.sin(sec * 0.4 + p.phase);
        ctx.globalAlpha = Math.min(0.2, p.alpha * 1.15 * depthFade * pulse * blend);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [rebuildHelixTargets]);

  return (
    <div ref={frameRef} className={cn('relative overflow-hidden', className)}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden
      />
      <div className="relative z-[2]">{children}</div>
    </div>
  );
}
