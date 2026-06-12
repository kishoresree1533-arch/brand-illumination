import { useEffect, useRef } from "react";

export function SpotlightCursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx, y = ty;
    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    const tick = () => {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12;
      el.style.transform = `translate3d(${x - 240}px, ${y - 240}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div
      className="hidden md:block"
      style={{
        pointerEvents: "none",
        position: "fixed",
        inset: 0,
        zIndex: 60,
      }}
    >
      <div
        ref={ref}
        className="h-[480px] w-[480px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.82 0.16 88 / 0.08), oklch(0.82 0.16 88 / 0.03) 50%, transparent 70%)",
          filter: "blur(10px)",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
