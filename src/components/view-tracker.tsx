"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const seen = new Set<string>();

export function ViewTracker({ locale }: { locale: string }) {
  const pathname = usePathname();
  const localeRef = useRef(locale);

  useEffect(() => {
    localeRef.current = locale;
    const key = `${localeRef.current}:${pathname}`;
    if (seen.has(key)) return;
    seen.add(key);
    const id = setTimeout(() => {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          locale: localeRef.current,
          referrer: document.referrer,
        }),
        keepalive: true,
      }).catch(() => {});
    }, 1200);
    return () => clearTimeout(id);
  }, [pathname, locale]);

  return null;
}