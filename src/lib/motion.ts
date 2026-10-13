import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import type Lenis from "lenis";

const isBrowser = typeof window !== "undefined";

if (isBrowser) {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 1.2 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const ease = {
  out: "expo.out",
  inOut: "expo.inOut",
  soft: "power3.out",
  // Mirrors --ease-out-quint in styles.css.
  quint: "power4.out",
};

/** True when motion is enabled for this visit: set by the inline script in the root shell. */
export function motionEnabled() {
  return isBrowser && document.documentElement.classList.contains("motion");
}

export function finePointer() {
  return isBrowser && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/* Smooth scroll instance, owned by <SmoothScroll />. */
let lenis: Lenis | null = null;
export function setLenis(instance: Lenis | null) {
  lenis = instance;
}
export function getLenis() {
  return lenis;
}
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else if (isBrowser) window.scrollTo(0, 0);
}

/* The first-visit intro (preloader) gates hero animations. */
let introDone = !isBrowser;
const introListeners = new Set<() => void>();
export function markIntroDone() {
  if (introDone) return;
  introDone = true;
  introListeners.forEach((fn) => fn());
  introListeners.clear();
}
/** Runs `fn` once the intro has finished (immediately if it already has). Returns an unsubscribe. */
export function onIntro(fn: () => void) {
  if (introDone || !isBrowser || !document.documentElement.classList.contains("intro")) {
    introDone = true;
    fn();
    return () => {};
  }
  introListeners.add(fn);
  return () => introListeners.delete(fn);
}
