"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";

export function PortraitFrame({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const frame = frameRef.current;
    if (!frame || event.pointerType === "touch") return;

    const bounds = frame.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    frame.style.setProperty("--portrait-rotate-x", `${-y * 6}deg`);
    frame.style.setProperty("--portrait-rotate-y", `${x * 6}deg`);
    frame.style.setProperty("--portrait-glow-x", `${(x + 0.5) * 100}%`);
    frame.style.setProperty("--portrait-glow-y", `${(y + 0.5) * 100}%`);
  }

  function resetFrame() {
    const frame = frameRef.current;
    if (!frame) return;
    frame.style.setProperty("--portrait-rotate-x", "0deg");
    frame.style.setProperty("--portrait-rotate-y", "0deg");
    frame.style.setProperty("--portrait-glow-x", "50%");
    frame.style.setProperty("--portrait-glow-y", "50%");
  }

  return (
    <div
      ref={frameRef}
      className="portrait-frame"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetFrame}
    >
      <div className="portrait-shadow" aria-hidden="true" />
      <div className="portrait-media">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 80vw, 35vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
