import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { ease, gsap, motionEnabled, onIntro, useGSAP } from "@/lib/motion";
import {
  Draw,
  Magnetic,
  Marquee,
  Parallax,
  Reveal,
  RevealImage,
  RollText,
  ScrubText,
  useSpotlight,
} from "@/components/motion/Motion";
import { ClosingCta } from "@/components/site/SiteShell";
import { ServiceArt } from "@/components/site/ServiceArt";
import { pageHead, principles, services, site, steps } from "@/data/site";
import hero from "@/assets/ray-home.jpg";
import tree from "@/assets/detail-tree.jpg";
import path from "@/assets/detail-path.jpg";
import living from "@/assets/detail-living.jpg";
import pool from "@/assets/detail-pool.jpg";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Electrician in Fourways & Sandton",
      "Ray Electrical: DB board wiring, breaker repairs, lighting and socket installations for homes and businesses in Fourways and Sandton.",
    ),
  component: Index,
});

function Index() {
  return (
    <main>
      <Hero />
      <LightsOn />
      <Approach />
      <ServicesRail />
      <Circuit />
      <Marquee className="home-marquee s-ink" speed={2.4}>
        {["Distribution boards", "Breakers", "Lighting", "Sockets", "Fourways", "Sandton"].map(
          (word) => (
            <span key={word} className="home-marquee-item">
              {word}
              <i aria-hidden="true" />
            </span>
          ),
        )}
      </Marquee>
      <Ethos />
      <ClosingCta />
    </main>
  );
}

