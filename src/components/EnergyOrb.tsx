import { useMemo, useState } from "react";

interface Particle {
  id: number;
  tx: number;
  ty: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

const ORB_SIZE = 150; // was 240 — ~37% smaller
const STAGE = 520;

export function EnergyOrb() {
  const [hovered, setHovered] = useState(false);

  const sparkles = useMemo<Particle[]>(() => {
    const rng = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: 22 }, (_, i) => {
      const angle = rng(i + 1) * Math.PI * 2;
      const dist = 130 + rng(i + 50) * 200;
      return {
        id: i,
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        size: 1.5 + rng(i + 100) * 2.5,
        delay: rng(i + 200) * 8,
        duration: 7 + rng(i + 300) * 6,
        opacity: 0.25 + rng(i + 400) * 0.4,
      };
    });
  }, []);

  // Calm pulsing waves — staggered for continuous flow
  const waves = [0, 1.6, 3.2, 4.8, 6.4];

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: STAGE, height: STAGE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Outer atmospheric glow — very soft */}
      <div
        className="absolute inset-0 rounded-full animate-breathe-glow pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.85 0.08 240 / 0.18) 0%, oklch(0.9 0.05 235 / 0.08) 40%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Sparkles */}
      {sparkles.map((p) => (
        <span
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
          style={
            {
              width: p.size,
              height: p.size,
              background: "oklch(0.96 0.03 235)",
              boxShadow: "0 0 6px oklch(0.88 0.08 235 / 0.7)",
              ["--tx" as string]: `${p.tx}px`,
              ["--ty" as string]: `${p.ty}px`,
              ["--op" as string]: p.opacity,
              animation: `sparkle ${p.duration}s ease-in-out ${p.delay}s infinite, float-slow ${p.duration * 1.6}s ease-in-out infinite`,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Pulsing energy waves — thin, soft, organic */}
      {waves.map((delay, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: ORB_SIZE * 1.15,
            height: ORB_SIZE * 1.15,
            border: "1px solid oklch(0.78 0.1 240 / 0.6)",
            animation: `shimmer-ring 8s ease-out ${delay}s infinite`,
          }}
        />
      ))}

      {/* The orb — small, translucent, ethereal */}
      <div
        className="relative rounded-full bg-gradient-orb shadow-orb animate-breathe transition-transform duration-1000 ease-in-out"
        style={{
          width: ORB_SIZE,
          height: ORB_SIZE,
          backdropFilter: "blur(2px)",
          transform: hovered ? "scale(1.04)" : undefined,
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-orb-inner" />
        <div
          className="absolute rounded-full"
          style={{
            top: "16%",
            left: "22%",
            width: "36%",
            height: "26%",
            background:
              "radial-gradient(ellipse at center, oklch(1 0 0 / 0.6) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />
      </div>
    </div>
  );
}
