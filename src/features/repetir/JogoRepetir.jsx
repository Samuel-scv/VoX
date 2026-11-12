import { DURACOES } from "./frases.js";

function classeDaPalavra(status, acertou) {
  if (status === "parado") {
    return "text-vox-ink";
  }
  if (acertou) {
    return "text-vox-accent";
  }
  return status === "jogando" ? "text-vox-ink/35" : "text-vox-rec underline decoration-2 underline-offset-4";
}

function mensagem(ratio) {
  if (ratio === 1) {
    return "Perfeito!";
  }
  if (ratio >= 0.8) {
    return "Quase lá!";
  }
  if (ratio >= 0.5) {
    return "Boa tentativa!";
  }
  return "Vamos de novo?";
}

export default function JogoRepetir({ jogo, idiomaOk }) {
  const jogando = jogo.status === "jogando";
  const pouco = jogando && jogo.tempo <= 5;
  const res = jogo.resultado;

  return (
    <div className="flex min-h-64 flex-col gap-6 rounded-2xl border border-vox-ink/10 bg-vox-card p-6">
      <div className="flex items-center justify-between gap-4 text-sm text-vox-ink/60">
        <span>
          Pontos: <strong className="text-vox-ink">{jogo.pontos}</strong>
        </span>
        <span>
          Recorde: <strong className="text-vox-ink">{jogo.recorde}</strong>
        </span>
      </div>

      {!idiomaOk && (
        <p className="rounded-xl border border-vox-rec/40 p-3 text-sm" role="alert">
          As frases são em português. Troque o idioma da fala para Português (Brasil).
        </p>
      )}

      <p className="text-3xl leading-snug font-extrabold tracking-tight sm:text-4xl" aria-live="polite">
        {jogo.frase.split(" ").map((palavra, i) => (
          <span key={i} className={classeDaPalavra(jogo.status, jogo.marcas[i])}>
            {palavra}{" "}
          </span>
        ))}
      </p>

      <div className="flex items-center gap-4">
        <div
          className="h-3 flex-1 overflow-hidden rounded-full bg-vox-ink/10"
          role="progressbar"
          aria-label="Tempo restante"
          aria-valuemin={0}
          aria-valuemax={jogo.duracao}
          aria-valuenow={jogo.tempo}>
          <div
            className={`h-full rounded-full ${jogando ? "transition-[width] duration-1000 ease-linear" : ""} ${pouco ? "bg-vox-rec" : "bg-vox-accent"}`}
            style={{ width: `${(jogo.tempo / jogo.duracao) * 100}%` }}
          />
        </div>
        <span className={`w-14 text-right text-2xl font-extrabold tabular-nums ${pouco ? "text-vox-rec" : ""}`}>{jogo.tempo}s</span>
      </div>

      {jogo.status === "resultado" && res && (
        <div className="rounded-xl bg-vox-bg p-4" aria-live="polite">
          <p className="text-lg font-semibold">{mensagem(res.ratio)}</p>
          <p className="text-sm text-vox-ink/60">
            Você acertou {Math.round(res.ratio * 100)}% das palavras: +{res.ganho} pontos
            {res.bonus > 0 ? ` (com ${res.bonus} de bônus de tempo)` : ""}
          </p>
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-3">
        {jogo.status === "parado" && (
          <>
            <label className="mr-auto flex items-center gap-2 text-sm font-medium">
              Tempo
              <select
                value={jogo.duracao}
                onChange={(e) => jogo.setDuracao(Number(e.target.value))}
                className="rounded-lg border border-vox-ink/20 bg-vox-card px-2 py-1 focus-visible:outline-2 focus-visible:outline-vox-accent">
                {DURACOES.map((d) => (
                  <option key={d} value={d}>
                    {d} segundos
                  </option>
                ))}
              </select>
            </label>
            <button type="button" onClick={jogo.proxima} className="rounded-lg border border-vox-ink/30 px-4 py-2 text-sm font-semibold">
              Trocar frase
            </button>
            <button type="button" onClick={jogo.iniciar} className="rounded-lg bg-vox-accent px-5 py-2 text-sm font-semibold text-vox-on hover:bg-vox-accent-hover">
              Começar rodada
            </button>
          </>
        )}

        {jogando && (
          <button type="button" onClick={jogo.parar} className="ml-auto rounded-lg border border-vox-ink/30 px-4 py-2 text-sm font-semibold">
            Parar rodada
          </button>
        )}

        {jogo.status === "resultado" && (
          <>
            <button type="button" onClick={jogo.iniciar} className="ml-auto rounded-lg border border-vox-ink/30 px-4 py-2 text-sm font-semibold">
              Tentar de novo
            </button>
            <button type="button" onClick={jogo.proxima} className="rounded-lg bg-vox-accent px-5 py-2 text-sm font-semibold text-vox-on hover:bg-vox-accent-hover">
              Próxima frase
            </button>
          </>
        )}
      </div>
    </div>
  );
}