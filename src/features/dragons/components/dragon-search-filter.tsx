"use client";

import React from "react";
import { Search, X, Sparkles } from "lucide-react";

interface DragonSearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  totalCount: number;
  filteredCount: number;
}

export function DragonSearchFilter({
  searchQuery,
  onSearchChange,
  totalCount,
  filteredCount,
}: DragonSearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-emerald-500/20 bg-card/40 backdrop-blur-md mb-8">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar dragão por nome ou elemento (ex: Fogo, Draco, Luz)..."
          className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-border/70 bg-background/60 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-card"
            title="Limpar busca"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Counts Indicator */}
      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground shrink-0 self-end sm:self-center">
        <Sparkles className="w-3.5 h-3.5 text-brass-400" />
        <span>
          Exibindo{" "}
          <strong className="text-emerald-400 font-semibold">{filteredCount}</strong> de{" "}
          <strong className="text-foreground">{totalCount}</strong> dragões catalogados
        </span>
      </div>
    </div>
  );
}
