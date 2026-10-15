import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { ease, gsap, motionEnabled, onIntro, useGSAP } from "@/lib/motion";
import { Magnetic, Reveal, RollText } from "@/components/motion/Motion";
import { BrandMark, ClosingCta } from "@/components/site/SiteShell";
import { pageHead, site, steps, whatsappLink } from "@/data/site";

export const Route = createFileRoute("/process")({
  head: () =>
    pageHead(
      "The process",
      "From a quick conversation and free initial estimate to an agreed plan and careful electrical work. Here is how working with Ray works.",
    ),
  component: ProcessPage,
});

const pad = (n: number) => String(n).padStart(2, "0");

/* An AC trace for the hero: 3.5 cycles across a 1600 x 300 box. */
const WAVE = (() => {
  const pts: string[] = [];
  for (let x = 0; x <= 1600; x += 8) {
    const y = 150 - 92 * Math.sin((x / 1600) * Math.PI * 2 * 3.5);
    pts.push(`${x} ${Math.round(y * 10) / 10}`);
  }
  return `M${pts.join(" L")}`;
})();

/* What helps Ray most in a first message. Advice copy for this page. */
const asks = [
  {
    tag: "Photo",
    title: "A photo of the problem.",
    text: "The board, the socket or the fitting. One clear picture often says more than a long description.",
  },
  {
    tag: "Place",
    title: "Your suburb.",
    text: `So Ray knows where the job is. Home base is ${site.areas.join(" and ")}.`,
  },
  {
    tag: "Problem",
    title: "What isn’t working.",
    text: "What happens, when it started, and whether anything tripped or changed around the same time.",
  },
  {
    tag: "Timing",
    title: "When suits you.",
    text: "A few days or times that work for a visit, so the plan fits around you.",
  },
];

const draftFields = ["Suburb", "What isn’t working", "When it started", "Good times for a visit"];
const draftMessage = `Hi Ray, I’d like a free estimate.\n\n${draftFields.map((f) => `${f}: `).join("\n")}\n\n(Photo attached)`;

