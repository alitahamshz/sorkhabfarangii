"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAVIGATION_START_EVENT = "sorkhabfarangi:navigation-start";
const MINIMUM_VISIBLE_DURATION_MS = 700;

export function startGlobalNavigation() {
  window.dispatchEvent(new Event(NAVIGATION_START_EVENT));
}

function shouldStartNavigation(event: MouseEvent, anchor: HTMLAnchorElement) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    anchor.target === "_blank" ||
    anchor.hasAttribute("download")
  ) {
    return false;
  }

  const destination = new URL(anchor.href, window.location.href);
  const current = new URL(window.location.href);
  return (
    destination.origin === current.origin &&
    (destination.pathname !== current.pathname || destination.search !== current.search)
  );
}

export function GlobalNavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationKey = `${pathname}?${searchParams}`;
  const lastNavigationKey = useRef(navigationKey);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    if (lastNavigationKey.current !== navigationKey) {
      lastNavigationKey.current = navigationKey;
      const elapsed = startedAt.current ? Date.now() - startedAt.current : 0;
      const remaining = Math.max(MINIMUM_VISIBLE_DURATION_MS - elapsed, 0);
      const timeout = window.setTimeout(() => {
        startedAt.current = null;
        setIsNavigating(false);
      }, remaining);
      return () => window.clearTimeout(timeout);
    }
  }, [navigationKey]);

  useEffect(() => {
    const startNavigation = () => {
      startedAt.current ??= Date.now();
      setIsNavigating(true);
    };
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href]");
      if (anchor instanceof HTMLAnchorElement && shouldStartNavigation(event, anchor)) {
        startNavigation();
      }
    };

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", startNavigation);
    window.addEventListener(NAVIGATION_START_EVENT, startNavigation);
    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", startNavigation);
      window.removeEventListener(NAVIGATION_START_EVENT, startNavigation);
    };
  }, []);

  useEffect(() => {
    if (!isNavigating) return;
    const timeout = window.setTimeout(() => setIsNavigating(false), 10_000);
    return () => window.clearTimeout(timeout);
  }, [isNavigating]);

  return (
    <div
      aria-busy={isNavigating}
      aria-live="polite"
      className={`fixed inset-0 z-[110] grid place-items-center bg-background/30 p-6 transition-[opacity,backdrop-filter] duration-300 ease-out motion-reduce:transition-none ${
        isNavigating ? "opacity-100 backdrop-blur-[2px]" : "pointer-events-none opacity-0 backdrop-blur-none"
      }`}
      role="status"
    >
      <div
        className={`flex flex-col items-center gap-4 text-primary-500 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
          isNavigating ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0"
        }`}
      >
        <span className="relative grid size-14 place-items-center rounded-full border-4 border-primary-100">
          <span className="size-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </span>
        <span className="text-sm font-medium text-foreground">در حال انتقال…</span>
      </div>
    </div>
  );
}
