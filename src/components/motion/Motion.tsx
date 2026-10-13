import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { useRouterState } from "@tanstack/react-router";
import Lenis from "lenis";
import { cn } from "@/lib/utils";
import {
  ease,
  finePointer,
  getLenis,
  gsap,
  markIntroDone,
  motionEnabled,
  onIntro,
  ScrollTrigger,
  setLenis,
  SplitText,
  useGSAP,
} from "@/lib/motion";

/* ------------------------------------------------------------------ */
/* Smooth scroll: Lenis driven by the GSAP ticker, synced to ScrollTrigger. */
export function SmoothScroll() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    // Hydrated: the boot script's failsafe is no longer needed.
    clearTimeout((window as Window & { __rayFailsafe?: number }).__rayFailsafe);
    if (!motionEnabled()) return;
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, anchors: { offset: -80 } });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      getLenis()?.resize();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}

/* ------------------------------------------------------------------ */
/* First-visit preloader: a filament warms up, then the curtain lifts. */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = document.documentElement;
      const el = ref.current;
      if (!el || !root.classList.contains("intro")) {
        markIntroDone();
        return;
      }
      const num = el.querySelector(".pl-num");
      const count = { v: 0 };
      getLenis()?.stop();
      gsap
        .timeline({
          onComplete() {
            root.classList.remove("intro");
            try {
              sessionStorage.setItem("ray-intro", "1");
            } catch {
              /* storage unavailable: the intro simply plays again next visit */
            }
          },
        })
        .to(count, {
          v: 100,
          duration: 1.7,
          ease: "power3.inOut",
          onUpdate: () => {
            if (num) num.textContent = String(Math.round(count.v)).padStart(3, "0");
          },
        })
        .to(".pl-bar", { scaleX: 1, duration: 1.7, ease: "power3.inOut" }, 0)
        .from(".pl-word", { yPercent: 115, duration: 1.1, ease: ease.out, stagger: 0.08 }, 0.15)
        .to(".pl-word", { yPercent: -115, duration: 0.7, ease: "expo.in", stagger: 0.04 }, 1.7)
        .to(
          ".pl-bar",
          { scaleX: 0, transformOrigin: "right center", duration: 0.6, ease: "expo.in" },
          1.75,
        )
        .add(() => {
          getLenis()?.start();
          markIntroDone();
        }, 2.15)
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.15, ease: ease.inOut }, 2.05)
        .set(el, { display: "none" });
    },
    { scope: ref },
  );

  return (
    <div className="preloader" ref={ref} aria-hidden="true">
      <div className="pl-word-row">
        <span className="pl-mask">
          <span className="pl-word">Ray</span>
        </span>
        <span className="pl-mask">
          <span className="pl-word">
            <em>Electrical</em>
          </span>
        </span>
      </div>
      <div className="pl-bar" />
      <div className="pl-meta label">
        <span className="pl-num">000</span>
        <span>Fourways · Sandton</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Masked text reveal. Splits into lines/words/chars and slides them up.
 * `load` plays it once the intro is done (for above-the-fold headings),
 * otherwise it plays when scrolled into view. */
type RevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  type?: "lines" | "words" | "chars";
  delay?: number;
  stagger?: number;
  duration?: number;
  start?: string;
  load?: boolean;
  id?: string;
  style?: CSSProperties;
};

export function Reveal({
  as: Tag = "div",
  children,
  className,
  type = "lines",
  delay = 0,
  stagger,
  duration = 1.35,
  start = "top 88%",
  load = false,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !motionEnabled()) return;
      let ready = !load;
      let current: gsap.core.Tween | null = null;
      const off = load
        ? onIntro(() => {
            ready = true;
            current?.play();
          })
        : undefined;

      // innerText keeps the space that a <br /> implies, unlike SplitText's own label.
      let done = false;
      const label = el.innerText.replace(/\s+/g, " ").trim();
      SplitText.create(el, {
        type: type === "chars" ? "chars,words,lines" : type === "words" ? "words,lines" : "lines",
        mask: type,
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        autoSplit: true,
        onSplit(self) {
          const targets =
            type === "chars" ? self.chars : type === "words" ? self.words : self.lines;
          el.setAttribute("aria-label", label);
          // Masks clip only while text is moving; afterwards glows and descenders breathe.
          gsap.set(self.masks, { overflow: done ? "visible" : "clip" });
          current = gsap.from(targets, {
            onComplete: () => {
              done = true;
              gsap.set(self.masks, { overflow: "visible" });
            },
            yPercent: type === "chars" ? 100 : 118,
            rotate: type === "lines" ? 2.5 : 0,
            transformOrigin: "0% 0%",
            duration,
            ease: ease.out,
            delay,
            stagger: stagger ?? (type === "lines" ? 0.1 : type === "words" ? 0.035 : 0.022),
            paused: !ready,
            ...(load ? {} : { scrollTrigger: { trigger: el, start, once: true } }),
          });
          return current;
        },
      });
      gsap.set(el, { visibility: "visible" });
      return () => off?.();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} data-reveal="" {...rest}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Words light up one by one as the paragraph scrolls through the viewport. */
export function ScrubText({
  as: Tag = "p",
  children,
  className,
  start = "top 82%",
  end = "bottom 55%",
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  start?: string;
  end?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !motionEnabled()) return;
      SplitText.create(el, {
        type: "words",
        wordsClass: "scrub-word",
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.words,
            { opacity: 0.14 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.12,
              scrollTrigger: { trigger: el, start, end, scrub: 0.6 },
            },
          );
        },
      });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Image that wipes open from below, with an inner scale settle and parallax. */
