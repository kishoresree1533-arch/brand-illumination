import { useEffect, useRef } from "react";

export function SpotlightCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let raf = 0;
    let tx = -100;
    let ty = -100;
    let dx = -100, dy = -100;
    let rx = -100, ry = -100;
    let isMoving = false;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      isMoving = true;
    };

    const tick = () => {
      if (isMoving) {
        // Inner dot follows mouse closely
        dx += (tx - dx) * 0.25;
        dy += (ty - dy) * 0.25;

        // Outer ring follows with inertia (trailing effect)
        rx += (tx - rx) * 0.1;
        ry += (ty - ry) * 0.1;

        dot.style.transform = `translate3d(${dx - 4}px, ${dy - 4}px, 0)`;
        ring.style.transform = `translate3d(${rx - 16}px, ${ry - 16}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="hidden md:block"
      style={{
        pointerEvents: "none",
        position: "fixed",
        inset: 0,
        zIndex: 99999,
      }}
    >
      {/* Outer trailing ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 h-8 w-8 rounded-full border border-[#c9a84c]/50"
        style={{
          pointerEvents: "none",
          transform: "translate3d(-100px, -100px, 0)",
          boxShadow: "0 0 10px rgba(201, 168, 76, 0.15)",
        }}
      />
      {/* Inner solid dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 h-2 w-2 rounded-full bg-[#c9a84c]"
        style={{
          pointerEvents: "none",
          transform: "translate3d(-100px, -100px, 0)",
          boxShadow: "0 0 8px rgba(201, 168, 76, 0.4)",
        }}
      />
    </div>
  );
}
