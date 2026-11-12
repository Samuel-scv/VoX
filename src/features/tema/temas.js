export const THEMES = {
  claro: { bg: "#EEF0F7", card: "#FFFFFF", ink: "#1B1F3B", accent: "#3D3BF3", hover: "#2F2DD1", rec: "#F0476B", on: "#FFFFFF" },
  escuro: { bg: "#12131F", card: "#1D1F33", ink: "#E8EAF6", accent: "#8B8AFF", hover: "#A3A2FF", rec: "#FF6B8B", on: "#12131F" },
  azul: { bg: "#E6F0FA", card: "#FFFFFF", ink: "#0B2540", accent: "#1E6FD9", hover: "#1559B0", rec: "#E8553D", on: "#FFFFFF" },
  verde: { bg: "#E8F5EC", card: "#FFFFFF", ink: "#10301D", accent: "#1E9E57", hover: "#167D45", rec: "#E8553D", on: "#FFFFFF" },
  rosa: { bg: "#FCE9F1", card: "#FFFFFF", ink: "#3A1228", accent: "#D6336C", hover: "#B22658", rec: "#7C3AED", on: "#FFFFFF" },
  roxo: { bg: "#F1EAFB", card: "#FFFFFF", ink: "#2A1450", accent: "#7C3AED", hover: "#6428D6", rec: "#F0476B", on: "#FFFFFF" },
  laranja: { bg: "#FDF0E3", card: "#FFFFFF", ink: "#3A1F0B", accent: "#E8590C", hover: "#C44A08", rec: "#7048E8", on: "#FFFFFF" },
  vermelho: { bg: "#FBEAEA", card: "#FFFFFF", ink: "#3B0F0F", accent: "#D9301E", hover: "#B52415", rec: "#1E6FD9", on: "#FFFFFF" },
};

export const ALIASES = { preto: "escuro", noite: "escuro", dark: "escuro", branco: "claro", normal: "claro", padrao: "claro", violeta: "roxo", lilas: "roxo", magenta: "rosa" };

export const PREFIXES = ["tema", "modo", "cor"];

export function themeVars(t) {
  return { "--vox-bg": t.bg, "--vox-card": t.card, "--vox-ink": t.ink, "--vox-accent": t.accent, "--vox-accent-hover": t.hover, "--vox-rec": t.rec, "--vox-on": t.on };
}