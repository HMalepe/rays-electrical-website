import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ease, gsap, motionEnabled, onIntro, useGSAP } from "@/lib/motion";
import { Magnetic, Reveal, RollText } from "@/components/motion/Motion";
import { SchematicSocket } from "@/components/site/Schematics";
import { facts, pageHead, services, site, whatsappLink } from "@/data/site";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): { service?: string } =>
    typeof search["service"] === "string" ? { service: search["service"] } : {},
  head: () =>
    pageHead(
      "Contact Ray",
      "Request a free electrical estimate from Ray. Call 067 686 7657 or send your project details on WhatsApp. Serving Fourways and Sandton.",
    ),
  component: ContactPage,
});

const OTHER = "Other electrical work";
const serviceOptions = [
  ...services.map((s) => ({ number: s.number, title: s.title })),
  { number: `0${services.length + 1}`, title: OTHER },
];

/** Maps a `?service=` value (title, key or short name) onto one of the choices. */
function matchService(value?: string) {
  const v = value?.trim().toLowerCase();
  if (!v) return "";
  const hit = services.find(
    (s) => s.title.toLowerCase() === v || s.key === v || s.short.toLowerCase() === v,
  );
  if (hit) return hit.title;
  return v === OTHER.toLowerCase() ? OTHER : "";
}

