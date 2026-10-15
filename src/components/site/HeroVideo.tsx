import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/*
 * Full-bleed looping video behind the hero.
 *
 * Drop real footage at public/videos/hero.mp4 (+ hero.webm) and it is picked up
 * with no code change; see public/videos/README.md for the encode settings.
 *
 * Behaviour: stays on the poster frame for visitors who prefer reduced motion
 * or have Data Saver on, pauses when scrolled out of view to save battery, and
 * always offers a pause control (WCAG 2.2.2).
 */
export function HeroVideo({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [allowed, setAllowed] = useState(false);
  // True once the visitor has paused by hand, so scrolling back does not restart it.
  const userPaused = useRef(false);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData;
    if (reduced || saveData) return;
    setAllowed(true);
    el.muted = true;
    el.preload = "auto";
    el.play().catch(() => {
      /* Autoplay can be blocked (e.g. iOS Low Power Mode): the poster frame stays. */
    });
  }, []);

  useEffect(() => {
    const el = video.current;
    const section = sectionRef.current;
    if (!el || !section || !allowed) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          if (!userPaused.current) el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, [allowed, sectionRef]);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) {
      userPaused.current = false;
      el.play().catch(() => {});
    } else {
      userPaused.current = true;
      el.pause();
    }
  };

  return (
    <>
      <div className="hero-video" aria-hidden="true">
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="hero-video-shade" aria-hidden="true" />
      {allowed && (
        <button
          type="button"
          className="hero-video-toggle label"
          onClick={toggle}
          aria-pressed={!playing}
        >
          {playing ? <Pause /> : <Play />}
          <span>{playing ? "Pause video" : "Play video"}</span>
        </button>
      )}
    </>
  );
}
