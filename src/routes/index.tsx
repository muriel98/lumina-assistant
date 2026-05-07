import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";
import { EnergyOrb } from "@/components/EnergyOrb";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Aura — Asistente inteligente" },
      {
        name: "description",
        content:
          "Aura es un asistente virtual de próxima generación. Calmado, elegante y siempre presente.",
      },
    ],
  }),
});

function Index() {
  const [value, setValue] = useState("");

  return (
    <main className="relative min-h-screen w-full overflow-hidden flex flex-col">
      {/* Ambient background accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, oklch(0.9 0.08 240 / 0.5), transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, oklch(0.92 0.06 220 / 0.5), transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2 text-sm tracking-wide text-foreground/80">
          <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.5} />
          <span className="font-medium">Aura</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          En línea
        </div>
      </header>

      {/* Center stage */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 -mt-8">
        <EnergyOrb />

        <div className="mt-2 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
            Hola.
          </h1>
          <p className="mt-3 text-base md:text-lg font-light text-muted-foreground">
            ¿En qué puedo ayudarte hoy?
          </p>
        </div>
      </section>

      {/* Bottom input */}
      <footer className="relative z-10 px-6 pb-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setValue("");
          }}
          className="mx-auto flex w-full max-w-xl items-center gap-2 rounded-full bg-card/70 px-5 py-3 shadow-soft backdrop-blur-xl ring-1 ring-border transition focus-within:ring-2 focus-within:ring-primary/40"
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Pregúntale a Aura…"
            className="flex-1 bg-transparent text-sm md:text-base font-light text-foreground placeholder:text-muted-foreground/70 outline-none"
            aria-label="Mensaje para Aura"
          />
          <button
            type="submit"
            disabled={!value.trim()}
            aria-label="Enviar"
            className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_oklch(0.78_0.15_240/0.5)] transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2} />
          </button>
        </form>
        <p className="mt-3 text-center text-[11px] tracking-wide text-muted-foreground/70">
          Aura escucha en silencio · respuestas claras y serenas
        </p>
      </footer>
    </main>
  );
}
