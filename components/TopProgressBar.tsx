"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const ROUTE_LOADING_EVENT = "fc-food-route-start";

export function triggerTopProgress() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ROUTE_LOADING_EVENT));
  }
}

function ProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const trickleTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAt = useRef<number>(0);
  const activeRouteKey = useRef(`${pathname}?${searchParams.toString()}`);

  function clearTimers() {
    if (trickleTimer.current) clearInterval(trickleTimer.current);
    if (finishTimer.current) clearTimeout(finishTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }

  function startBar() {
    clearTimers();
    startedAt.current = Date.now();
    setVisible(true);
    setProgress((prev) => (prev > 20 && prev < 92 ? prev : 24));

    trickleTimer.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        const step = prev < 55 ? 12 : prev < 80 ? 6 : 2;
        return Math.min(92, prev + step);
      });
    }, 140);
  }

  function completeBar() {
    if (trickleTimer.current) clearInterval(trickleTimer.current);
    const elapsed = Date.now() - startedAt.current;
    const remainingMinTime = Math.max(0, 420 - elapsed);

    finishTimer.current = setTimeout(() => {
      setProgress(100);
      hideTimer.current = setTimeout(() => {
        setVisible(false);
        hideTimer.current = setTimeout(() => {
          setProgress(0);
        }, 250);
      }, 240);
    }, remainingMinTime);
  }

  useEffect(() => {
    const nextKey = `${pathname}?${searchParams.toString()}`;
    if (activeRouteKey.current !== nextKey) {
      activeRouteKey.current = nextKey;
      if (startedAt.current > 0) {
        completeBar();
      }
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    function handleRouteStart() {
      startBar();
    }

    function handleDocumentClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || anchor.target === "_blank") {
        return;
      }

      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;

        const currentUrl = new URL(window.location.href);
        if (
          url.pathname === currentUrl.pathname &&
          url.search === currentUrl.search
        ) {
          return;
        }

        startBar();
      } catch {
        return;
      }
    }

    window.addEventListener(ROUTE_LOADING_EVENT, handleRouteStart);
    document.addEventListener("click", handleDocumentClick);

    return () => {
      clearTimers();
      window.removeEventListener(ROUTE_LOADING_EVENT, handleRouteStart);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed top-0 left-0 right-0 z-[9999] h-1 pointer-events-none transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        style={{ width: `${progress}%` }}
        className="h-full bg-gradient-to-r from-amber-300 via-orange-500 to-red-600 shadow-[0_0_14px_rgba(249,115,22,0.9)] rounded-r-full transition-all duration-150 ease-out"
      />
    </div>
  );
}

export default function TopProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarInner />
    </Suspense>
  );
}