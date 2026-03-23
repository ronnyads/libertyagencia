import { useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export function useMagnetic(strength = 0.3, radius = 80) {
  const ref = useRef<HTMLElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 200, damping: 20 });
  const y = useSpring(rawY, { stiffness: 200, damping: 20 });

  const canHover = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!canHover || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < radius) {
      rawX.set(dx * strength);
      rawY.set(dy * strength);
    }
  };

  const onLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return { ref, x, y, onMove, onLeave };
}
