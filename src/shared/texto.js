// Minúsculas, sem acentos e sem espaços nas pontas.
export function norm(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Quebra um texto em palavras simples (sem acento, sem pontuação).
export function palavras(texto) {
  return norm(texto)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function distancia(a, b) {
  const tab = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) {
    tab[0][j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const custo = a[i - 1] === b[j - 1] ? 0 : 1;
      tab[i][j] = Math.min(tab[i - 1][j] + 1, tab[i][j - 1] + 1, tab[i - 1][j - 1] + custo);
    }
  }
  return tab[a.length][b.length];
}

// O navegador erra letras com frequência: palavras longas aceitam 1 letra de diferença.
export function iguais(a, b) {
  if (a === b) {
    return true;
  }
  return Math.min(a.length, b.length) >= 5 && distancia(a, b) <= 1;
}

// Verifica se a frase (ou palavra) aparece, em sequência, no que foi falado.
export function contemFrase(faladoPalavras, frase) {
  const alvo = palavras(frase);
  for (let i = 0; i + alvo.length <= faladoPalavras.length; i++) {
    if (alvo.every((p, k) => iguais(p, faladoPalavras[i + k]))) {
      return true;
    }
  }
  return false;
}