export function RevealImage({
  src,
  alt,
  width,
  height,
  className,
  style,
  parallax = 7,
  delay = 0,
  load = false,
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: CSSProperties;
  parallax?: number;
  delay?: number;
  load?: boolean;
  priority?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      const img = el?.querySelector("img");
      if (!el || !img || !motionEnabled()) return;
      const tl = gsap.timeline({
        paused: load,
        delay,
        ...(load ? {} : { scrollTrigger: { trigger: el, start: "top 88%", once: true } }),
      });
      tl.fromTo(
        el,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: ease.inOut },
      ).from(img, { scale: 1.45, duration: 2.2, ease: ease.out }, 0);
      const off = load ? onIntro(() => tl.play()) : undefined;
      if (parallax) {
        gsap.fromTo(
          img,
          { yPercent: -parallax },
          {
            yPercent: parallax,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      }
      return () => off?.();
    },
    { scope: ref },
  );
  return (
    <figure
      ref={ref}
      className={cn("reveal-img", className)}
      style={{ aspectRatio: `${width} / ${height}`, ...style }}
      data-reveal-img=""
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Vertical drift relative to scroll. `speed` is a fraction of the viewport height. */
export function Parallax({
  children,
  speed = 0.15,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!ref.current || !motionEnabled()) return;
      gsap.fromTo(
        ref.current,
        { y: () => window.innerHeight * speed * 0.5 },
        {
          y: () => -window.innerHeight * speed * 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pulls its child toward the pointer. Fine pointers only. */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || !motionEnabled()) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.45)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.45)" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);
  return (
    <div ref={ref} className={cn("inline-block", className)}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Endless marquee whose speed and direction follow the scroll. */
export function Marquee({
  children,
  speed = 2.2,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      const track = el?.querySelector<HTMLElement>(".marquee-track");
      if (!el || !track || !motionEnabled()) return;
      const wrap = gsap.utils.wrap(-50, 0);
      const setX = gsap.quickSetter(track, "xPercent");
      let x = 0;
      let dir = -1;
      let boost = 0;
      const tick = (_time: number, dt: number) => {
        x = wrap(x + dir * (speed + boost) * (dt / 1000));
        setX(x);
        boost *= 0.93;
      };
      gsap.ticker.add(tick);
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          dir = self.direction === 1 ? -1 : 1;
          boost = Math.min(Math.abs(self.getVelocity()) / 140, 22);
        },
      });
      return () => gsap.ticker.remove(tick);
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={cn("marquee", className)}>
      <div className="marquee-track">
        <div>{children}</div>
        <div aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Draws the .schem-draw strokes of a child SVG schematic. */
export function Draw({
  children,
  className,
  start = "top 78%",
  scrub = false,
  containerAnimation,
  duration = 2.4,
}: {
  children: ReactNode;
  className?: string;
  start?: string;
  scrub?: boolean;
  containerAnimation?: gsap.core.Animation | null;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !motionEnabled()) return;
      const strokes = el.querySelectorAll(".schem-draw");
      const dims = el.querySelectorAll(".schem-dim");
      const dots = el.querySelectorAll(".schem-dot");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start,
          scrub: scrub ? 0.8 : false,
          once: !scrub,
          ...(scrub ? { end: "bottom 35%" } : {}),
          ...(containerAnimation ? { containerAnimation } : {}),
        },
      });
      if (!strokes.length) return;
      tl.fromTo(
        strokes,
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration,
          ease: "power2.inOut",
          stagger: { amount: duration * 0.7 },
        },
      );
      if (dims.length)
        tl.fromTo(
          dims,
          { opacity: 0 },
          { opacity: 1, duration: duration * 0.4, ease: "none" },
          duration * 0.25,
        );
      if (dots.length)
        tl.fromTo(
          dots,
          { scale: 0, transformOrigin: "50% 50%" },
          { scale: 1, duration: 0.5, ease: "back.out(3)", stagger: { amount: duration * 0.3 } },
          duration * 0.5,
        );
    },
    { scope: ref, dependencies: [containerAnimation], revertOnUpdate: true },
  );
  return (
    <div ref={ref} className={cn("draw", className)}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* A soft filament glow that follows the pointer across a section. */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer()) return;
    const pos = { x: 50, y: 50 };
    const paint = () => {
      el.style.setProperty("--mx", `${pos.x}%`);
      el.style.setProperty("--my", `${pos.y}%`);
    };
    const xTo = gsap.quickTo(pos, "x", { duration: 1.1, ease: ease.soft, onUpdate: paint });
    const yTo = gsap.quickTo(pos, "y", { duration: 1.1, ease: ease.soft, onUpdate: paint });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo(((e.clientX - r.left) / r.width) * 100);
      yTo(((e.clientY - r.top) / r.height) * 100);
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, []);
  return ref;
}

/* ------------------------------------------------------------------ */
/* Text that rolls to a duplicate on hover. */
export function RollText({ children }: { children: string }) {
  return (
    <span className="roll">
      <span className="roll-a">{children}</span>
      <span className="roll-b" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

/* Tracks whether the page has scrolled and which way, for the header. */
export function useScrollState(threshold = 40) {
  const [state, setState] = useState({ scrolled: false, hidden: false });
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - last;
      last = y;
      setState((prev) => {
        const scrolled = y > threshold;
        const hidden = Math.abs(delta) < 2 ? prev.hidden : delta > 0 && y > 160;
        return prev.scrolled === scrolled && prev.hidden === hidden ? prev : { scrolled, hidden };
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold]);
  return state;
}
