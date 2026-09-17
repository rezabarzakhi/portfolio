"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 end-6 z-40 grid size-11 place-items-center rounded-xl border border-white/10 bg-[#27374d]/80 text-gray-200 shadow-2xl backdrop-blur-md transition-all hover:bg-[#526d82]/80 hover:text-white"
      aria-label="بازگشت به بالا"
    >
      <ArrowUp size={19} />
    </button>
  );
}