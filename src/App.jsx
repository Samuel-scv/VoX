import { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useTema, SeletorTema, useRepetir, JogoRepetir, useAdivinhar, JogoAdivinhar, usePalavraProibida, JogoProibida } from "./features/rotas.js";

const LANGUAGES = [
  { code: "pt-BR", label: "Português (Brasil)" },
  { code: "en-US", label: "English (US)" },
  { code: "es-ES", label: "Español" },
];

const MODOS = [
  { id: "ditado", label: "Ditado" },
  { id: "repetir", label: "Jogo de repetir" },
  { id: "adivinhar", label: "Adivinhação" },
  { id: "proibida", label: "Palavra proibida" },
];

function Waveform({ active }) {
  const bars = Array.from({ length: 32 });
  return (
    <div className="flex h-24 items-center gap-1" aria-hidden="true">
      {bars.map((_, i) => (
        <span
          key={i}
          className={`w-1.5 rounded-full transition-colors ${active ? "vox-bar bg-vox-rec" : "bg-vox-accent/30"}`}
          style={{ height: active ? undefined : "8px", animationDuration: `${700 + ((i * 53) % 500)}ms`, animationDelay: `${(i % 8) * 70}ms` }}
        />
      ))}
    </div>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
    </svg>
  );
}

function App() {
  const [lang, setLang] = useState("pt-BR");
  const [copied, setCopied] = useState(false);
  const [modo, setModo] = useState("ditado");
  const tema = useTema();
  const commands = [...tema.commands];

  const { transcript, interimTranscript, listening, resetTranscript, browserSupportsSpeechRecognition, isMicrophoneAvailable } = useSpeechRecognition({ commands });

  const reiniciarEscuta = async () => {
    await SpeechRecognition.abortListening();
    SpeechRecognition.startListening({ continuous: true, language: lang });
  };

  const entradaDoJogo = { falado: `${transcript} ${interimTranscript}`, resetTranscript, startListening: reiniciarEscuta, stopListening: () => SpeechRecognition.stopListening() };
  const jogo = useRepetir({ ...entradaDoJogo, ativo: modo === "repetir" });
  const adivinhar = useAdivinhar({ ...entradaDoJogo, ativo: modo === "adivinhar" });
  const proibida = usePalavraProibida({ ...entradaDoJogo, ativo: modo === "proibida" });

  const mudarModo = (novo) => {
    SpeechRecognition.stopListening();
    resetTranscript();
    setModo(novo);
  };

  const hasText = transcript.trim().length > 0;
  const words = hasText ? transcript.trim().split(/\s+/).length : 0;

  const toggle = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: lang });
    }
  };

  const changeLanguage = async (e) => {
    const next = e.target.value;
    setLang(next);
    if (listening) {
      await SpeechRecognition.abortListening();
      SpeechRecognition.startListening({ continuous: true, language: next });
    }
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const downloadText = () => {
    const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vox-transcricao.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-vox-bg text-vox-ink transition-colors duration-300">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="text-3xl font-extrabold tracking-tight">
          Vo<span className="text-vox-accent">X</span>
        </span>
        <span className="text-sm text-vox-ink/60">Voz para texto no navegador</span>
      </header>

      <main className="mx-auto grid max-w-5xl gap-8 px-6 pb-16 pt-4 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <section className="flex flex-col gap-6">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">Fale e o VoX escreve por você.</h1>

          {!browserSupportsSpeechRecognition ? (
            <p className="rounded-xl border border-vox-rec/40 bg-vox-card p-4 text-sm" role="alert">
              Este navegador não suporta reconhecimento de voz. Abra o VoX no Chrome, Edge ou Safari.
            </p>
          ) : (
            <>
              <div className="flex items-center gap-5">
                <div className="relative">
                  {listening && <span className="absolute inset-0 animate-ping rounded-full bg-vox-rec/40 motion-reduce:hidden" />}
                  <button
                    type="button"
                    onClick={toggle}
                    aria-pressed={listening}
                    aria-label={listening ? "Parar de ouvir" : "Começar a ouvir"}
                    className={`relative flex h-28 w-28 items-center justify-center rounded-full text-vox-on shadow-lg outline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-vox-accent ${
                      listening ? "bg-vox-rec" : "bg-vox-accent hover:bg-vox-accent-hover"
                    }`}>
                    <MicIcon />
                  </button>
                </div>
                <p className="text-lg font-semibold">{listening ? "Ouvindo…" : "Toque para falar"}</p>
              </div>

              <label className="flex flex-col gap-2 text-sm font-medium">
                Idioma da fala
                <select
                  value={lang}
                  onChange={changeLanguage}
                  className="rounded-lg border border-vox-ink/20 bg-vox-card px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-vox-accent">
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </label>

              <SeletorTema theme={tema.theme} aviso={tema.aviso} onChange={tema.applyTheme} />

              {!isMicrophoneAvailable && (
                <p className="rounded-xl border border-vox-rec/40 bg-vox-card p-4 text-sm" role="alert">
                  O VoX não tem acesso ao microfone. Libere a permissão no ícone de cadeado da barra de endereço e tente de novo.
                </p>
              )}
            </>
          )}
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex gap-2" role="tablist" aria-label="Modo do VoX">
            {MODOS.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={modo === m.id}
                onClick={() => mudarModo(m.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${modo === m.id ? "bg-vox-ink text-vox-bg" : "border border-vox-ink/20 hover:bg-vox-ink/5"}`}>
                {m.label}
              </button>
            ))}
          </div>
          <div className="rounded-2xl bg-vox-card p-6 shadow-sm">
            <Waveform active={listening} />
          </div>

          {modo === "ditado" ? (
            <div className="flex min-h-64 flex-col rounded-2xl border border-vox-ink/10 bg-vox-card p-6">
              <p className="flex-1 whitespace-pre-wrap text-lg leading-relaxed" aria-live="polite">
                {hasText || interimTranscript ? (
                  <>
                    {transcript}
                    <span className="text-vox-ink/40">{interimTranscript}</span>
                  </>
                ) : (
                  <span className="text-vox-ink/50">Aperte o microfone e comece a falar. O texto aparece aqui.</span>
                )}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-vox-ink/10 pt-4">
                <span className="mr-auto text-sm text-vox-ink/60">
                  {words} {words === 1 ? "palavra" : "palavras"}
                </span>
                <button
                  type="button"
                  onClick={copyText}
                  disabled={!hasText}
                  className="rounded-lg bg-vox-ink px-4 py-2 text-sm font-semibold text-vox-bg transition-opacity disabled:opacity-30">
                  {copied ? "Copiado" : "Copiar texto"}
                </button>
                <button
                  type="button"
                  onClick={downloadText}
                  disabled={!hasText}
                  className="rounded-lg border border-vox-ink/30 px-4 py-2 text-sm font-semibold transition-opacity disabled:opacity-30">
                  Baixar .txt
                </button>
                <button
                  type="button"
                  onClick={resetTranscript}
                  disabled={!hasText}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-vox-rec transition-opacity disabled:opacity-30">
                  Limpar
                </button>
              </div>
            </div>
          ) : modo === "repetir" ? (
            <JogoRepetir jogo={jogo} idiomaOk={lang === "pt-BR"} />
          ) : modo === "adivinhar" ? (
            <JogoAdivinhar jogo={adivinhar} idiomaOk={lang === "pt-BR"} />
          ) : (
            <JogoProibida jogo={proibida} idiomaOk={lang === "pt-BR"} />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;