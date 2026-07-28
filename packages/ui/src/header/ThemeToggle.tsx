"use client";

import { useEffect, useState } from "react";
import { MoonIcon } from "../icons/MoonIcon";
import { SunIcon } from "../icons/SunIcon";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove(theme === "dark" ? "light" : "dark");
  root.classList.add(theme);
  localStorage.setItem("theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === "dark"}
      aria-label="다크 모드 전환"
      onClick={toggle}
      suppressHydrationWarning
      className="relative h-6 w-11 shrink-0 rounded-full border border-line bg-wash transition-colors duration-300"
    >
      <span
        suppressHydrationWarning
        className={`absolute top-px flex size-5 items-center justify-center rounded-full border border-line bg-surface text-body transition-all duration-300 ${
          theme === "dark" ? "left-[21px]" : "left-px"
        }`}
      >
        {theme === "dark" ? (
          <MoonIcon className="size-2.5" />
        ) : (
          <SunIcon className="size-2.5" />
        )}
      </span>
    </button>
  );
}
