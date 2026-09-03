"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Dragon } from "../types/dragon-types";
import { DragonElementBadge } from "./dragon-element-badge";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Eye, Edit3, Trash2, Calendar, Sparkles } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { useDeleteDragonMutation } from "../hooks/use-dragons";
import { toast } from "sonner";

interface DragonCardProps {
  dragon: Dragon;
  index?: number;
}

export function DragonCard({ dragon }: DragonCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteMutation = useDeleteDragonMutation();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(dragon.id);
      setIsDeleteDialogOpen(false);
      toast.success(`Dragão "${dragon.name}" foi banido do santuário.`);
    } catch (err) {
      toast.error("Erro ao remover o dragão. Tente novamente.");
    }
  };

  const historiesCount = Array.isArray(dragon.histories)
    ? dragon.histories.length
    : dragon.histories
    ? 1
    : 0;

  return (
    <>
      <div className="dragon-card group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-500/20 bg-card/60 p-5 backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:border-emerald-400/50 hover:shadow-[0_15px_30px_-10px_rgba(16,185,129,0.25)]">
        {/* Subtle decorative corner accent */}
        <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

        {/* Card Header: Emblem Thumbnail & Element Badge */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-1 group-hover:border-emerald-400/60 transition-colors">
              <Image
                src="/images/dragon-emblem.webp"
                alt="Emblema Dracônico"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="56px"
              />
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <DragonElementBadge type={dragon.type} />
              {historiesCount > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brass-400 bg-brass-500/10 px-2 py-0.5 rounded-full border border-brass-500/20">
                  <Sparkles className="w-2.5 h-2.5" />
                  {historiesCount} {historiesCount === 1 ? "crônica" : "crônicas"}
                </span>
              )}
            </div>
          </div>

          {/* Dragon Name */}
          <h3 className="font-display text-xl font-bold tracking-wide text-foreground group-hover:text-emerald-300 transition-colors line-clamp-1 mb-2">
            {dragon.name || "Dragão Sem Nome"}
          </h3>

          {/* Creation Date Meta */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono mb-4">
            <Calendar className="w-3.5 h-3.5 text-emerald-500/70 shrink-0" />
            <span className="truncate">Despertado em {formatDate(dragon.createdAt)}</span>
          </div>
        </div>

        {/* Card Actions Footer */}
        <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-2 mt-auto">
          <Link href={`/dragons/${dragon.id}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-1.5 text-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              Detalhes
            </Button>
          </Link>

          <Link href={`/dragons/${dragon.id}/edit`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-brass-500/20 hover:text-brass-400 text-muted-foreground transition-colors"
              title="Editar dados"
              aria-label="Editar dragão"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive text-muted-foreground transition-colors"
            title="Remover dragão"
            aria-label="Remover dragão"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Reusable Delete Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        dragonName={dragon.name}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}
