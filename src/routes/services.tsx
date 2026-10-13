import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { ease, gsap, motionEnabled, onIntro, ScrollTrigger, useGSAP } from "@/lib/motion";
import { Draw, Magnetic, Reveal, RollText } from "@/components/motion/Motion";
import { ClosingCta } from "@/components/site/SiteShell";
import { ServiceArt } from "@/components/site/ServiceArt";
import { facts, pageHead, services, site } from "@/data/site";

export const Route = createFileRoute("/services")({
  head: () =>
    pageHead(
      "Electrical services",
      "Explore Ray’s distribution board wiring, circuit breaker repairs, lighting installation, and socket repairs in Fourways and Sandton.",
    ),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <main>
      <Hero />
      <Chapters />
      <Between />
      <ClosingCta />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Intro: a pendant hangs in the dark and draws itself behind the title. */
function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionEnabled()) return;
      const intro = gsap
        .timeline({ paused: true })
        .fromTo(
          ".svc-hero [data-fade]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1.4, stagger: 0.07, ease: ease.out },
          0.35,
        );
      intro.fromTo(
        ".svc-hero-glow",
        { opacity: 0 },
        { opacity: 1, duration: 3, ease: "power2.inOut" },
        2.4,
      );
      const off = onIntro(() => intro.play());
      gsap.to(".svc-hero-art", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
      return off;
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="page-hero svc-hero s-ink">
      <Draw className="svc-hero-art" start="top bottom" duration={4.2}>
        <span className="svc-hero-glow" />
        <ServiceArt kind="light" />
        <span className="svc-hero-tag label" data-fade="">
          Pendant — section
        </span>
      </Draw>
      <div className="wrap">
        <div className="page-hero-meta label">
          <span className="label-dot" data-fade="">
            Services
          </span>
          <span data-fade="">Homes &amp; businesses</span>
          <span data-fade="">{site.areas.join(" · ")}</span>
        </div>
        <Reveal as="h1" load>
          Good connections.
          <br />
          <em>Better living.</em>
        </Reveal>
        <div className="page-hero-foot">
          <nav className="svc-hero-index" aria-label="Services on this page" data-fade="">
            {services.map((service) => (
              <a key={service.key} href={`#${service.key}`}>
                <span className="label">{service.number}</span>
                <span>{service.short}</span>
              </a>
            ))}
          </nav>
          <p className="lead" data-fade="">
            Electrical solutions for homes and businesses. From the everyday fix to the bigger
            project.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Four chapters beside a sticky index. As each chapter takes the stage the
 * index lights its line and the whole section switches between paper and dark. */
function Chapters() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = ref.current;
      if (!section || !motionEnabled()) return;
      const items = gsap.utils.toArray<HTMLElement>(".svc-toc li", section);
      const chapters = gsap.utils.toArray<HTMLElement>(".svc-ch", section);
      const count = section.querySelector(".svc-toc-count");
      let active = -1;

      const setActive = (i: number) => {
        if (i === active) return;
        active = i;
        items.forEach((el, j) => el.classList.toggle("is-active", j === i));
        chapters.forEach((el, j) => el.classList.toggle("is-active", j === i));
        section.classList.toggle("is-ink", chapters[i]?.dataset["tone"] === "ink");
        if (count) count.textContent = services[i]?.number ?? "";
      };
      setActive(0);

      chapters.forEach((chapter, i) => {
        ScrollTrigger.create({
          trigger: chapter,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });
        gsap.fromTo(
          chapter.querySelectorAll("[data-fade]"),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1.3,
            stagger: 0.08,
            ease: ease.out,
            scrollTrigger: {
              trigger: chapter.querySelector(".svc-ch-grid"),
              start: "top 75%",
              once: true,
            },
          },
        );
        gsap.fromTo(
          chapter.querySelector(".svc-ch-panel"),
          { clipPath: "inset(12% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: chapter.querySelector(".svc-ch-grid"),
              start: "top bottom",
              end: "top 45%",
              scrub: true,
            },
          },
        );
      });

      gsap.fromTo(
        ".svc-toc-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".svc-chapters",
            start: "top 50%",
            end: "bottom 50%",
            scrub: true,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="svc-index" aria-label="Services">
      <div className="wrap svc-index-grid">
        <aside className="svc-aside">
          <div className="svc-toc-wrap">
            <div className="svc-toc-head label">
              <span>Index</span>
              <span>
                <span className="svc-toc-count">{services[0]?.number}</span> / 0{services.length}
              </span>
            </div>
            <div className="svc-toc">
              <i className="svc-toc-fill" aria-hidden="true" />
              <ol>
                {services.map((service) => (
                  <li key={service.key}>
                    <a href={`#${service.key}`}>
                      <span className="label">{service.number}</span>
                      <span className="svc-toc-name">{service.short}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
            <Link to="/contact" className="svc-toc-help">
              <span className="label">Not sure which?</span>
              <span className="link-u">Describe the job instead</span>
            </Link>
          </div>
        </aside>

        <div className="svc-chapters">
          {services.map((service, i) => {
            const ink = i % 2 === 1;
            return (
              <article
                key={service.key}
                id={service.key}
                className="svc-ch"
                data-tone={ink ? "ink" : "bone"}
              >
                <header className="svc-ch-head">
                  <span className="svc-ch-num" aria-hidden="true">
                    {service.number}
                  </span>
                  <div className="svc-ch-titles">
                    <span className="label">
                      {service.short} — {i + 1} of {services.length}
                    </span>
                    <Reveal as="h2">{service.title}</Reveal>
                  </div>
                </header>

                <div className="svc-ch-grid">
                  <figure className={`svc-ch-panel ${ink ? "s-bone" : "s-ink"}`}>
                    <div className="svc-ch-panel-top label">
                      <span>Fig. {service.number}</span>
                      <span>{service.short}</span>
                    </div>
                    <Draw className="svc-ch-art" start="top 95%" duration={2.6}>
                      <ServiceArt
                        kind={service.key}
                        title={`Technical drawing: ${service.title}`}
                      />
                    </Draw>
                    <figcaption className="svc-ch-block label">
                      <span>Ray Electrical</span>
                      <span>{service.title}</span>
                      <span>
                        Sheet {i + 1}/{services.length}
                      </span>
                    </figcaption>
                  </figure>

                  <div className="svc-ch-body">
                    <p className="svc-ch-cat" data-fade="">
                      {service.category}
                    </p>
                    <p className="svc-ch-desc" data-fade="">
                      {service.description}
                    </p>
                    <div className="svc-ch-scope" data-fade="">
                      <span className="label">Scope</span>
                      <ul>
                        {service.scope.map((item, j) => (
                          <li key={item}>
                            <span className="label">
                              {service.number}.{j + 1}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div data-fade="">
                      <Link
                        to="/contact"
                        search={{ service: service.title }}
                        className="arrow-link"
                      >
                        Enquire about this
                        <span className="arrow-circle">
                          <ArrowUpRight />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The facts, set as lines that switch on one by one as they scroll past. */
function Between() {
  const ref = useRef<HTMLElement>(null);
  const lines = facts.slice(0, -1);
  const closer = (facts[facts.length - 1] ?? "").split(" ");
  const closerHead = closer.slice(0, -2).join(" ");
  const closerTail = closer.slice(-2).join(" ");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !motionEnabled()) return;
      gsap.utils.toArray<HTMLElement>(".svc-fact", el).forEach((row) => {
        const text = row.querySelector(".svc-fact-dim");
        if (text) {
          gsap.fromTo(
            text,
            { opacity: 0.12 },
            {
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: row, start: "top 92%", end: "top 60%", scrub: 0.6 },
            },
          );
        }
        ScrollTrigger.create({
          trigger: row,
          start: "top 64%",
          onEnter: () => row.classList.add("is-lit"),
          onLeaveBack: () => row.classList.remove("is-lit"),
        });
      });
      gsap.fromTo(
        ".svc-between-foot [data-fade]",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.08,
          ease: ease.out,
          scrollTrigger: { trigger: ".svc-between-foot", start: "top 88%", once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="svc-between s-bone">
      <div className="wrap">
        <div className="svc-between-head">
          <span className="label label-dot">And everything in between</span>
          <p>
            Beyond the four core services is the everyday electrical work that keeps a home or
            business running. It all counts.
          </p>
        </div>
        <ul className="svc-facts">
          {lines.map((fact) => (
            <li key={fact} className="svc-fact">
              <i className="svc-fact-lamp" aria-hidden="true" />
              <span className="svc-fact-text svc-fact-dim">{fact}.</span>
            </li>
          ))}
          <li className="svc-fact svc-fact-closer">
            <i className="svc-fact-lamp" aria-hidden="true" />
            <Reveal
              as="span"
              className="svc-fact-text"
              type="chars"
              start="top 80%"
              stagger={0.025}
            >
              {closerHead} <em>{closerTail}.</em>
            </Reveal>
          </li>
        </ul>
        <div className="svc-between-foot">
          <p data-fade="">
            Something that isn’t on the list? Describe it, add a photo if you can, and you’ll hear
            plainly whether it’s a job for Ray.
          </p>
          <div data-fade="">
            <Magnetic>
              <Link to="/contact" className="btn btn-ink">
                <RollText>Describe your job</RollText>
                <ArrowUpRight />
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
