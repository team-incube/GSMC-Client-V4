"use client";

import { useLayoutEffect, useRef, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";

export function ScrollLink({ href, onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || !href?.startsWith("#")) return;

    const target = document.getElementById(href.slice(1));
    if (!target) return;

    event.preventDefault();
    window.history.pushState(null, "", href);
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }

  return <a {...props} href={href} onClick={handleClick} />;
}

export function ScrollReveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target as HTMLElement;
        target.style.opacity = "1";
        target.style.transform = "translateY(0)";
        currentObserver.unobserve(target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });

    element.querySelectorAll<HTMLElement>("[data-reveal]").forEach((target) => {
      target.style.opacity = "0";
      target.style.transform = "translateY(20px)";
      target.style.transition = "opacity 600ms cubic-bezier(0.2, 0.7, 0.2, 1), transform 600ms cubic-bezier(0.2, 0.7, 0.2, 1)";
      target.style.transitionDelay = `${target.dataset.revealDelay ?? 0}ms`;
      observer.observe(target);
    });

    return () => observer.disconnect();
  }, []);

  return <div ref={root} className="contents">{children}</div>;
}