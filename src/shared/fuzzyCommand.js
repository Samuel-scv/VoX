// Comando de voz com correspondência aproximada, reutilizável por qualquer funcionalidade.
export function fuzzyCommand(frase, acao, interim = true) {
  return { command: frase, callback: acao, isFuzzyMatch: true, fuzzyMatchingThreshold: 0.7, bestMatchOnly: true, matchInterim: interim };
}