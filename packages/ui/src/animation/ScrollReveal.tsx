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
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          const rootTop = entry.rootBounds?.top ?? 0;
          const isAbove = entry.boundingClientRect.bottom <= rootTop;

          if (!entry.isIntersecting && !isAbove) return;
          currentObserver.unobserve(target);

          if (isAbove) {
            target.style.removeProperty("opacity");
            return;
          }

          const animation = target.animate(
            [
              { opacity: 0, transform: "translateY(20px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: 600,
              easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
              fill: "both",
            },
          );

          animation.onfinish = () => {
            target.style.removeProperty("opacity");
            animation.cancel();
          };
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
    );

    const targets = element.querySelectorAll<HTMLElement>("[data-reveal]");
    targets.forEach((target) => {
      target.style.opacity = "0";
      observer.observe(target);
    });

    return () => {
      observer.disconnect();
      targets.forEach((target) => target.style.removeProperty("opacity"));
    };
  }, []);

  return (
    <div ref={root} className="contents">
      {children}
    </div>
  );
}