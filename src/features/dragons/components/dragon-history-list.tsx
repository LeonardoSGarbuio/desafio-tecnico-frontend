import React from "react";
import { Scroll, Feather, Sparkles } from "lucide-react";
import { normalizeHistories } from "../api/dragon-api";

interface DragonHistoryListProps {
  histories?: string[] | string;
}

export function DragonHistoryList({ histories }: DragonHistoryListProps) {
  const items = normalizeHistories(histories);

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border/60 bg-card/40 p-6 text-center">
        <Scroll className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
        <p className="text-sm text-muted-foreground font-serif italic">
          Nenhuma crónica ou habilidade registrada ainda nos anais do santuário para este dragão.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-400">
        <Feather className="w-4 h-4" />
        <span>Registros e Habilidades Catalogadas ({items.length})</span>
      </div>

      <div className="grid gap-3">
        {items.map((entry, index) => (
          <div
            key={index}
            className="group relative flex items-start gap-3.5 rounded-xl border border-emerald-500/20 bg-card/60 p-4 transition-all duration-300 hover:border-emerald-400/50 hover:bg-emerald-950/20 backdrop-blur-sm shadow-sm"
          >
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-brass-500/30 bg-brass-500/10 text-brass-400 group-hover:scale-110 transition-transform">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground/90 font-serif leading-relaxed">
                {entry}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
