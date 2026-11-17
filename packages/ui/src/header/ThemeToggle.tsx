"use client";

import { MoonIcon } from "../icons/MoonIcon";
import { SunIcon } from "../icons/SunIcon";

// theme.css의 0.2s 전환이 끝난 뒤에 클래스를 떼야 중간에 끊기지 않는다.
const TRANSITION_MS = 300;

let transitionTimer: ReturnType<typeof setTimeout> | undefined;

function toggleTheme() {
  const root = document.documentElement;
  const next = root.classList.contains("dark") ? "light" : "dark";

  root.classList.add("theme-transition");
  root.classList.remove(next === "dark" ? "light" : "dark");
  root.classList.add(next);
  localStorage.setItem("theme", next);

  clearTimeout(transitionTimer);
  transitionTimer = setTimeout(() => root.classList.remove("theme-transition"), TRANSITION_MS);
}

export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="다크 모드 전환"
      className="flex size-10 shrink-0 items-center justify-center rounded-md text-strong transition-colors duration-200 hover:bg-line"
    >
      <SunIcon className="size-[22px] dark:hidden" />
      <MoonIcon className="hidden size-[22px] dark:block" />
    </button>
  );
}
