import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { ArrowUp, Sparkles, Mic, MicOff } from "lucide-react";
import { EnergyOrb } from "@/components/EnergyOrb";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Aura — Asistente inteligente" },
      {
        name: "description",
        content:
          "Aura es un asistente virtual de próxima generación.",
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
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const hasMessages = messages.length > 0;
  const progress = clamp(messages.length / SHRINK_AFTER, 0, 1);
  const orbScale = 1 - progress * (1 - 0.32);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const res = await fetch(
        "https://murielgg.app.n8n.cloud/webhook/dba585f4-889e-4a1c-97ec-48eaef2cdae9",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ message: text, voice: voiceMode }),
        }
      );

      const reply = await res.text();

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

      if (voiceMode) {
  speakText(reply);
}
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Ha ocurrido un error al responder." },
      ]);
    }
  };

const speakText = (text: string) => {
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";

  const loadVoicesAndSpeak = () => {
    const voices = speechSynthesis.getVoices();
    const spanish = voices.find(v => v.lang.startsWith("es"));

    if (spanish) utterance.voice = spanish;

    speechSynthesis.speak(utterance);
  };

  // ✅ clave: esperar a que carguen las voces
  if (speechSynthesis.getVoices().length === 0) {
    speechSynthesis.onvoiceschanged = loadVoicesAndSpeak;
  } else {
    loadVoicesAndSpeak();
  }

  utterance.onstart = () => setIsSpeaking(true);
  utterance.onend = () => setIsSpeaking(false);
};


  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz. Usa Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () =>{
      setIsListening(true);
      setVoiceMode(true);
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      if (!transcript.trim()) {
    sendMessage("El usuario no ha dicho nada, responde con algo como: ¿Podrías repetirlo?");
  } else {
    sendMessage(transcript);
  }
    };

    recognition.onerror = () => {
      setIsListening(false);
      sendMessage("El usuario no ha dicho nada, responde con algo como: ¿Podrías repetirlo?");
    }
      
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <main className="relative h-screen w-full overflow-hidden flex flex-col">

      {/* Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full opacity-60"
        style={{
          background: "radial-gradient(circle, oklch(0.92 0.1 50 / 0.5), transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full opacity-50"
        style={{
          background: "radial-gradient(circle, oklch(0.94 0.08 35 / 0.5), transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Header */}
      <header className="relative z-20 flex-shrink-0 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2 text-sm text-foreground/80">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-medium">Aura</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {isSpeaking ? "Hablando…" : "En línea"}
        </div>
      </header>

      {/* ORB */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 z-10 flex justify-center"
        style={{
          top: `${68 - progress * 45}%`,
          transform: "translate(-50%, -50%)",
          transition: "top 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <EnergyOrb scale={orbScale} />
      </div>

      {/* TEXTO INICIAL */}
      {!hasMessages && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-end pb-40 text-center pointer-events-none">
          <div className="mt-48">
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
        <div
          ref={scrollRef}
          className="relative z-10 flex-1 overflow-y-auto px-6"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, transparent 30%, black 55%, black 100%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, transparent 30%, black 55%, black 100%)",
          }}
        >
          <div
            className="flex flex-col justify-end min-h-full pb-4"
            style={{ paddingTop: `${12 + progress * 16}rem` }}
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

      {/* INPUT */}
      <footer className="relative z-10 flex-shrink-0 px-6 pb-10 pt-6">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!value.trim()) return;
            const userMessage = value;
            setValue("");
            setVoiceMode(false);
            await sendMessage(userMessage);
          }}
          className="mx-auto flex w-full max-w-xl items-center gap-2 rounded-full bg-card/70 px-5 py-3 shadow-soft backdrop-blur-xl ring-1 ring-border transition focus-within:ring-2 focus-within:ring-primary/40"
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={isListening ? "Escuchando…" : "Pregúntale a Aura…"}
            className="flex-1 bg-transparent text-sm md:text-base font-light text-foreground placeholder:text-muted-foreground/70 outline-none"
          />

          <button
            type="button"
            onClick={toggleListening}
            className={`grid h-9 w-9 place-items-center rounded-full transition ${
              isListening
                ? "bg-red-400 text-white animate-pulse"
                : "bg-secondary text-foreground"
            }`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          <button
            type="submit"
            disabled={!value.trim()}
            className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-3 text-center text-[11px] text-muted-foreground/70">
          Aura escucha en silencio · respuestas claras
        </p>
      </footer>

    </main>
  );
}
