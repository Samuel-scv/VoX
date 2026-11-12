import { useEffect, useMemo, useState } from "react";
import { CHARADAS, DURACAO, INTERVALO_DICA } from "./charadas.js";
import { palavras, contemFrase } from "../../shared/texto.js";

function embaralhar() {
  const ordem = CHARADAS.map((_, i) => i);
  for (let i = ordem.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ordem[i], ordem[j]] = [ordem[j], ordem[i]];
  }
  return ordem;
}

export function useAdivinhar({ ativo = true, falado, resetTranscript, startListening, stopListening }) {
  const [ordem, setOrdem] = useState(embaralhar);
  const [pos, setPos] = useState(0);
  const [status, setStatus] = useState("parado"); // parado | jogando | resultado
  const [tempo, setTempo] = useState(DURACAO);
  const [pontos, setPontos] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [rodadas, setRodadas] = useState(0);
  const [resultado, setResultado] = useState(null);

  const charada = CHARADAS[ordem[pos]];

  // Uma dica nova a cada INTERVALO_DICA segundos.
  const decorrido = DURACAO - tempo;
  const dicasVisiveis = status === "parado" ? 0 : Math.min(charada.dicas.length, 1 + Math.floor(decorrido / INTERVALO_DICA));

  const acertou = useMemo(() => {
    if (status !== "jogando") {
      return false;
    }
    const ditas = palavras(falado);
    return charada.respostas.some((r) => contemFrase(ditas, r));
  }, [status, falado, charada]);

  const finalizar = (motivo) => {
    stopListening();
    const ganhou = motivo === "acertou";
    const ganho = ganhou ? 100 - 30 * (dicasVisiveis - 1) + tempo : 0;
    setResultado({ motivo, ganho, dicasUsadas: dicasVisiveis });
    setPontos((p) => p + ganho);
    setRodadas((r) => r + 1);
    if (ganhou) {
      setAcertos((a) => a + 1);
    }
    setStatus("resultado");
  };

  // Saiu da aba do jogo no meio da rodada: cancela a rodada.
  useEffect(() => {
    if (!ativo && status === "jogando") {
      setStatus("parado");
    }
  }, [ativo]);

  // Relógio.
  useEffect(() => {
    if (status !== "jogando") {
      return;
    }
    const id = setInterval(() => setTempo((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  // Acabou o tempo.
  useEffect(() => {
    if (status === "jogando" && tempo <= 0) {
      finalizar("tempo");
    }
  }, [status, tempo]);

  // Disse a resposta certa.
  useEffect(() => {
    if (acertou) {
      finalizar("acertou");
    }
  }, [acertou]);

  const comecar = () => {
    resetTranscript();
    setResultado(null);
    setTempo(DURACAO);
    setStatus("jogando");
    startListening();
  };

  // Vai para a próxima charada e já começa a rodada.
  const proxima = () => {
    if (pos + 1 >= ordem.length) {
      setOrdem(embaralhar());
      setPos(0);
    } else {
      setPos(pos + 1);
    }
    comecar();
  };

  return {
    charada,
    dicasVisiveis,
    status,
    tempo,
    duracao: DURACAO,
    pontos,
    acertos,
    rodadas,
    resultado,
    ouvido: falado.trim(),
    iniciar: comecar,
    proxima,
    desistir: () => finalizar("desistiu"),
  };
}