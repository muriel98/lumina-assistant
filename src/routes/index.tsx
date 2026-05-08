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

const SHRINK_AFTER = 6;

function Index() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  const progress = clamp(messages.length / SHRINK_AFTER, 0, 1);
  const orbScale = 1 - progress * (1 - 0.32);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="relative h-screen w-full overflow-hidden flex flex-col">

      {/* Background */}
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

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2 text-sm text-foreground/80">
          <Sparkles className="h-4 w-4 text-primary" />
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

      {/* ORB (⬅️ AQUÍ ESTÁ LA CLAVE) */}
      <div
        className="pointer-events-none absolute left-1/2 z-10 flex justify-center"
        style={{
          top: `${60 - progress * 42}%`, // 👈 BAJADO
          transform: "translate(-50%, -50%)",
          transition:
            "top 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <EnergyOrb scale={orbScale} />
      </div>

      {/* CONTENIDO INICIAL */}
      {!hasMessages && (
        <div className="flex-1 flex flex-col items-center justify-end pb-32 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-foreground">
            Hola.
          </h1>
          <p className="mt-3 text-base md:text-lg text-muted-foreground">
            ¿En qué puedo ayudarte hoy?
          </p>
        </div>
      )}

      {/* MENSAJES */}
      {hasMessages && (
        <div className="flex-1 overflow-y-auto px-6">
          <div
            className="flex flex-col justify-end min-h-full pb-6"
            style={{ paddingTop: `${12 + progress * 14}rem` }}
          >
            <div className="mx-auto max-w-xl space-y-3 w-full">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                    msg.role === "user"
                      ? "ml-auto bg-primary/10"
                      : "mr-auto bg-muted"
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

      {/* INPUT */}
      <footer className="px-6 pb-16 pt-4">
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
                }
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
          className="mx-auto max-w-xl flex items-center gap-2 rounded-full bg-card/70 px-5 py-3 backdrop-blur-xl ring-1 ring-border"
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Pregúntale a Aura…"
            className="flex-1 bg-transparent outline-none"
          />

          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full bg-secondary"
          >
            <Mic className="h-4 w-4" />
          </button>

          <button
            type="submit"
            disabled={!value.trim()}
            className="grid h-9 w-9 place-items-center rounded-full bg-primary"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </form>
      </footer>
    </main>
  );
}
