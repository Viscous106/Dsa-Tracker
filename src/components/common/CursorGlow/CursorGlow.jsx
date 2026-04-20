/**
 * CursorGlow.jsx
 *
 * A radial spotlight that follows the mouse cursor.
 * Creates a premium, "hand-crafted" feel that's impossible to achieve
 * with AI-generated static layouts.
 */
import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf;
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let tx = cx, ty = cy;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    // Lerp for smooth trailing effect
    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.left = `${cx}px`;
      el.style.top  = `${cy}px`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="gy-cursor-glow" aria-hidden="true" />;
}