function ContactPage() {
  const search = Route.useSearch();
  return (
    <main>
      <Hero />
      <Lines />
      <Enquiry preset={matchService(search.service)} />
      <section className="ct-end s-ink" aria-label="Service area">
        <div className="wrap ct-end-inner">
          <p className="ct-end-line">
            Serving <em>Fourways</em> &amp; <em>Sandton.</em>
          </p>
          <div className="ct-end-meta label">
            <span className="label-dot">{site.coordinates}</span>
            <span>{facts[0]}</span>
            <span>{facts[3]}</span>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionEnabled()) return;
      const intro = gsap
        .timeline({ paused: true })
        .fromTo(
          ".ct-hero-art .schem-draw",
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 2.6,
            ease: "power2.inOut",
            stagger: { amount: 1.6 },
          },
          0.2,
        )
        .fromTo(".ct-hero-art .schem-dim", { opacity: 0 }, { opacity: 1, duration: 1.2 }, 1)
        .fromTo(
          "[data-fade]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1.4, stagger: 0.07, ease: ease.out },
          0.35,
        );
      const off = onIntro(() => intro.play());
      gsap.to(".ct-hero-art", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
      return off;
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="page-hero s-ink ct-hero">
      <figure className="ct-hero-art draw" aria-hidden="true">
        <SchematicSocket />
        <figcaption className="label" data-fade="">
          Socket outlet — elevation
        </figcaption>
      </figure>
      <div className="wrap ct-hero-inner">
        <div className="page-hero-meta label">
          <span className="label-dot" data-fade="">
            Let’s get to work
          </span>
          <span data-fade="" className="ct-hero-meta-mid">
            Free initial estimates
          </span>
          <span data-fade="">Fourways &amp; Sandton</span>
        </div>
        <Reveal as="h1" load>
          Tell Ray.
          <br />
          <em>Consider it started.</em>
        </Reveal>
        <div className="page-hero-foot">
          <nav className="ct-jump" aria-label="On this page" data-fade="">
            <a href="#lines" className="label">
              <ArrowDown /> Direct lines
            </a>
            <a href="#enquiry" className="label">
              <ArrowDown /> Enquiry form
            </a>
          </nav>
          <p className="lead" data-fade="">
            A small repair or something bigger? Let’s talk about what you need.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Direct lines: full-width rows that light up like a switched circuit. */
function Lines() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionEnabled()) return;
      gsap.fromTo(
        ".ct-row-wrap",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          stagger: 0.1,
          ease: ease.out,
          scrollTrigger: { trigger: ".ct-rows", start: "top 85%", once: true },
        },
      );
    },
    { scope: ref },
  );

  const rows = [
    {
      label: "Call",
      note: "Speak to Ray directly",
      value: site.phone,
      href: `tel:${site.tel}`,
      external: false,
    },
    {
      label: "WhatsApp",
      note: "A message or a photo of the problem",
      value: "Message Ray",
      href: whatsappLink("Hi Ray, I’d like a free estimate."),
      external: true,
    },
    {
      label: "Email",
      note: "For the longer version",
      value: site.email,
      href: `mailto:${site.email}`,
      external: false,
    },
  ];

  return (
    <section ref={ref} className="ct-lines s-ink" id="lines">
      <div className="wrap ct-lines-head">
        <span className="label">A direct line to Ray</span>
        <Reveal as="h2">
          Good work starts
          <br />
          <em>right here.</em>
        </Reveal>
      </div>

      <ul className="ct-rows">
        {rows.map((row) => (
          <li key={row.label} className="ct-row-wrap" data-fade="">
            <a
              className={`ct-row ct-row-${row.label.toLowerCase()}`}
              href={row.href}
              {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span className="wrap ct-row-inner">
                <span className="ct-row-meta">
                  <span className="label">{row.label}</span>
                  <span className="ct-row-note">{row.note}</span>
                </span>
                <span className="ct-row-value">
                  <RollText>{row.value}</RollText>
                </span>
                <span className="ct-row-arrow" aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </span>
            </a>
          </li>
        ))}
        <li className="ct-row-wrap" data-fade="">
          <div className="wrap ct-row-inner ct-row-static">
            <span className="ct-row-meta">
              <span className="label">Based in</span>
              <span className="ct-row-note">Serving Fourways &amp; Sandton</span>
            </span>
            <address className="ct-address">
              {site.address.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
          </div>
        </li>
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The enquiry builds a WhatsApp message. Nothing is submitted or stored here. */
function Enquiry({ preset }: { preset: string }) {
  const [ready, setReady] = useState<string | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = `Hi Ray, I’d like a free estimate.\n\nName: ${data.get("name")}\nPhone: ${data.get("phone")}\nArea: ${data.get("area")}\nService: ${data.get("service")}\n\n${data.get("message")}`;
    const link = whatsappLink(message);
    window.open(link, "_blank", "noopener,noreferrer");
    setReady(link);
  }

  return (
    <section className="ct-enquiry s-bone" id="enquiry">
      <div className="wrap ct-enquiry-grid">
        <div className="ct-intro">
          <span className="label label-dot">Request a free estimate</span>
          <Reveal as="h2">
            Describe
            <br />
            <em>the work.</em>
          </Reveal>
          <p>
            Fill this in and it opens as a ready-to-send WhatsApp message to Ray. Nothing is stored
            on this site, and nothing is sent until you press send.
          </p>
          <ol className="ct-howto">
            <li>
              <span className="label">01</span>Fill in the details
            </li>
            <li>
              <span className="label">02</span>Check the message in WhatsApp
            </li>
            <li>
              <span className="label">03</span>Press send
            </li>
          </ol>
        </div>

        <form className="ct-form" onSubmit={submit}>
          <div className="ct-form-row">
            <label className="ct-field">
              <span className="ct-field-label label">
                <span>Your name</span>
                <span aria-hidden="true">01</span>
              </span>
              <input name="name" placeholder="Full name" required autoComplete="name" />
            </label>
            <label className="ct-field">
              <span className="ct-field-label label">
                <span>Phone number</span>
                <span aria-hidden="true">02</span>
              </span>
              <input
                name="phone"
                placeholder="e.g. 082 123 4567"
                type="tel"
                required
                autoComplete="tel"
              />
            </label>
          </div>

          <label className="ct-field">
            <span className="ct-field-label label">
              <span>Your area</span>
              <span aria-hidden="true">03</span>
            </span>
            <input
              name="area"
              placeholder="Suburb or area"
              required
              autoComplete="address-level2"
            />
          </label>

          <fieldset className="ct-chips" key={preset}>
            <legend className="ct-field-label label">
              <span>What do you need?</span>
              <span aria-hidden="true">04</span>
            </legend>
            <div className="ct-chip-set">
              {serviceOptions.map((option) => (
                <label className="ct-chip" key={option.title}>
                  <input
                    type="radio"
                    name="service"
                    value={option.title}
                    required
                    defaultChecked={option.title === preset}
                  />
                  <span className="ct-chip-num" aria-hidden="true">
                    {option.number}
                  </span>
                  <span>{option.title}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="ct-field">
            <span className="ct-field-label label">
              <span>A little about the job</span>
              <span aria-hidden="true">05</span>
            </span>
            <textarea
              name="message"
              rows={4}
              placeholder="Tell Ray what needs attention…"
              required
            />
          </label>

          <div className="ct-submit">
            <Magnetic strength={0.2}>
              <button type="submit" className="btn btn-ink btn-lg">
                <RollText>Continue in WhatsApp</RollText>
                <ArrowUpRight />
              </button>
            </Magnetic>
            <p className="ct-submit-note">
              Opens WhatsApp with your message ready. Nothing is sent until you press send there.
            </p>
          </div>

          <div
            className="ct-status"
            role="status"
            aria-live="polite"
            data-state={ready ? "ready" : "idle"}
          >
            {ready ? (
              <>
                <i className="ct-status-line" aria-hidden="true" />
                <div className="ct-status-body">
                  <span className="label label-dot">Ready in WhatsApp</span>
                  <p className="ct-status-title">
                    Your message is <em>waiting in WhatsApp.</em>
                  </p>
                  <p className="ct-status-text">
                    Press send there to share it with Ray. If WhatsApp didn’t open, use the link
                    below, or call instead.
                  </p>
                  <div className="ct-status-links">
                    <a
                      href={ready}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="arrow-link"
                    >
                      Open WhatsApp again
                      <span className="arrow-circle">
                        <ArrowUpRight />
                      </span>
                    </a>
                    <a href={`tel:${site.tel}`} className="link-u">
                      Call {site.phone}
                    </a>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}
