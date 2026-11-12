import { useEffect, useState } from "react";
import { fuzzyCommand } from "../../shared/fuzzyCommand.js";
import { norm } from "../../shared/texto.js";
import { THEMES, ALIASES, PREFIXES, themeVars } from "./temas.js";

export function useTema() {
  const [theme, setTheme] = useState("claro");
  const [aviso, setAviso] = useState("");

  const applyTheme = (nome) => {
    let chave = norm(nome);
    if (chave === "aleatorio") {
      const outros = Object.keys(THEMES).filter((k) => k !== theme);
      chave = outros[Math.floor(Math.random() * outros.length)];
    }
    chave = ALIASES[chave] || chave;
    if (THEMES[chave]) {
      setTheme(chave);
      setAviso(`Tema ${chave}`);
    } else {
      setAviso(`Não conheço o tema “${nome}”`);
    }
    setTimeout(() => setAviso(""), 2500);
  };

  const commands = [
    ...Object.keys(THEMES).flatMap((nome) => PREFIXES.map((p) => fuzzyCommand(`${p} ${nome}`, () => applyTheme(nome)))),
    ...Object.entries(ALIASES).map(([apelido, alvo]) => fuzzyCommand(`tema ${apelido}`, () => applyTheme(alvo))),
    fuzzyCommand("tema aleatório", () => applyTheme("aleatorio"), false),
  ];

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(themeVars(THEMES[theme])).forEach(([chave, valor]) => {
      root.style.setProperty(chave, valor);
    });
  }, [theme]);

  return { theme, aviso, applyTheme, commands };
}