import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLenis } from "@/lib/motion";
import {
  Magnetic,
  Reveal,
  RollText,
  useScrollState,
  useSpotlight,
} from "@/components/motion/Motion";
import { nav, site, whatsappLink } from "@/data/site";

/* A filament bulb: the glass, two leads and a glowing coil. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 44" fill="none" className={className} aria-hidden="true">
      <circle cx="20" cy="17" r="14" stroke="currentColor" strokeWidth="1" />
      <path d="M16 43V21M24 43V21" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path
        d="M16 21c0-3.5 2-3.5 2 0s2 3.5 2 0 2-3.5 2 0 2 3.5 2 0"
        stroke="var(--filament)"
        strokeWidth="1.25"
        strokeLinecap="round"
        className="schem-accent"
      />
    </svg>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { scrolled, hidden } = useScrollState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "hdr",
          scrolled && "is-scrolled",
          hidden && !open && "is-hidden",
          open && "is-open",
        )}
      >
        <Link to="/" className="hdr-brand" aria-label="Ray Electrical, home">
          <BrandMark />
          <span>
            Ray <em>Electrical</em>
          </span>
        </Link>
        <nav className="hdr-nav" aria-label="Main">
          {nav.slice(1).map((link) => (
            <Link key={link.to} to={link.to} activeProps={{ className: "is-active" }}>
              <RollText>{link.label}</RollText>
            </Link>
          ))}
        </nav>
        <div className="hdr-actions">
          <a href={`tel:${site.tel}`} className="hdr-phone">
            {site.phone}
          </a>
          <Link to="/contact" className="btn btn-filament btn-sm">
            <RollText>Free estimate</RollText>
          </Link>
          <button
            type="button"
            className="hdr-menu"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span className="hdr-menu-icon" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      <div
        id="site-menu"
        className={cn("menu", open && "is-open")}
        inert={!open}
        aria-hidden={!open}
      >
        <nav className="menu-nav" aria-label="Menu">
          {nav.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              activeProps={{ className: "is-active" }}
              activeOptions={{ exact: true }}
              style={{ "--i": i } as CSSProperties}
              onClick={() => setOpen(false)}
            >
              <span className="menu-idx">0{i + 1}</span>
              <span className="menu-label">{link.label}</span>
            </Link>
          ))}
        </nav>
        <div className="menu-foot">
          <div>
            <span className="label">Call</span>
            <a href={`tel:${site.tel}`}>{site.phone}</a>
          </div>
          <div>
            <span className="label">WhatsApp</span>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              Message Ray
            </a>
          </div>
          <div>
            <span className="label">Email</span>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        </div>
      </div>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="ftr s-ink">
      <div className="ftr-inner">
        <div className="wrap">
          <div className="ftr-top">
            <p className="ftr-ask">
              Something need <em>attention?</em>
            </p>
            <div className="ftr-cols">
              <div>
                <span className="label">Talk</span>
                <a href={`tel:${site.tel}`} className="link-u">
                  {site.phone}
                </a>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-u"
                >
                  WhatsApp
                </a>
                <a href={`mailto:${site.email}`} className="link-u">
                  Email
                </a>
              </div>
              <div>
                <span className="label">Based in</span>
                {site.address.map((line) => (
                  <span key={line} style={{ display: "block" }}>
                    {line}
                  </span>
                ))}
              </div>
              <div>
                <span className="label">Pages</span>
                {nav.slice(1).map((link) => (
                  <Link key={link.to} to={link.to} className="link-u">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div>
          <Reveal as="p" type="chars" className="ftr-word" start="top 98%" stagger={0.03}>
            Ray <em>Electrical</em>
          </Reveal>
          <div className="wrap">
            <div className="ftr-legal label">
              <span>© {new Date().getFullYear()} Ray Electrical</span>
              <span>{site.coordinates}</span>
              <button
                type="button"
                onClick={() =>
                  getLenis()
                    ? getLenis()?.scrollTo(0)
                    : window.scrollTo({ top: 0, behavior: "smooth" })
                }
              >
                Back to top ↑
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* Closing call to action shared by every page. */
export function ClosingCta({ title, lede }: { title?: ReactNode; lede?: string }) {
  const ref = useSpotlight<HTMLElement>();
  return (
    <section ref={ref} className="cta s-ink">
      <div className="wrap">
        <span className="label label-dot">Free initial estimates</span>
        <Reveal as="h2" className="cta-title">
          {title ?? (
            <>
              Let’s get your
              <br />
              power <em>right.</em>
            </>
          )}
        </Reveal>
        <p className="cta-lede">
          {lede ??
            "A quick call, a WhatsApp message or a photo of the problem is all it takes to start."}
        </p>
        <div className="cta-actions">
          <Magnetic>
            <a
              href={whatsappLink("Hi Ray, I’d like a free estimate.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-filament btn-lg"
            >
              <RollText>WhatsApp Ray</RollText>
              <ArrowUpRight />
            </a>
          </Magnetic>
          <Magnetic>
            <a href={`tel:${site.tel}`} className="btn btn-ghost btn-lg">
              <RollText>{`Call ${site.phone}`}</RollText>
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
