"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let raf: number;

    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx - 3}px,${my - 3}px)`;
    };

    const animate = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.transform = `translate(${rx - 18}px,${ry - 18}px)`;
      raf = requestAnimationFrame(animate);
    };

    const onEnter = () => ring.classList.add("!scale-[2.5]", "!opacity-40");
    const onLeave = () => ring.classList.remove("!scale-[2.5]", "!opacity-40");

    window.addEventListener("mousemove", move);
    document.querySelectorAll("a,button,[data-cursor]").forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    raf = requestAnimationFrame(animate);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-violet-500 rounded-full pointer-events-none z-[9997] hidden md:block mix-blend-difference"
        style={{ willChange: "transform" }} />
      <div ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 border border-violet-500/50 rounded-full pointer-events-none z-[9996] transition-[transform,opacity,scale] duration-300 hidden md:block"
        style={{ willChange: "transform" }} />
    </>
  );
}
