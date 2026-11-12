// Toca uma sequência de tons: cada nota é [frequência em Hz, início em s, duração em s].
function tocarTons(notas, tipo) {
  try {
    const Contexto = window.AudioContext || window.webkitAudioContext;
    const ctx = new Contexto();
    notas.forEach(([freq, inicio, duracao]) => {
      const osc = ctx.createOscillator();
      const volume = ctx.createGain();
      osc.type = tipo;
      osc.frequency.value = freq;
      volume.gain.value = 0.15;
      osc.connect(volume).connect(ctx.destination);
      osc.start(ctx.currentTime + inicio);
      osc.stop(ctx.currentTime + inicio + duracao);
    });
    setTimeout(() => ctx.close(), 1500);
  } catch {
    // sem áudio disponível: o aviso visual já basta
  }
}

export function tocarAlarme() {
  tocarTons(
    [
      [220, 0, 0.2],
      [180, 0.25, 0.2],
      [140, 0.5, 0.4],
    ],
    "square",
  );
}

export function tocarSucesso() {
  tocarTons(
    [
      [523, 0, 0.15],
      [659, 0.15, 0.15],
      [784, 0.3, 0.3],
    ],
    "triangle",
  );
}