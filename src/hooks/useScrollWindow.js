import { useEffect, useState } from "react";

/**
 * Tracks the visible scroll band of a container.
 * Used to virtualize widget bodies: with hundreds of widgets only the ones in
 * (or near) view mount their contents. Layout maths rather than
 * IntersectionObserver, so it is deterministic and testable.
 */
export default function useScrollWindow(ref, buffer = 600) {
  const [band, setBand] = useState({ top: 0, bottom: Infinity });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let frame = 0;
    const measure = () => {
      frame = 0;
      setBand((prev) => {
        const top = el.scrollTop - buffer;
        const bottom = el.scrollTop + el.clientHeight + buffer;
        if (prev.top === top && prev.bottom === bottom) return prev;
        return { top, bottom };
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    el.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(schedule) : null;
    if (ro) ro.observe(el);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (ro) ro.disconnect();
    };
  }, [ref, buffer]);

  return band;
}