/* ------------------------------------------------------------------ */
function Hero() {
  const ref = useSpotlight<HTMLElement>();

  useGSAP(
    () => {
      if (!motionEnabled()) return;
      const intro = gsap
        .timeline({ paused: true })
        .fromTo(
          ".hero-rule",
          { scaleX: 0 },
          { scaleX: 1, transformOrigin: "0% 50%", duration: 1.8, ease: ease.inOut },
          0,
        )
        .fromTo(
          ".hero [data-fade]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1.4, stagger: 0.07, ease: ease.out },
          0.35,
        );
      const off = onIntro(() => intro.play());

      const out = { trigger: ref.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(".hero-title", { yPercent: -22, ease: "none", scrollTrigger: out });
      gsap.to(".hero-frame", { yPercent: -45, ease: "none", scrollTrigger: out });
      gsap.to(".hero-inner", { opacity: 0.15, ease: "power1.in", scrollTrigger: out });
      return off;
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="hero s-ink">
      <div className="wrap hero-inner">
        <div className="hero-meta label">
          <span className="label-dot" data-fade="">
            Electrical contractor
          </span>
          <span data-fade="">Fourways &amp; Sandton</span>
          <span data-fade="">Residential &amp; commercial</span>
          <span data-fade="" className="hero-coords">
            {site.coordinates}
          </span>
        </div>
        <div className="hero-rule" />

        <div className="hero-frame">
          <RevealImage
            src={tree}
            alt="An olive tree uplit against a dark wall at dusk"
            width={390}
            height={620}
            load
            delay={0.35}
            parallax={9}
            priority
          />
          <span className="label" data-fade="">
            Uplight — garden
          </span>
        </div>

        <h1 className="hero-title" aria-label="Power, done right.">
          <Reveal as="span" className="hero-line" load>
            Power,
          </Reveal>
          <Reveal as="span" className="hero-line hero-line-2" load delay={0.12}>
            <em>
              done right<span className="glow-text">.</span>
            </em>
          </Reveal>
        </h1>

        <div className="hero-foot">
          <p className="lead" data-fade="">
            Expert electrical work. Honest service. For the spaces you live and work in.
          </p>
          <div className="hero-actions" data-fade="">
            <Magnetic>
              <Link to="/contact" className="btn btn-filament">
                <RollText>Get a free estimate</RollText>
                <ArrowUpRight />
              </Link>
            </Magnetic>
            <Magnetic>
              <a href={`tel:${site.tel}`} className="btn btn-ghost">
                <RollText>Call Ray</RollText>
              </a>
            </Magnetic>
          </div>
          <a href="#lights" className="hero-scroll label" data-fade="">
            Scroll <ArrowDown />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The signature moment: a word cut out of the dark. Scroll dives into the
 * letter "i" until the house fills the screen, and its lights come on. */
function LightsOn() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !motionEnabled()) return;
      const svg = el.querySelector<SVGSVGElement>(".lights-mask svg");
      const text = el.querySelector<SVGTextElement>(".lights-mask text");
      const mask = el.querySelector<HTMLElement>(".lights-mask");
      if (!svg || !text || !mask) return;

      // Origin of the zoom: the stem of the "i", so the dive ends inside the letter.
      const origin = () => {
        try {
          const box = text.getExtentOfChar(1);
          const ctm = svg.getScreenCTM();
          const m = mask.getBoundingClientRect();
          if (!ctm) return "50% 50%";
          const pt = new DOMPoint(box.x + box.width / 2, box.y + box.height * 0.62).matrixTransform(
            ctm,
          );
          return `${pt.x - m.left}px ${pt.y - m.top}px`;
        } catch {
          return "50% 50%";
        }
      };

      gsap.set(mask, { transformOrigin: origin() });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=230%",
          scrub: 1,
          pin: ".lights-stage",
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => gsap.set(mask, { transformOrigin: origin() }),
          onUpdate: (self) => el.classList.toggle("is-on", self.progress > 0.42),
        },
      });
      tl.to(mask, { scale: 60, duration: 1, ease: "power3.in" }, 0)
        .to(mask, { autoAlpha: 0, duration: 0.15 }, 0.85)
        .fromTo(
          ".lights-img",
          { scale: 1.3, filter: "brightness(0.5) saturate(0.45)" },
          { scale: 1, filter: "brightness(1) saturate(1)", duration: 1.1, ease: "power2.out" },
          0.35,
        )
        .fromTo(
          ".lights-copy [data-fade]",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.35, ease: "power2.out" },
          1.15,
        )
        .to({}, { duration: 0.3 });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="lights" id="lights">
      <div className="lights-stage">
        <img
          className="lights-img"
          src={hero}
          alt="A modern home at dusk with warm interior, garden and pool lighting"
          width={1920}
          height={1088}
          loading="lazy"
          decoding="async"
        />
        <div className="lights-shade" />
        <div className="lights-mask" aria-hidden="true">
          <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
            <defs>
              <mask
                id="lights-cut"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="1600"
                height="900"
              >
                <rect width="1600" height="900" fill="var(--mask-light)" />
                <text x="800" y="640" textAnchor="middle" fill="var(--mask-dark)">
                  Light
                </text>
              </mask>
            </defs>
            <rect width="1600" height="900" fill="var(--ink)" mask="url(#lights-cut)" />
          </svg>
        </div>
        <div className="lights-switch label" aria-hidden="true">
          <span>Off</span>
          <i />
          <span>On</span>
        </div>
        <div className="lights-copy wrap">
          <span className="label label-dot" data-fade="">
            Small repairs. Big difference.
          </span>
          <h2 data-fade="">
            Every space deserves
            <br />
            <em>to be lit well.</em>
          </h2>
          <p className="lead" data-fade="">
            From the board to the last light bulb. Practical electrical work, delivered with
            attention to every detail.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function Approach() {
  return (
    <section className="approach s-ink">
      <div className="wrap approach-grid">
        <span className="label label-dot approach-label">The approach</span>
        <ScrubText className="approach-text">
          A home isn’t just wires and walls. It’s where <em>life happens.</em> Ray brings a personal
          approach to electrical work: clear, practical and straightforward, from the board to the{" "}
          <em>last light bulb.</em>
        </ScrubText>
      </div>
      <div className="wrap approach-media">
        <figure className="approach-a">
          <RevealImage
            src={path}
            alt="Low bollard lights along a garden path at night"
            width={620}
            height={448}
            parallax={8}
          />
          <figcaption className="label">Bollard — pathway</figcaption>
        </figure>
        <Parallax speed={0.28} className="approach-b">
          <figure>
            <RevealImage
              src={living}
              alt="An open-plan living room glowing with warm pendant and recessed light"
              width={580}
              height={250}
              parallax={6}
              delay={0.15}
            />
            <figcaption className="label">Pendant — living</figcaption>
          </figure>
        </Parallax>
        <p className="approach-note">
          Light is the part of electrical work you actually see. The rest, the board, the breakers,
          the cable behind the wall, is what makes it safe. Ray takes care of both.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function ServicesRail() {
  const ref = useRef<HTMLElement>(null);
  const [rail, setRail] = useState<gsap.core.Animation | null>(null);

  useGSAP(
    () => {
      if (!motionEnabled()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px)", () => {
        const track = ref.current?.querySelector<HTMLElement>(".rail-track");
        if (!track) return;
        const distance = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".rail-pin",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.fromTo(
          ".rail-bar i",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".rail-pin",
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
        setRail(tween);
        return () => setRail(null);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="rail s-bone" id="services">
      <div className="wrap rail-head">
        <span className="label">Services — 0{services.length}</span>
        <Reveal as="h2">
          Every connection,
          <br />
          <em>considered.</em>
        </Reveal>
        <div className="rail-intro">
          <p>
            Electrical solutions for homes and businesses. From the everyday fix to the bigger
            project.
          </p>
          <Link to="/services" className="arrow-link">
            All services
            <span className="arrow-circle">
              <ArrowUpRight />
            </span>
          </Link>
        </div>
      </div>
      <div className="rail-pin">
        <div className="rail-track">
          {services.map((service) => (
            <article className="rail-card" key={service.key}>
              <div className="rail-card-top label">
                <span>{service.number}</span>
                <span>{service.short}</span>
              </div>
              <Draw
                className="rail-art"
                containerAnimation={rail}
                start={rail ? "left 85%" : "top 80%"}
              >
                <ServiceArt kind={service.key} />
              </Draw>
              <div className="rail-card-body">
                <span className="label">{service.category}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link to="/contact" search={{ service: service.title }} className="arrow-link">
                  Enquire
                  <span className="arrow-circle">
                    <ArrowUpRight />
                  </span>
                </Link>
              </div>
            </article>
          ))}
          <article className="rail-card rail-card-end">
            <span className="label">And everything in between</span>
            <h3>
              No job
              <br />
              <em>too small.</em>
            </h3>
            <p>
              Materials and labour supplied. Free initial estimates. Residential and commercial.
            </p>
            <Link to="/contact" className="btn btn-ink">
              <RollText>Describe your job</RollText>
              <ArrowUpRight />
            </Link>
          </article>
        </div>
        <div className="wrap rail-progress">
          <span className="label">Scroll</span>
          <div className="rail-bar">
            <i />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The process as a live wire: it draws as you scroll and lights each step. */
function Circuit() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionEnabled()) return;
      gsap.fromTo(
        ".circuit-wire i",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".circuit-steps",
            start: "top 62%",
            end: "bottom 62%",
            scrub: 0.4,
          },
        },
      );
      gsap.utils.toArray<HTMLElement>(".circuit-step").forEach((step) => {
        gsap.fromTo(
          step.querySelectorAll("[data-fade]"),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.08,
            scrollTrigger: { trigger: step, start: "top 80%", once: true },
          },
        );
        gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: "top 62%",
            toggleClass: { targets: step, className: "is-live" },
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="circuit s-ink">
      <div className="wrap circuit-head">
        <span className="label label-dot">The process</span>
        <Reveal as="h2">
          No guesswork.
          <br />
          <em>Just good work.</em>
        </Reveal>
      </div>
      <div className="wrap circuit-steps">
        <div className="circuit-wire" aria-hidden="true">
          <i />
        </div>
        {steps.map((step, i) => (
          <div className="circuit-step" key={step.title}>
            <span className="circuit-num" aria-hidden="true">
              0{i + 1}
            </span>
            <span className="circuit-node" aria-hidden="true" />
            <div className="circuit-copy">
              <span className="label" data-fade="">
                Step 0{i + 1}
              </span>
              <h3 data-fade="">{step.title}</h3>
              <p data-fade="">{step.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="wrap circuit-foot">
        <Link to="/process" className="arrow-link">
          How working with Ray works
          <span className="arrow-circle">
            <ArrowUpRight />
          </span>
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function Ethos() {
  return (
    <section className="ethos s-bone">
      <div className="wrap ethos-grid">
        <div className="ethos-intro">
          <span className="label">The person behind the power</span>
          <Reveal as="h2">
            Not just an electrician.
            <br />
            <em>Your go-to guy.</em>
          </Reveal>
          <p>
            When you invite someone into your home or business, trust matters. Ray takes the time to
            understand what you need, explain the work and agree the plan before getting started.
          </p>
          <Link to="/about" className="arrow-link">
            Meet Ray
            <span className="arrow-circle">
              <ArrowUpRight />
            </span>
          </Link>
        </div>
        <ol className="ethos-list">
          {principles.map((item, i) => (
            <li key={item.title}>
              <span className="label">0{i + 1}</span>
              <div>
                <Reveal as="h3">{item.title}</Reveal>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="wrap">
        <figure className="ethos-pool">
          <RevealImage
            src={pool}
            alt="A pool reflecting the warm lights of the house behind it"
            width={740}
            height={310}
            parallax={10}
          />
          <figcaption className="label">
            <span>Underwater — pool</span>
            <span>Fourways · Sandton</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
