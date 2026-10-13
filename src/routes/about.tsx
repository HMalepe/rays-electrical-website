import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { ease, gsap, motionEnabled, onIntro, useGSAP } from "@/lib/motion";
import { Draw, Reveal, ScrubText } from "@/components/motion/Motion";
import { ClosingCta } from "@/components/site/SiteShell";
import { SchematicMark } from "@/components/site/Schematics";
import { facts, pageHead, principles, site } from "@/data/site";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead(
      "About Ray",
      "Meet Ray Electrical, your local electrician serving homes and businesses in Fourways and Sandton with a personal, practical approach.",
    ),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main>
      <Hero />
      <Story />
      <Principles />
      <Area />
      <ClosingCta
        title={
          <>
            Your home,
            <br />
            in <em>safe hands.</em>
          </>
        }
        lede="Tell Ray what needs attention. A quick call or a WhatsApp message is all it takes to start."
      />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* No photograph of Ray, by design: the mark draws itself, huge, as a portrait in line. */
function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionEnabled()) return;
      const intro = gsap
        .timeline({ paused: true })
        .fromTo(
          ".about-mark .schem-draw",
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 3.4, ease: "power2.inOut", stagger: 0.6 },
          0,
        )
        .fromTo(
          ".about-mark-guides",
          { opacity: 0 },
          { opacity: 1, duration: 2, ease: "none" },
          0.4,
        )
        .fromTo(
          "[data-fade]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1.4, stagger: 0.07, ease: ease.out },
          0.35,
        );
      const off = onIntro(() => intro.play());

      gsap.to(".about-mark", {
        yPercent: 14,
        rotate: 6,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
      return off;
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="page-hero s-ink about-hero">
      <div className="about-mark draw" aria-hidden="true">
        <svg className="about-mark-guides" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30.5" />
          <circle cx="32" cy="32" r="21" />
          <path d="M-8 32 H72 M32 -8 V72" />
        </svg>
        <SchematicMark />
      </div>

      <div className="wrap about-hero-inner">
        <div className="page-hero-meta label">
          <span className="label-dot" data-fade="">
            The handyman you can count on
          </span>
          <span data-fade="" className="about-hero-meta-mid">
            About Ray
          </span>
          <span data-fade="">Fourways &amp; Sandton</span>
        </div>
        <Reveal as="h1" load>
          A real person.
          <br />
          <em>Real care.</em>
        </Reveal>
        <div className="page-hero-foot">
          <span className="label about-hero-coords" data-fade="">
            {site.coordinates}
          </span>
          <p className="lead" data-fade="">
            Your local electrician in Fourways and Sandton. Straightforward service, from the first
            conversation to the final connection.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The story, set beside a "portrait" drawn as a technical sheet. */
function Story() {
  const sheet = [
    { term: "Name", value: site.name },
    { term: "Based in", value: site.address[0] },
    { term: "Work", value: facts[0] },
    { term: "Estimates", value: facts[1] },
    { term: "Supply", value: facts[2] },
    { term: "Scale", value: facts[3] },
  ];

  return (
    <section className="about-story s-bone">
      <div className="wrap about-story-head">
        <span className="label">Meet your go-to guy</span>
        <Reveal as="h2">
          It’s personal.
          <br />
          <em>And it should be.</em>
        </Reveal>
      </div>

      <div className="wrap about-story-grid">
        <figure className="about-sheet-wrap">
          <div className="about-sheet">
            <span className="about-crop about-crop-tl" aria-hidden="true" />
            <span className="about-crop about-crop-tr" aria-hidden="true" />
            <span className="about-crop about-crop-bl" aria-hidden="true" />
            <span className="about-crop about-crop-br" aria-hidden="true" />
            <div className="about-sheet-top label">
              <span>Sheet A</span>
              <span>Portrait</span>
            </div>
            <div className="about-sheet-name" aria-hidden="true">
              Ray<span className="glow-text">.</span>
            </div>
            <Draw className="about-sheet-dim" start="top 85%">
              <svg viewBox="0 0 400 16" preserveAspectRatio="none" fill="none" aria-hidden="true">
                <path
                  className="schem-draw"
                  pathLength={1}
                  vectorEffect="non-scaling-stroke"
                  d="M0 8 H400"
                />
                <path
                  className="schem-draw"
                  pathLength={1}
                  vectorEffect="non-scaling-stroke"
                  d="M0.5 1 V15"
                />
                <path
                  className="schem-draw"
                  pathLength={1}
                  vectorEffect="non-scaling-stroke"
                  d="M399.5 1 V15"
                />
              </svg>
              <span className="label">{site.promise}</span>
            </Draw>
            <dl className="about-sheet-block">
              {sheet.map((row) => (
                <div key={row.term}>
                  <dt className="label">{row.term}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <figcaption className="label">
            <span>Fig. A</span>
            <span>Drawn, not staged</span>
          </figcaption>
        </figure>

        <div className="about-story-copy">
          <ScrubText className="about-scrub" start="top 85%" end="bottom 60%">
            When you invite someone into your home or business, <em>trust matters.</em> Ray takes
            the time to understand what you need, explain the work and agree the plan before
            getting started.
          </ScrubText>
          <div className="about-story-foot">
            <p>
              Whether it’s a socket that’s stopped working, lighting for a renovation, or a
              distribution board that needs attention, your job gets a practical, considered
              approach.
            </p>
            <Link to="/contact" className="arrow-link">
              Start a conversation
              <span className="arrow-circle">
                <ArrowUpRight />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Principles as stacked sheets: each one settles back as the next slides over it. */
function Principles() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionEnabled()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(".about-panel");
        panels.forEach((panel, i) => {
          const next = panels[i + 1];
          if (!next) return;
          gsap.to(panel, {
            scale: 0.9 + i * 0.025,
            "--dim": 1,
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              // Done when the next sheet reaches its own sticky offset.
              end: () => `top ${parseFloat(getComputedStyle(next).top) || 0}px`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        });
        gsap.utils.toArray<HTMLElement>(".about-panel-num").forEach((num) => {
          gsap.fromTo(
            num,
            { yPercent: 18 },
            {
              yPercent: 0,
              ease: "none",
              scrollTrigger: { trigger: num, start: "top bottom", end: "top 40%", scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="about-principles s-ink">
      <div className="wrap about-principles-head">
        <span className="label">How Ray works</span>
        <Reveal as="h2">
          What you can
          <br />
          <em>count on.</em>
        </Reveal>
      </div>
      <ol className="about-stack">
        {principles.map((item, i) => (
          <li
            key={item.title}
            className={`about-panel ${i % 2 ? "s-ink about-panel-ink" : "s-bone"}`}
            style={{ "--i": i } as CSSProperties}
          >
            <div className="wrap about-panel-inner">
              <div className="about-panel-top label">
                <span>Principle</span>
                <span>
                  0{i + 1} / 0{principles.length}
                </span>
              </div>
              <span className="about-panel-num" aria-hidden="true">
                {i + 1}
              </span>
              <div className="about-panel-body">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The service area as a hairline survey sheet: a graticule, a fix and two names. */
function Area() {
  return (
    <section className="about-area s-ink">
      <div className="wrap about-area-head">
        <span className="label">Where Ray works</span>
        <Reveal as="h2">
          Fourways <span className="about-area-dot" aria-hidden="true" />{" "}
          <em>Sandton</em>
        </Reveal>
        <p>Homes and businesses across Fourways and Sandton. Residential and commercial.</p>
      </div>

      <div className="wrap">
        <div className="about-map">
          <svg className="about-map-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path className="about-route-d" vectorEffect="non-scaling-stroke" d="M37.5 42.86 L68.75 71.43" />
            <path className="about-route-m" vectorEffect="non-scaling-stroke" d="M37.5 40 L75 70" />
          </svg>

          <Draw className="about-fix" start="top 75%" duration={2.8}>
            <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" aria-hidden="true">
              <circle className="schem-draw" pathLength={1} vectorEffect="non-scaling-stroke" cx="100" cy="100" r="96" />
              <circle className="schem-draw" pathLength={1} vectorEffect="non-scaling-stroke" cx="100" cy="100" r="62" />
              <circle
                className="schem-dim"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="2 4"
                cx="100"
                cy="100"
                r="30"
              />
              <path className="schem-draw" pathLength={1} vectorEffect="non-scaling-stroke" d="M100 0 V84 M100 116 V200" />
              <path className="schem-draw" pathLength={1} vectorEffect="non-scaling-stroke" d="M0 100 H84 M116 100 H200" />
            </svg>
            <span className="about-fix-dot" />
          </Draw>

          <div className="about-place about-place-a">
            <span className="about-place-name">Fourways</span>
            <span className="label">{site.coordinates}</span>
          </div>
          <div className="about-place about-place-b">
            <span className="about-place-pin" aria-hidden="true" />
            <span className="about-place-name">Sandton</span>
          </div>

          <span className="about-map-n label" aria-hidden="true">
            <i />N
          </span>
          <div className="about-map-foot label">
            <span>{site.address.join(", ")}</span>
            <span>Not to scale</span>
          </div>
        </div>
      </div>
    </section>
  );
}
