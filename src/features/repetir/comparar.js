import { iguais } from "../../shared/texto.js";

// Devolve, para cada palavra da frase, se ela foi dita na ordem certa (maior subsequência comum).
export function compararFrase(alvo, falado) {
  const n = alvo.length;
  const m = falado.length;
  const tab = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (iguais(alvo[i - 1], falado[j - 1])) {
        tab[i][j] = tab[i - 1][j - 1] + 1;
      } else {
        tab[i][j] = Math.max(tab[i - 1][j], tab[i][j - 1]);
      }
    }
  }

  const acertos = Array(n).fill(false);
  let i = n;
  let j = m;
  while (i > 0 && j > 0) {
    if (iguais(alvo[i - 1], falado[j - 1]) && tab[i][j] === tab[i - 1][j - 1] + 1) {
      acertos[i - 1] = true;
      i--;
      j--;
    } else if (tab[i - 1][j] >= tab[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return acertos;
}