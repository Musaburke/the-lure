// Smooth, inertial page scrolling (Lenis): a wheel flick glides and settles instead of stopping
// dead, and everything driven by the scroll (the lens, the gauge, the water) glides with it.
// Native scrolling stays underneath, so keyboard, touch and scrollbar work as normal; touch is left
// native. Off for reduced motion.
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export const lenis = matchMedia('(prefers-reduced-motion: reduce)').matches
  ? null
  : new Lenis({ autoRaf: true, anchors: true, lerp: 0.075, allowNestedScroll: true });
