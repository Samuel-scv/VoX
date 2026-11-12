import { useEffect, useMemo, useState } from "react";
import { DESAFIOS } from "./desafios.js";
import { palavras, contemExata } from "../../shared/texto.js";
import { embaralhar } from "../../shared/sorteio.js";
import { lerRecorde, salvarRecorde } from "../../shared/recorde.js";
import { tocarAlarme, tocarSucesso } from "../../shared/som.js";

const CHAVE_RECORDE = "vox-proibida-recorde";
const MIN_PALAVRAS_BONUS = 10;

export function usePalavraProibida({ ativo = true, falado, resetTranscript, startListening, stopListening }) {
  const [ordem, setOrdem] = useState(() => embaralhar(DESAFIOS.length));
  const [pos, setPos] = useState(0);
  const [duracao, setDuracao] = useState(30);
  const [status, setStatus] = useState("parado"); // parado | jogando | resultado
  const [tempo, setTempo] = useState(30);
  const [pontos, setPontos] = useState(0);
  const [recorde, setRecorde] = useState(() => lerRecorde(CHAVE_RECORDE));
  const [resultado, setResultado] = useState(null);

  const desafio = DESAFIOS[ordem[pos]];

  // Disse a palavra proibida (ou o plural dela)?
  const pego = useMemo(() => status === "jogando" && contemExata(palavras(falado), desafio.proibida), [status, falado, desafio]);

  const finalizar = (motivo) => {
    stopListening();
    const total = palavras(falado).length;
    // Só vale falar: sobreviver em silêncio não dá bônus.
    const bonus = motivo === "sobreviveu" && total >= MIN_PALAVRAS_BONUS ? 50 : 0;
    const ganho = motivo === "sobreviveu" ? total * 5 + bonus : total * 2;
    setResultado({ motivo, palavras: total, bonus, ganho });
    setPontos((p) => p + ganho);
    if (ganho > recorde) {
      setRecorde(ganho);
      salvarRecorde(CHAVE_RECORDE, ganho);
    }
    setStatus("resultado");
    if (motivo === "pego") {
      tocarAlarme();
    } else if (motivo === "sobreviveu") {
      tocarSucesso();
    }
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

  // Acabou o tempo sem cair na armadilha.
  useEffect(() => {
    if (status === "jogando" && tempo <= 0) {
      finalizar("sobreviveu");
    }
  }, [status, tempo]);

  // Caiu na armadilha.
  useEffect(() => {
    if (pego) {
      finalizar("pego");
    }
  }, [pego]);

  const iniciar = () => {
    resetTranscript();
    setResultado(null);
    setTempo(duracao);
    setStatus("jogando");
    startListening();
  };

  const avancar = () => {
    if (pos + 1 >= ordem.length) {
      setOrdem(embaralhar(DESAFIOS.length));
      setPos(0);
    } else {
      setPos(pos + 1);
    }
  };

  // Sorteia outro desafio sem começar a rodada (tela de preparação).
  const trocar = () => {
    stopListening();
    resetTranscript();
    setResultado(null);
    avancar();
    setStatus("parado");
  };

  // Sorteia outro desafio e já começa a rodada, ouvindo.
  const novo = () => {
    avancar();
    iniciar();
  };

  return {
    desafio,
    status,
    tempo: status === "parado" ? duracao : tempo,
    duracao,
    setDuracao,
    pontos,
    recorde,
    resultado,
    palavrasDitas: status === "jogando" ? palavras(falado).length : 0,
    ouvido: falado.trim(),
    iniciar,
    trocar,
    novo,
    parar: () => finalizar("parou"),
  };
}