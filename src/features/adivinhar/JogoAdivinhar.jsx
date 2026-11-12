import { INTERVALO_DICA } from "./charadas.js";

function titulo(res) {
  if (res.motivo === "acertou") {
    return "Acertou!";
  }
  return res.motivo === "tempo" ? "O tempo acabou!" : "Sem problemas, essa era difícil.";
}

export default function JogoAdivinhar({ jogo, idiomaOk }) {
  const jogando = jogo.status === "jogando";
  const res = jogo.resultado;
  const pouco = jogando && jogo.tempo <= 5;
  const resposta = jogo.charada.respostas[0];
  const visiveis = jogo.status === "resultado" ? jogo.charada.dicas.length : jogo.dicasVisiveis;
  const proximaDica = jogando && jogo.dicasVisiveis < jogo.charada.dicas.length ? INTERVALO_DICA - ((jogo.duracao - jogo.tempo) % INTERVALO_DICA) : null;

  return (
    <div className="flex min-h-64 flex-col gap-6 rounded-2xl border border-vox-ink/10 bg-vox-card p-6">
      <div className="flex items-center justify-between gap-4 text-sm text-vox-ink/60">
        <span>
          Pontos: <strong className="text-vox-ink">{jogo.pontos}</strong>
        </span>
        <span>
          Acertos:{" "}
          <strong className="text-vox-ink">
            {jogo.acertos}/{jogo.rodadas}
          </strong>
        </span>
      </div>

      {!idiomaOk && (
        <p className="rounded-xl border border-vox-rec/40 p-3 text-sm" role="alert">
          As charadas são em português. Troque o idioma da fala para Português (Brasil).
        </p>
      )}

      <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Quem sou eu?</h2>

      {jogo.status === "parado" ? (
        <p className="text-vox-ink/70">
          Clique em começar e diga a resposta em voz alta. A cada {INTERVALO_DICA} segundos aparece uma dica nova, e quanto menos dicas você precisar, mais pontos ganha.
        </p>
      ) : (
        <ol className="flex flex-col gap-2" aria-live="polite">
          {jogo.charada.dicas.slice(0, visiveis).map((dica, i) => (
            <li key={i} className={`flex gap-3 text-lg ${i === visiveis - 1 && jogando ? "font-semibold" : "text-vox-ink/70"}`}>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-vox-accent text-sm font-bold text-vox-on">{i + 1}</span>
              {dica}
            </li>
          ))}
        </ol>
      )}

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

      {jogando && (
        <p className="text-sm text-vox-ink/60">
          {jogo.ouvido ? `Ouvi: “${jogo.ouvido}”` : "Estou ouvindo… diga a resposta."}
          {proximaDica && ` Próxima dica em ${proximaDica}s.`}
        </p>
      )}

      {jogo.status === "resultado" && res && (
        <div className="rounded-xl bg-vox-bg p-4" aria-live="polite">
          <p className="text-lg font-semibold">{titulo(res)}</p>
          <p className="text-sm text-vox-ink/60">
            {res.motivo === "acertou"
              ? `A resposta era “${resposta}”. Você usou ${res.dicasUsadas} ${res.dicasUsadas === 1 ? "dica" : "dicas"} e ganhou +${res.ganho} pontos.`
              : `A resposta era “${resposta}”.`}
          </p>
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-3">
        {jogo.status === "parado" && (
          <button type="button" onClick={jogo.iniciar} className="ml-auto rounded-lg bg-vox-accent px-5 py-2 text-sm font-semibold text-vox-on hover:bg-vox-accent-hover">
            Começar
          </button>
        )}

        {jogando && (
          <button type="button" onClick={jogo.desistir} className="ml-auto rounded-lg border border-vox-ink/30 px-4 py-2 text-sm font-semibold">
            Desistir
          </button>
        )}

        {jogo.status === "resultado" && (
          <button type="button" onClick={jogo.proxima} className="ml-auto rounded-lg bg-vox-accent px-5 py-2 text-sm font-semibold text-vox-on hover:bg-vox-accent-hover">
            Próxima charada
          </button>
        )}
      </div>
    </div>
  );
}