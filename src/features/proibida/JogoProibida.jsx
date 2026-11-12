import { DURACOES } from "./desafios.js";

function mensagem(res, proibida) {
  if (res.motivo === "pego") {
    return `Você disse “${proibida}” depois de ${res.palavras} palavras: +${res.ganho} pontos.`;
  }
  if (res.motivo === "sobreviveu") {
    const bonus = res.bonus > 0 ? ` (com ${res.bonus} de bônus)` : " (fale pelo menos 10 palavras para ganhar o bônus)";
    return `Você falou ${res.palavras} palavras sem dizer “${proibida}”: +${res.ganho} pontos${bonus}.`;
  }
  return `Rodada encerrada com ${res.palavras} palavras: +${res.ganho} pontos.`;
}

export default function JogoProibida({ jogo, idiomaOk }) {
  const jogando = jogo.status === "jogando";
  const res = jogo.resultado;
  const pouco = jogando && jogo.tempo <= 5;
  const pego = res?.motivo === "pego";
  const { tema, proibida } = jogo.desafio;

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
          As palavras são em português. Troque o idioma da fala para Português (Brasil).
        </p>
      )}

      <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{tema}</h2>

      <div
        className={`flex flex-col items-center gap-1 rounded-xl border-2 border-vox-rec p-4 text-center ${pego ? "animate-pulse bg-vox-rec text-vox-on" : ""}`}
        aria-live="assertive">
        <span className="text-sm font-medium">{pego ? "BUZZ! Você disse a palavra proibida" : "Palavra proibida"}</span>
        <strong className={`text-4xl font-extrabold tracking-wide uppercase ${pego ? "" : "text-vox-rec"}`}>{proibida}</strong>
      </div>

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

      {jogo.status === "parado" && (
        <p className="text-vox-ink/70">Fale sobre o tema sem dizer a palavra proibida. Quanto mais você falar, mais pontos ganha, e se aguentar até o fim leva um bônus.</p>
      )}

      {jogando && (
        <p className="text-sm text-vox-ink/60">
          Palavras ditas: <strong className="text-vox-ink">{jogo.palavrasDitas}</strong>
          {jogo.ouvido ? ` · Ouvi: “${jogo.ouvido}”` : " · Pode começar a falar…"}
        </p>
      )}

      {jogo.status === "resultado" && res && (
        <div className="rounded-xl bg-vox-bg p-4" aria-live="polite">
          <p className="text-lg font-semibold">{pego ? "Caiu na armadilha!" : res.motivo === "sobreviveu" ? "Sobreviveu!" : "Fim da rodada"}</p>
          <p className="text-sm text-vox-ink/60">{mensagem(res, proibida)}</p>
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
            <button type="button" onClick={jogo.trocar} className="rounded-lg border border-vox-ink/30 px-4 py-2 text-sm font-semibold">
              Trocar tema
            </button>
            <button type="button" onClick={jogo.iniciar} className="rounded-lg bg-vox-accent px-5 py-2 text-sm font-semibold text-vox-on hover:bg-vox-accent-hover">
              Começar
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
            <button type="button" onClick={jogo.novo} className="rounded-lg bg-vox-accent px-5 py-2 text-sm font-semibold text-vox-on hover:bg-vox-accent-hover">
              Novo desafio
            </button>
          </>
        )}
      </div>
    </div>
  );
}