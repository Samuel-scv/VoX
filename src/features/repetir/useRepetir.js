import { useEffect, useMemo, useState } from "react";
import { FRASES } from "./frases.js";
import { palavras } from "../../shared/texto.js";
import { compararFrase } from "./comparar.js";

const CHAVE_RECORDE = "vox-repetir-recorde";

function lerRecorde() {
  try {
    return Number(localStorage.getItem(CHAVE_RECORDE)) || 0;
  } catch {
    return 0;
  }
}

function salvarRecorde(valor) {
  try {
    localStorage.setItem(CHAVE_RECORDE, String(valor));
  } catch {
    // sem localStorage (modo privado, por exemplo): o recorde vale só enquanto a página está aberta
  }
}

function sortear(excluir) {
  let i;
  do {
    i = Math.floor(Math.random() * FRASES.length);
  } while (i === excluir && FRASES.length > 1);
  return i;
}

export function useRepetir({ ativo = true, falado, resetTranscript, startListening, stopListening }) {
  const [indice, setIndice] = useState(() => sortear(-1));
  const [duracao, setDuracao] = useState(20);
  const [status, setStatus] = useState("parado"); // parado | jogando | resultado
  const [tempo, setTempo] = useState(20);
  const [pontos, setPontos] = useState(0);
  const [recorde, setRecorde] = useState(lerRecorde);
  const [resultado, setResultado] = useState(null);

  const frase = FRASES[indice];
  const alvo = useMemo(() => palavras(frase), [frase]);
  const acertosAoVivo = useMemo(() => (status === "parado" ? alvo.map(() => false) : compararFrase(alvo, palavras(falado))), [alvo, falado, status]);

  // Depois que a rodada acaba, o resultado fica congelado, mesmo que o navegador ainda mande texto.
  const marcas = status === "resultado" && resultado ? resultado.marcas : acertosAoVivo;
  const ratio = marcas.filter(Boolean).length / alvo.length;

  const finalizar = (tempoRestante) => {
    stopListening();
    const bonus = ratio >= 0.9 ? tempoRestante * 5 : 0;
    const ganho = Math.round(ratio * 100) + bonus;
    setResultado({ marcas: acertosAoVivo, ratio, bonus, ganho });
    setPontos((p) => p + ganho);
    if (ganho > recorde) {
      setRecorde(ganho);
      salvarRecorde(ganho);
    }
    setStatus("resultado");
  };

  // Saiu da aba do jogo no meio da rodada: cancela a rodada.
  useEffect(() => {
    if (!ativo && status === "jogando") {
      setStatus("parado");
    }
  }, [ativo]);

  // Relógio: perde 1 segundo por tick enquanto a rodada está rolando.
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
      finalizar(0);
    }
  }, [status, tempo]);

  // Falou a frase inteira antes do tempo acabar.
  useEffect(() => {
    if (status === "jogando" && ratio === 1) {
      finalizar(tempo);
    }
  }, [status, ratio]);

  const iniciar = () => {
    resetTranscript();
    setResultado(null);
    setTempo(duracao);
    setStatus("jogando");
    startListening();
  };

  const proxima = () => {
    stopListening();
    resetTranscript();
    setResultado(null);
    setIndice((i) => sortear(i));
    setStatus("parado");
  };

  return {
    frase,
    marcas,
    ratio,
    status,
    tempo: status === "parado" ? duracao : tempo,
    duracao,
    setDuracao,
    pontos,
    recorde,
    resultado,
    iniciar,
    parar: () => finalizar(tempo),
    proxima,
  };
}