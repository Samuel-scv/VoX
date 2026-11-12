import { THEMES } from "./temas.js";

export default function SeletorTema({ theme, aviso, onChange }) {
  return (
    <div className="flex flex-col gap-2 text-sm font-medium">
      Tema
      <div className="flex flex-wrap gap-2">
        {Object.entries(THEMES).map(([nome, t]) => (
          <button
            key={nome}
            type="button"
            onClick={() => onChange(nome)}
            aria-pressed={theme === nome}
            aria-label={`Tema ${nome}`}
            title={nome}
            className={`h-8 w-8 rounded-full border-2 outline-offset-2 focus-visible:outline-2 focus-visible:outline-vox-accent ${theme === nome ? "border-vox-ink" : "border-vox-ink/20"}`}
            style={{ background: `linear-gradient(135deg, ${t.bg} 50%, ${t.accent} 50%)` }}
          />
        ))}
      </div>
      <p className="font-normal text-vox-ink/60" aria-live="polite">
        {aviso || "Diga “tema escuro”, “tema azul”, “modo claro”…"}
      </p>
    </div>
  );
}