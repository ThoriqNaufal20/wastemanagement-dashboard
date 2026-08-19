"use client";

import { useEffect, useState } from "react";

interface ScrambleTextProps {
  text: string;
  play?: boolean;
  className?: string;
  totalDurationMs?: number;
  glyphIntervalMs?: number;
  onSettled?: () => void;
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=-";

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

/**
 * Teks yang "decode" dari karakter acak jadi teks asli, menetap
 * berurutan kiri ke kanan. Dijamin selalu berakhir di teks yang benar
 * (ada hard-stop di totalDurationMs, tidak bisa nyangkut di tengah).
 */
export function ScrambleText({
  text,
  play = true,
  className = "",
  totalDurationMs = 700,
  glyphIntervalMs = 40,
  onSettled,
}: ScrambleTextProps) {
  const [displayChars, setDisplayChars] = useState<string[]>(() => text.split(""));

  useEffect(() => {
    let cancelled = false;
    let frameId: number;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (!play || prefersReducedMotion) {
      setDisplayChars(text.split(""));
      onSettled?.();
      return;
    }

    const chars = text.split("");
    const startTime = performance.now();
    let lastGlyphSwap = 0;

    function tick(now: number) {
      if (cancelled) return;
      const elapsed = now - startTime;

      // Hard-stop: begitu waktu total habis, paksa jadi teks final dan
      // HENTIKAN loop. Ini yang mencegah animasi "nyangkut" acak.
      if (elapsed >= totalDurationMs) {
        setDisplayChars(chars);
        onSettled?.();
        return;
      }

      const shouldSwap = now - lastGlyphSwap > glyphIntervalMs;
      if (shouldSwap) {
        lastGlyphSwap = now;
        setDisplayChars(
          chars.map((char, i) => {
            if (char === " ") return " ";
            const settleAt = (i / chars.length) * totalDurationMs;
            return elapsed >= settleAt ? char : randomGlyph();
          })
        );
      }

      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, play, totalDurationMs, glyphIntervalMs]);

  return (
    <span aria-label={text} className={className}>
      <span aria-hidden="true" style={{ display: "inline-flex" }}>
        {displayChars.map((char, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              width: char === " " ? "0.35em" : "0.62em",
              textAlign: "center",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}
