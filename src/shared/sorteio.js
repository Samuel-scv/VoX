// Devolve os números de 0 até tamanho-1 em ordem aleatória (para não repetir itens até acabarem).
export function embaralhar(tamanho) {
  const ordem = Array.from({ length: tamanho }, (_, i) => i);
  for (let i = ordem.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ordem[i], ordem[j]] = [ordem[j], ordem[i]];
  }
  return ordem;
}