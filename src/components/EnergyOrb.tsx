import { useMemo, useState } from "react";

interface Sparkle {
  id: number;
  tx: number;
  ty: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

interface Orbiter {
  id: number;
  radius: number;
  size: number;
  duration: number;
  delay: number;
  reverse: boolean;
}

const ORB_SIZE = 140;
const STAGE = 560;

// Heartbeat tempo (must match CSS animation duration)
const BEAT = 3.6;

export function EnergyOrb() {
  const [hovered, setHovered] = useState(false);

  const sparkles = useMemo<Sparkle[]>(() => {
    const rng = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: 14 }, (_, i) => {
      const angle = rng(i + 1) * Math.PI * 2;
      const dist = 110 + rng(i + 50) * 170;
      return {
        id: i,
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        size: 1.5 + rng(i + 100) * 2,
        delay: rng(i + 200) * 8,
        duration: 8 + rng(i + 300) * 6,
        opacity: 0.3 + rng(i + 400) * 0.4,
      };
    });
  }, []);

  // Orbits — concentric, always visible, very subtle
  const orbits = [
    { r: 110, op: 0.35 },
    { r: 150, op: 0.28 },
    { r: 195, op: 0.22 },
    { r: 240, op: 0.16 },
  ];

  // Particles riding the orbits
  const orbiters: Orbiter[] = [
    { id: 0, radius: 110, size: 4, duration: 22, delay: 0,    reverse: false },
    { id: 1, radius: 150, size: 3, duration: 30, delay: 4,    reverse: true  },
    { id: 2, radius: 195, size: 3.5, duration: 38, delay: 1.5, reverse: false },
    { id: 3, radius: 240, size: 2.5, duration: 46, delay: 3,   reverse: true  },
  ];

  // Pulse waves synced to heartbeat
  const waves = [0, BEAT * 0.5, BEAT, BEAT * 1.5];

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: STAGE, height: STAGE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Outer warm atmospheric glow */}
      <div
        className="absolute inset-0 rounded-full animate-heartbeat-glow pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.85 0.12 40 / 0.22) 0%, oklch(0.9 0.08 50 / 0.1) 40%, transparent 70%)",
          filter: "blur(55px)",
          animationDuration: `${BEAT}s`,
        }}
      />

      {/* Orbits — concentric rings */}
      {orbits.map((o, i) => (
        <div
          key={`orbit-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={
            {
              width: o.r * 2,
              height: o.r * 2,
              border: `1px solid oklch(0.75 0.1 45 / ${o.op})`,
              ["--op" as string]: o.op,
              animation: `orbit-pulse ${BEAT}s ease-in-out ${i * 0.15}s infinite`,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Pulse waves — soft expanding rings */}
      {waves.map((delay, i) => (
        <div
          key={`wave-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: ORB_SIZE * 1.2,
            height: ORB_SIZE * 1.2,
            border: "1px solid oklch(0.78 0.14 40 / 0.55)",
            animation: `pulse-wave ${BEAT * 2}s ease-out ${delay}s infinite`,
          }}
        />
      ))}

      {/* Floating sparkles */}
      {sparkles.map((p) => (
        <span
          key={`s-${p.id}`}
          className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
          style={
            {
              width: p.size,
              height: p.size,
              background: "oklch(0.92 0.12 55)",
              boxShadow: "0 0 6px oklch(0.85 0.16 45 / 0.75)",
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
        <span
          key={`o-${o.id}`}
          className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
          style={
            {
              width: o.size,
              height: o.size,
              marginLeft: -o.size / 2,
              marginTop: -o.size / 2,
              background: "oklch(0.88 0.16 50)",
              boxShadow: "0 0 10px oklch(0.82 0.18 40 / 0.85)",
              ["--r" as string]: `${o.radius}px`,
              animation: `${o.reverse ? "orbit-reverse" : "orbit"} ${o.duration}s linear ${o.delay}s infinite`,
            } as React.CSSProperties
          }
        />
      ))}

      {/* The core — warm, vivid center fading to soft edges */}
      <div
        className="relative rounded-full bg-gradient-orb shadow-orb animate-heartbeat transition-transform duration-1000 ease-in-out"
        style={{
          width: ORB_SIZE,
          height: ORB_SIZE,
          backdropFilter: "blur(1px)",
          transform: hovered ? "scale(1.04)" : undefined,
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-orb-inner" />
        {/* Inner hot center — the heartbeat focus */}
        <div
          className="absolute rounded-full"
          style={{
            top: "30%",
            left: "30%",
            width: "40%",
            height: "40%",
            background:
              "radial-gradient(circle, oklch(0.82 0.2 30 / 0.7) 0%, transparent 70%)",
            filter: "blur(6px)",
          }}
        />
      </div>
    </div>
  );
}
