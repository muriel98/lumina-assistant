import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { ArrowUp, Sparkles, Mic } from "lucide-react";
import { EnergyOrb } from "@/components/EnergyOrb";

export const Route = createFileRoute("/")({
  component: Index,
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

      {/* HEADER */}
      <header className="relative z-20 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2 text-sm text-foreground/80">
          <Sparkles className="h-4 w-4 text-primary" />
          Aura
        </div>
        <span className="text-xs text-muted-foreground">En línea</span>
      </header>

      {/* ORB */}
      <div
        className="pointer-events-none absolute left-1/2 z-10 flex justify-center"
        style={{
          top: `${58 - progress * 40}%`, // 👈 ligeramente más arriba que antes
          transform: "translate(-50%, -50%)",
          transition: "top 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <EnergyOrb scale={orbScale} />
      </div>

      {/* CONTENIDO INICIAL */}
      {!hasMessages && (
        <div className="flex-1 flex flex-col items-center justify-end text-center pb-40">
          {/* 👇 separación real respecto al orb */}
          <div className="mt-40">
            <h1 className="text-4xl md:text-5xl font-light text-foreground">
              Hola.
            </h1>
            <p className="mt-3 text-base md:text-lg text-muted-foreground">
              ¿En qué puedo ayudarte hoy?
            </p>
          </div>
        </div>
      )}

      {/* MENSAJES */}
      {hasMessages && (
        <div className="flex-1 overflow-y-auto px-6">
          <div className="flex flex-col justify-end min-h-full pb-6">
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
      <footer className="px-6 pb-24 pt-4"> {/* 👈 MÁS ABAJO */}
        <form className="mx-auto max-w-xl flex items-center gap-2 rounded-full bg-card/70 px-5 py-3 backdrop-blur-xl ring-1 ring-border">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Pregúntale a Aura…"
            className="flex-1 bg-transparent outline-none"
          />
          <button type="button" className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
            <Mic className="h-4 w-4" />
          </button>
          <button type="submit" className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
            <ArrowUp className="h-4 w-4" />
          </button>
        </form>
      </footer>

    </main>
  );
}
``
