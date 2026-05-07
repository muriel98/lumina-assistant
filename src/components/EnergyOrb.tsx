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

interface OrbitParticle {
  id: number;
  radius: number;
  size: number;
  duration: number;
  delay: number;
  reverse: boolean;
}

export function EnergyOrb() {
  const [hovered, setHovered] = useState(false);

  const sparkles = useMemo<Particle[]>(() => {
    const rng = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: 28 }, (_, i) => {
      const angle = rng(i + 1) * Math.PI * 2;
      const dist = 140 + rng(i + 50) * 200;
      return {
        id: i,
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        size: 2 + rng(i + 100) * 4,
        delay: rng(i + 200) * 6,
        duration: 4 + rng(i + 300) * 5,
        opacity: 0.4 + rng(i + 400) * 0.5,
      };
    });
  }, []);

  const orbiters = useMemo<OrbitParticle[]>(
    () => [
      { id: 1, radius: 150, size: 5, duration: 18, delay: 0, reverse: false },
      { id: 2, radius: 180, size: 3, duration: 24, delay: -6, reverse: true },
      { id: 3, radius: 210, size: 4, duration: 30, delay: -12, reverse: false },
      { id: 4, radius: 130, size: 3, duration: 22, delay: -3, reverse: true },
    ],
    []
  );

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 520, height: 520 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Outer diffuse glow */}
      <div
        className="absolute inset-0 rounded-full animate-breathe-glow pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.15 240 / 0.35) 0%, oklch(0.85 0.1 235 / 0.15) 35%, transparent 65%)",
          filter: "blur(40px)",
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
              background: "oklch(0.95 0.05 235)",
              boxShadow: "0 0 8px oklch(0.85 0.12 235 / 0.9)",
              ["--tx" as string]: `${p.tx}px`,
              ["--ty" as string]: `${p.ty}px`,
              ["--op" as string]: p.opacity,
              animation: `sparkle ${p.duration}s ease-in-out ${p.delay}s infinite, float-slow ${p.duration * 1.5}s ease-in-out infinite`,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Orbiting particles */}
      {orbiters.map((o) => (
        <div
          key={o.id}
          className="absolute left-1/2 top-1/2 pointer-events-none"
          style={{
            width: 0,
            height: 0,
            animation: `orbit ${o.duration}s linear ${o.delay}s infinite ${o.reverse ? "reverse" : "normal"}`,
            ["--r" as string]: `${o.radius}px`,
          } as React.CSSProperties}
        >
          <span
            className="block rounded-full"
            style={{
              width: o.size,
              height: o.size,
              background: "oklch(1 0 0)",
              boxShadow:
                "0 0 12px oklch(0.78 0.15 240 / 0.9), 0 0 24px oklch(0.78 0.15 240 / 0.5)",
            }}
          />
        </div>
      ))}

      {/* Shimmer rings */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 240,
          height: 240,
          border: "1px solid oklch(0.78 0.15 240 / 0.3)",
          animation: "shimmer-ring 5s ease-out infinite",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 240,
          height: 240,
          border: "1px solid oklch(0.78 0.15 240 / 0.25)",
          animation: "shimmer-ring 5s ease-out 2.5s infinite",
        }}
      />

      {/* The orb */}
      <div
        className="relative rounded-full bg-gradient-orb shadow-orb animate-breathe transition-transform duration-700 ease-out"
        style={{
          width: 240,
          height: 240,
          transform: hovered ? "scale(1.06)" : undefined,
        }}
      >
        {/* Inner highlight */}
        <div className="absolute inset-0 rounded-full bg-gradient-orb-inner" />
        {/* Specular */}
        <div
          className="absolute rounded-full"
          style={{
            top: "14%",
            left: "20%",
            width: "40%",
            height: "30%",
            background:
              "radial-gradient(ellipse at center, oklch(1 0 0 / 0.85) 0%, transparent 70%)",
            filter: "blur(6px)",
          }}
        />
      </div>
    </div>
  );
}
