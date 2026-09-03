"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useDragonsQuery } from "@/features/dragons/hooks/use-dragons";
import { DragonCard } from "@/features/dragons/components/dragon-card";
import { DragonSearchFilter } from "@/features/dragons/components/dragon-search-filter";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { useGSAP, gsap } from "@/lib/gsap";

export default function DragonsListPage() {
  const { data: dragons, isLoading, isError, error, refetch, isFetching } = useDragonsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Filtro em tempo real por nome e tipo
  const filteredDragons = useMemo(() => {
    if (!dragons) return [];
    if (!searchQuery.trim()) return dragons;

    const query = searchQuery.toLowerCase().trim();
    return dragons.filter(
      (dragon) =>
        (dragon.name || "").toLowerCase().includes(query) ||
        (dragon.type || "").toLowerCase().includes(query)
    );
  }, [dragons, searchQuery]);

  // Animação GSAP nos cards após carregamento
  useGSAP(
    () => {
      if (!isLoading && filteredDragons.length > 0) {
        gsap.from(".dragon-card", {
          opacity: 0,
          y: 25,
          stagger: 0.05,
          duration: 0.5,
          ease: "power2.out",
          clearProps: "all",
        });
      }
    },
    { scope: gridContainerRef, dependencies: [isLoading, filteredDragons.length] }
  );

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <PageHeader
        title="Catálogo de Dragões Ancestrais"
        subtitle="Registros das majestosas criaturas aladas sob custódia e proteção do santuário."
        badge={
          dragons && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-3 h-3 text-brass-400" />
              {dragons.length} Catalogados
            </span>
          )
        }
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              title="Recarregar registros"
              className="border-emerald-500/30"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            </Button>

            <Link href="/dragons/new">
              <Button variant="glow" className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                <span>Despertar Dragão</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* Search & Statistics Filter Bar */}
      {dragons && dragons.length > 0 && (
        <DragonSearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalCount={dragons.length}
          filteredCount={filteredDragons.length}
        />
      )}

      {/* Loading State: Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-emerald-500/20 bg-card/40 p-5 space-y-4"
            >
              <div className="flex justify-between items-start">
                <Skeleton className="h-14 w-14 rounded-xl" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-7 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <div className="pt-4 border-t border-border/50 flex gap-2">
                <Skeleton className="h-9 flex-1 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center max-w-xl mx-auto">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
          <h3 className="font-display text-xl font-bold text-foreground mb-2">
            Falha na conexão com os anais do santuário
          </h3>
          <p className="text-sm text-muted-foreground mb-6 font-serif">
            {error instanceof Error ? error.message : "Não foi possível obter a lista de dragões."}
          </p>
          <Button variant="outline" onClick={() => refetch()} className="mx-auto">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Reconectar
          </Button>
        </div>
      )}

      {/* Content: Dragons Grid or Empty State */}
      {!isLoading && !isError && (
        <div ref={gridContainerRef}>
          {filteredDragons.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDragons.map((dragon, index) => (
                <DragonCard key={dragon.id} dragon={dragon} index={index} />
              ))}
            </div>
          ) : dragons && dragons.length > 0 ? (
            /* Empty Search Results */
            <EmptyState
              isSearch
              title="Nenhum dragão corresponde à busca"
              description={`Nenhuma criatura atende ao termo "${searchQuery}". Tente pesquisar por outro elemento ou nome.`}
              onAction={() => setSearchQuery("")}
            />
          ) : (
            /* Empty Database */
            <EmptyState
              title="O santuário está silencioso"
              description="Nenhum dragão ancestral catalogado no momento. Desperte a primeira criatura alada para iniciar a crônica."
              actionHref="/dragons/new"
              actionText="Despertar Primeiro Dragão"
              onRetry={() => refetch()}
            />
          )}
        </div>
      )}
    </div>
  );
}
