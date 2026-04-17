import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initHomepageAnimations(): () => void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return () => {};

  // 1. Section headlines — fade up
  gsap.utils.toArray<Element>('.section-headline').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      y: 24,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
  });

  // 2. Framework cards — staggered fade in
  const cardsGrid = document.querySelector('.framework-cards-grid');
  if (cardsGrid) {
    gsap.utils.toArray<Element>('.fw-card').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: cardsGrid, start: 'top 80%', once: true },
        y: 32,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        delay: i * 0.1,
      });
    });
  }

  // 3. How It Works steps — sequential slide in from left
  const stepsContainer = document.querySelector('.steps');
  if (stepsContainer) {
    gsap.utils.toArray<Element>('.step').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: stepsContainer, start: 'top 75%', once: true },
        x: -20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        delay: i * 0.15,
      });
    });
  }

  // 4. Comparison cards — fade in from below
  const compSection = document.querySelector('.comparison-section');
  if (compSection) {
    gsap.utils.toArray<Element>('.comparison-col').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: compSection, start: 'top 80%', once: true },
        y: 24,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        delay: i * 0.12,
      });
    });
  }

  return () => {
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
}
