// Recorde guardado no navegador (localStorage), com fallback quando ele não está disponível.
export function lerRecorde(chave) {
  try {
    return Number(localStorage.getItem(chave)) || 0;
  } catch {
    return 0;
  }
}

export function salvarRecorde(chave, valor) {
  try {
    localStorage.setItem(chave, String(valor));
  } catch {
    // sem localStorage (modo privado, por exemplo): o recorde vale só enquanto a página está aberta
  }
}