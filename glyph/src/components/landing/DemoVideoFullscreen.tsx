import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEMO_SRC = '/demo.mp4';

type Props = {
  className?: string;
};

/** Safely start playback — ignore AbortError from interrupted play()/pause() races */
async function safePlay(video: HTMLVideoElement) {
  try {
    await video.play();
    return true;
  } catch (err) {
    const name = err instanceof Error ? err.name : '';
    if (name === 'AbortError' || name === 'NotAllowedError') return false;
    return false;
  }
}

/**
 * Full-viewport product demo — real screen recording of LabAgent.
 */
export function DemoVideoFullscreen({ className }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playGen = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.35);
      },
      { threshold: [0, 0.35, 0.6] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const gen = ++playGen.current;

    if (inView) {
      void (async () => {
        const ok = await safePlay(v);
        if (playGen.current !== gen) return;
        setPlaying(ok && !v.paused);
      })();
    } else {
      v.pause();
      setPlaying(false);
    }
  }, [inView]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
  }, [muted]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void safePlay(v).then((ok) => setPlaying(ok));
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => setMuted((m) => !m);

  return (
    <section
      ref={sectionRef}
      id="demo"
      className={cn(
        'relative z-10 flex h-[100svh] w-full flex-col overflow-hidden bg-[#0c0c0e]',
        className,
      )}
      aria-label="LabAgent product demo"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,77,46,0.12),transparent_55%)]" />

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-28 pt-14 md:px-10">
        <div
          className="relative w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-black shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
          style={{ aspectRatio: '16 / 10' }}
        >
          <video
            ref={videoRef}
            className="h-full w-full object-contain"
            src={DEMO_SRC}
            playsInline
            loop
            muted={muted}
            preload="metadata"
            onTimeUpdate={(e) => {
              const el = e.currentTarget;
              if (!el.duration) return;
              setProgress(el.currentTime / el.duration);
            }}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onClick={togglePlay}
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-8 md:px-10 md:pb-10">
        <div className="mb-4 h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#ff4d2e] transition-[width] duration-150"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
              Product demo
            </p>
            <p className="mt-1.5 max-w-lg font-display text-xl font-semibold tracking-tight text-white md:text-2xl">
              See LabAgent in action
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? (
                <VolumeX className="h-4 w-4" strokeWidth={1.75} />
              ) : (
                <Volume2 className="h-4 w-4" strokeWidth={1.75} />
              )}
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white text-zinc-950 transition-colors hover:bg-zinc-100"
              aria-label={playing ? 'Pause demo' : 'Play demo'}
            >
              {playing ? (
                <Pause className="h-4 w-4 fill-current" strokeWidth={1.75} />
              ) : (
                <Play className="h-4 w-4 fill-current" strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