function ProcessPage() {
  return (
    <main>
      <Hero />
      <Run />
      <Send />
      <ClosingCta
        title={
          <>
            Step one is
            <br />
            <em>a message.</em>
          </>
        }
        lede="Call or WhatsApp with a photo and a few details. Initial estimates are free."
      />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Intro: a faint mains trace runs behind the title with a pulse travelling along it. */
function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionEnabled()) return;
      const intro = gsap
        .timeline({ paused: true })
        .fromTo(
          ".proc-wave",
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 2.6, ease: ease.inOut },
          0,
        )
        .fromTo(
          ".proc-hero [data-fade]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1.4, stagger: 0.07, ease: ease.out },
          0.35,
        );
      const off = onIntro(() => intro.play());
      gsap.to(".proc-wave", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
      return off;
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="page-hero proc-hero s-ink">
      <div className="proc-wave" aria-hidden="true">
        <svg viewBox="0 0 1600 300" preserveAspectRatio="xMidYMid slice">
          <path d="M0 150 H1600" className="proc-wave-axis" vectorEffect="non-scaling-stroke" />
          <path d={WAVE} className="proc-wave-line" vectorEffect="non-scaling-stroke" />
          <path d={WAVE} className="proc-wave-pulse" pathLength={1} />
        </svg>
        <span className="label proc-wave-tag">Supply · 230 V ~ 50 Hz</span>
      </div>
      <div className="wrap">
        <div className="page-hero-meta label">
          <span className="label-dot" data-fade="">
            The process
          </span>
          <span data-fade="">Four steps</span>
          <span data-fade="">Free initial estimates</span>
        </div>
        <Reveal as="h1" load>
          No guesswork.
          <br />
          <em>Just good work.</em>
        </Reveal>
        <div className="page-hero-foot">
          <span className="label proc-hero-note" data-fade="">
            From first message to lights on
          </span>
          <p className="lead" data-fade="">
            A clear plan. An honest conversation. A simpler way to get your electrical work sorted.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The four steps as a live circuit. On desktop the stage pins and a current
 * runs along a horizontal wire; each node it reaches switches on its step,
 * and the wire ends in a lamp. Small screens get a stacked version. */
function Run() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || !motionEnabled()) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px)", () => {
        const stage = root.querySelector<HTMLElement>(".proc-stage");
        const wire = root.querySelector<HTMLElement>(".proc-wire");
        const current = root.querySelector<HTMLElement>(".proc-current");
        const count = root.querySelector(".proc-count");
        const nodes = gsap.utils.toArray<HTMLElement>(".proc-node", root);
        const copies = gsap.utils.toArray<HTMLElement>(".proc-copy", root);
        if (!stage || !wire || !current) return;

        let stops: number[] = [];
        let active = -1;
        let on = false;
        const measure = () => {
          const w = wire.getBoundingClientRect();
          stops = nodes.map((node) => {
            const dot = node.querySelector(".proc-node-dot")?.getBoundingClientRect();
            return dot && w.width ? (dot.left + dot.width / 2 - w.left) / w.width : 0;
          });
        };
        const apply = (p: number) => {
          current.style.width = `${p * 100}%`;
          let step = 0;
          stops.forEach((s, j) => {
            if (p >= s - 0.001) step = j;
          });
          if (step !== active) {
            active = step;
            nodes.forEach((n, j) => n.classList.toggle("is-live", j <= step));
            copies.forEach((c, j) => {
              c.classList.toggle("is-active", j === step);
              c.classList.toggle("is-past", j < step);
            });
            stage.style.setProperty("--step", String(step));
            if (count) count.textContent = pad(step + 1);
          }
          const lit = p > 0.995;
          if (lit !== on) {
            on = lit;
            stage.classList.toggle("is-on", lit);
          }
        };

        const state = { p: 0 };
        measure();
        apply(0);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${window.innerHeight * 2.4}`,
            pin: true,
            scrub: 0.9,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: () => {
              measure();
              apply(state.p);
            },
          },
        });
        tl.to({}, { duration: 0.08 })
          .to(state, { p: 1, duration: 1, ease: "none", onUpdate: () => apply(state.p) })
          .to({}, { duration: 0.22 });

        return () => {
          current.style.width = "";
          stage.classList.remove("is-on");
        };
      });

      mm.add("(max-width: 899px)", () => {
        gsap.utils.toArray<HTMLElement>(".proc-item", root).forEach((item) => {
          gsap.fromTo(
            item.querySelector(".proc-item-line i"),
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: { trigger: item, start: "top 85%", end: "top 45%", scrub: 0.5 },
            },
          );
          gsap.fromTo(
            item.querySelectorAll("[data-fade]"),
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              stagger: 0.07,
              ease: ease.out,
              scrollTrigger: { trigger: item, start: "top 78%", once: true },
            },
          );
          gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: "top 50%",
              toggleClass: { targets: item, className: "is-live" },
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="proc-run s-ink" aria-label="The four steps">
      {/* Desktop: pinned circuit */}
      <div className="proc-stage">
        <div className="wrap proc-stage-inner">
          <div className="proc-meta label">
            <span className="label-dot">How it works</span>
            <span className="proc-meta-mid">Follow the current</span>
            <span>
              Step <span className="proc-count">01</span> / {pad(steps.length)}
            </span>
          </div>

          <div className="proc-main">
            <div className="proc-big" aria-hidden="true">
              <span className="proc-zero">0</span>
              <span className="proc-roll">
                <span className="proc-digits">
                  {steps.map((_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </span>
              </span>
            </div>
            <div className="proc-copies">
              {steps.map((step, i) => (
                <div key={step.title} className={`proc-copy${i === 0 ? " is-active" : ""}`}>
                  <span className="proc-mask label">
                    <span>Step {pad(i + 1)}</span>
                  </span>
                  <h2 className="proc-mask">
                    <span>{step.title}</span>
                  </h2>
                  <p className="proc-mask">
                    <span>{step.text}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="proc-track">
            <div className="proc-wire" aria-hidden="true">
              <i className="proc-current" />
            </div>
            {steps.map((step, i) => (
              <div key={step.title} className={`proc-node${i === 0 ? " is-live" : ""}`}>
                <span className="proc-node-dot" aria-hidden="true" />
                <span className="label">{pad(i + 1)}</span>
                <span className="proc-node-title">{step.title}</span>
              </div>
            ))}
            <div className="proc-lamp" aria-hidden="true">
              <BrandMark />
            </div>
          </div>
        </div>
      </div>

      {/* Small screens and reduced motion: stacked circuit */}
      <div className="proc-stack wrap">
        <div className="proc-stack-head">
          <span className="label label-dot">How it works</span>
          <Reveal as="h2">
            From first message
            <br />
            <em>to lights on.</em>
          </Reveal>
        </div>
        <ol className="proc-list">
          {steps.map((step, i) => (
            <li key={step.title} className="proc-item">
              <div className="proc-item-line" aria-hidden="true">
                <i />
                <span />
              </div>
              <span className="proc-item-num" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <div className="proc-item-copy">
                <span className="label" data-fade="">
                  Step {pad(i + 1)}
                </span>
                <h3 data-fade="">{step.title}</h3>
                <p data-fade="">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* A helper for the first message, with a ready-made WhatsApp draft. */
function Send() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionEnabled()) return;
      gsap.utils.toArray<HTMLElement>(".proc-ask", ref.current).forEach((row) => {
        gsap.fromTo(
          row.querySelectorAll("[data-fade]"),
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.07,
            ease: ease.out,
            scrollTrigger: { trigger: row, start: "top 86%", once: true },
          },
        );
      });
      gsap.fromTo(
        ".proc-draft",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.5,
          ease: ease.inOut,
          scrollTrigger: { trigger: ".proc-draft", start: "top 85%", once: true },
        },
      );
      gsap.fromTo(
        ".proc-draft-row",
        { opacity: 0, x: -12 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          stagger: 0.09,
          ease: ease.out,
          delay: 0.6,
          scrollTrigger: { trigger: ".proc-draft", start: "top 85%", once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="proc-send s-bone">
      <div className="wrap">
        <div className="proc-send-head">
          <span className="label">Before you message</span>
          <Reveal as="h2">
            Make the first message
            <br />
            <em>count.</em>
          </Reveal>
          <p>
            No forms and no call centre. A few details up front help Ray understand the job before
            the first conversation.
          </p>
        </div>

        <div className="proc-send-body">
          <ol className="proc-asks">
            {asks.map((ask) => (
              <li key={ask.tag} className="proc-ask">
                <span className="label" data-fade="">
                  {ask.tag}
                </span>
                <div>
                  <h3 data-fade="">{ask.title}</h3>
                  <p data-fade="">{ask.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <aside className="proc-draft s-ink" aria-label="A message you can send">
            <div className="proc-draft-top label">
              <span className="label-dot">Draft</span>
              <span>WhatsApp · {site.phone}</span>
            </div>
            <p className="proc-draft-hello proc-draft-row">
              Hi Ray, I’d like a free estimate.
              <i className="proc-caret" aria-hidden="true" />
            </p>
            <ul className="proc-draft-fields">
              {draftFields.map((field) => (
                <li key={field} className="proc-draft-row">
                  <span className="label">{field}</span>
                  <i aria-hidden="true" />
                </li>
              ))}
              <li className="proc-draft-row proc-draft-photo">
                <span className="label">+ Photo attached</span>
              </li>
            </ul>
            <Magnetic className="proc-draft-btn">
              <a
                href={whatsappLink(draftMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-spark"
              >
                <RollText>Start this message</RollText>
                <ArrowUpRight />
              </a>
            </Magnetic>
            <p className="proc-draft-note">
              Opens WhatsApp with this draft. Nothing is sent until you press send.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
