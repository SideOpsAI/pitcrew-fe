"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const FALLBACK_STAGGER_MS = 55;
const MAX_STAGGER_MS = 260;

function applyDelay(element: HTMLElement, index: number) {
  const attrDelay = Number(element.dataset.scrollFadeDelay);
  const delay = Number.isFinite(attrDelay)
    ? Math.max(0, attrDelay)
    : Math.min(index * FALLBACK_STAGGER_MS, MAX_STAGGER_MS);
  element.style.transitionDelay = `${delay}ms`;
}

export function ScrollFadeManager() {
  const pathname = usePathname();

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-fade]"),
    );

    if (nodes.length === 0) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      for (const node of nodes) {
        node.classList.add("is-visible");
      }
      return;
    }

    document.documentElement.classList.add("has-scroll-fade");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    nodes.forEach((node, index) => {
      node.classList.remove("is-visible");
      applyDelay(node, index);
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
