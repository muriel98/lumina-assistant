import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { ArrowUp, Sparkles, Mic } from "lucide-react";
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

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

// Number of messages required for the orb to reach its smallest, top-fixed state
const SHRINK_AFTER = 6;

function Index() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  // Progress 0 → 1 as conversation grows
  const progress = clamp(messages.length / SHRINK_AFTER, 0, 1);

  // Orb scales from 1 → 0.32 as progress grows
  const orbScale = 1 - progress * (1 - 0.32);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="relative h-screen w-full overflow-hidden flex flex-col justify-center">
      {/* Ambient background accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, oklch(0.92 0.1 50 / 0.5), transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, oklch(0.94 0.08 35 / 0.5), transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Top bar */}
      <header className="relative z-20 flex-shrink-0 flex items-center justify-between px-8 py-6">
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

      {/* Orb stage — animates from centered to small-fixed-on-top */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 z-10 flex justify-center"
        style={{
          // top moves from ~38% (centered area) to ~12% (pinned near header)
          top: `${38 - progress * 26}%`,
          transform: `translate(-50%, -50%)`,
          transition:
            "top 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <EnergyOrb scale={orbScale} />
      </div>

      {/* Welcome text — only when no conversation */}
      {!hasMessages && (
        <div
          className="relative z-10 flex-shrink-0 text-center animate-fade-in pointer-events-none"
          style={{ marginTop: "12rem", marginBottom: "12rem" }}
        >
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
            Hola.
          </h1>
          <p className="mt-3 text-base md:text-lg font-light text-muted-foreground">
            ¿En qué puedo ayudarte hoy?
          </p>
        </div>
      )}

      {/* Messages — scroll area, bottom-anchored, fade-out near top */}
      {hasMessages && (
        <div
          ref={scrollRef}
          className="relative z-10 flex-1 overflow-y-auto px-6"
          style={{
            // Mask: fully transparent at top → opaque ~40% down. Stronger as orb shrinks/rises.
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, transparent 18%, black 42%, black 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, transparent 18%, black 42%, black 100%)",
          }}
        >
          <div
            className="flex flex-col justify-end min-h-full pb-4"
            style={{ paddingTop: `${10 + progress * 16}rem` }}
          >
            <div className="mx-auto w-full max-w-xl space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`text-sm md:text-base px-4 py-2 rounded-2xl max-w-[80%] animate-fade-in ${
                    msg.role === "user"
                      ? "ml-auto bg-primary/10 text-foreground"
                      : "mr-auto bg-muted text-muted-foreground"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      )}

      {/* Bottom input */}
      <footer className="relative z-10 flex-shrink-0 px-6 pb-16 pt-4">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!value.trim()) return;

            const userMessage = value;
            setMessages((prev) => [
              ...prev,
              { role: "user", content: userMessage },
            ]);
            setValue("");

            try {
              const res = await fetch(
                "https://murielgg.app.n8n.cloud/webhook/dba585f4-889e-4a1c-97ec-48eaef2cdae9",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ message: userMessage }),
                },
              );
              const reply = await res.text();
              setMessages((prev) => [
                ...prev,
                { role: "assistant", content: reply },
              ]);
            } catch {
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: "Ha ocurrido un error al responder.",
                },
              ]);
            }
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
            type="button"
            aria-label="Iniciar conversación de voz"
            title="Iniciar conversación de voz"
            className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-secondary-foreground ring-1 ring-border transition hover:scale-105 hover:bg-accent"
          >
            <Mic className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <button
            type="submit"
            disabled={!value.trim()}
            aria-label="Enviar"
            className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_oklch(0.78_0.16_40/0.5)] transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
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
