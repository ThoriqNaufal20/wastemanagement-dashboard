"use client";

import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface FullPageScrollProps {
  children: React.ReactNode;
  transitionMs?: number;
}

const FullPageScrollContext = createContext<((index: number) => void) | null>(null);

/** Dipakai di dalam section manapun untuk lompat ke section lain, misal
 * tombol "Tentang Kami" di hero yang lompat ke section About Us. */
export function useFullPageGoTo() {
  const goTo = useContext(FullPageScrollContext);
  return goTo ?? (() => {});
}

export function FullPageScroll({ children, transitionMs = 750 }: FullPageScrollProps) {
  const sections = Children.toArray(children).filter(isValidElement);
  const total = sections.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touchStartY = useRef(0);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(total - 1, index));
      if (clamped === activeIndex || isAnimating) return;
      setIsAnimating(true);
      setActiveIndex(clamped);
      window.setTimeout(() => setIsAnimating(false), transitionMs);
    },
    [activeIndex, isAnimating, total, transitionMs]
  );

  useEffect(() => {
    sectionRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === activeIndex) {
        el.style.zIndex = "20";
        el.style.transition = "none";
        el.style.transform = "translateY(-100%)";
        void el.offsetHeight;
        requestAnimationFrame(() => {
          el.style.transition = `transform ${transitionMs}ms cubic-bezier(0.16, 1, 0.3, 1)`;
          el.style.transform = "translateY(0)";
        });
      } else {
        el.style.zIndex = "10";
        el.style.transition = "none";
        el.style.transform = "translateY(100%)";
      }
    });
  }, [activeIndex, transitionMs]);

  useEffect(() => {
    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 20) return;
      goTo(activeIndex + (e.deltaY > 0 ? 1 : -1));
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        goTo(activeIndex + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goTo(activeIndex - 1);
      }
    }
    function handleTouchStart(e: TouchEvent) {
      touchStartY.current = e.touches[0].clientY;
    }
    function handleTouchEnd(e: TouchEvent) {
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 50) return;
      goTo(activeIndex + (delta > 0 ? 1 : -1));
    }

    const el = containerRef.current;
    el?.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKey);
    el?.addEventListener("touchstart", handleTouchStart);
    el?.addEventListener("touchend", handleTouchEnd);
    return () => {
      el?.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKey);
      el?.removeEventListener("touchstart", handleTouchStart);
      el?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeIndex, goTo]);

  return (
    <FullPageScrollContext.Provider value={goTo}>
      <div ref={containerRef} className="fixed inset-0 overflow-hidden bg-background">
        {sections.map((section, i) => (
          <div
            key={i}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            className="absolute inset-0 overflow-y-auto"
          >
            {section}
          </div>
        ))}

        <div className="fixed right-5 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-3">
          {sections.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Ke section ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                i === activeIndex
                  ? "scale-125 bg-primary"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>
    </FullPageScrollContext.Provider>
  );
}
