"use client";

import React, { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  useDragonDetailQuery,
  useDeleteDragonMutation,
} from "@/features/dragons/hooks/use-dragons";
import { DragonElementBadge } from "@/features/dragons/components/dragon-element-badge";
import { DragonHistoryList } from "@/features/dragons/components/dragon-history-list";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import {
  Edit3,
  Trash2,
  Calendar,
  Shield,
  Clock,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useGSAP, gsap } from "@/lib/gsap";

export default function DragonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const containerRef = useRef<HTMLDivElement>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { data: dragon, isLoading, isError, error, refetch } = useDragonDetailQuery(id);
  const deleteMutation = useDeleteDragonMutation();

  // GSAP animation for revealing details
  useGSAP(
    () => {
      if (!isLoading && dragon) {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".detail-hero-card", {
          opacity: 0,
          y: 30,
          duration: 0.8,
        })
          .from(
            ".detail-meta-item",
            {
              opacity: 0,
              y: 20,
              stagger: 0.1,
              duration: 0.5,
            },
            "-=0.4"
          )
          .from(
            ".detail-history-section",
            {
              opacity: 0,
              y: 25,
              duration: 0.6,
            },
            "-=0.3"
          );
      }
    },
    { scope: containerRef, dependencies: [isLoading, dragon] }
  );

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      setIsDeleteDialogOpen(false);
      toast.success(`Dragão "${dragon?.name}" foi banido do santuário.`);
      router.push("/dragons");
    } catch {
      toast.error("Não foi possível banir o dragão. Tente novamente.");
    }
  };

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto space-y-8">
      {/* Top Breadcrumb & Header */}
      <PageHeader
        title={dragon ? dragon.name : "Detalhes do Dragão"}
        subtitle="Arquivo oficial com a data de despertar, linhagem elemental e crônicas catalogadas."
        backHref="/dragons"
        backLabel="Voltar para o catálogo"
        action={
          dragon && (
            <div className="flex items-center gap-2">
              <Link href={`/dragons/${id}/edit`}>
                <Button variant="outline" size="sm" className="flex items-center gap-1.5 border-brass-500/30 hover:border-brass-400">
                  <Edit3 className="w-3.5 h-3.5 text-brass-400" />
                  <span>Editar Dragão</span>
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="flex items-center gap-1.5 text-destructive hover:bg-destructive/15 hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Banir</span>
              </Button>
            </div>
          )
        }
      />

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-500/20 bg-card/40 p-8 space-y-4">
            <Skeleton className="h-10 w-2/3 rounded-lg" />
            <Skeleton className="h-6 w-1/4 rounded-full" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
          </div>
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      )}

      {/* Error View */}
      {isError && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
          <h3 className="font-display text-xl font-bold text-foreground mb-2">
            Registro dracônico não encontrado
          </h3>
          <p className="text-sm text-muted-foreground mb-6 font-serif">
            {error instanceof Error ? error.message : "Não foi possível carregar os dados deste dragão."}
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => router.push("/dragons")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao catálogo
            </Button>
            <Button variant="secondary" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </div>
      )}

      {/* Main Details View */}
      {!isLoading && !isError && dragon && (
        <div className="space-y-8">
          {/* Hero Card with Photographic Landscape Backdrop */}
          <div className="detail-hero-card relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-card/70 p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
            {/* Background Texture with Parallax Effect */}
            <div className="absolute inset-0 -z-10 opacity-30 dark:opacity-20 overflow-hidden pointer-events-none">
              <Image
                src="/images/detail-bg.webp"
                alt="Montanhas norueguesas com dragão ancestral"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/85 to-transparent" />
            </div>

            {/* Dragon Identity Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border/60">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <DragonElementBadge type={dragon.type} className="text-sm py-1 px-3.5" />
                  <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
                    Registro #{dragon.id}
                  </span>
                </div>

                <h2 className="font-display text-3xl sm:text-5xl font-black tracking-wide text-foreground">
                  {dragon.name}
                </h2>
              </div>

              {/* Emblem Stamp */}
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-400/40 bg-emerald-950/60 p-1.5 shrink-0 shadow-lg shadow-emerald-950/50">
                <Image
                  src="/images/dragon-emblem.webp"
                  alt="Selo do Dragão"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Core Required Specifications: Nome, Tipo e Data de Criação */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              {/* Meta 1: Nome Ancestral */}
              <div className="detail-meta-item rounded-xl border border-border/70 bg-background/50 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Nome Registrado</span>
                </div>
                <p className="font-display text-lg font-bold text-foreground">
                  {dragon.name}
                </p>
              </div>

              {/* Meta 2: Afinidade Elemental / Tipo */}
              <div className="detail-meta-item rounded-xl border border-border/70 bg-background/50 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-brass-400" />
                  <span>Afinidade Elemental</span>
                </div>
                <p className="font-display text-lg font-bold text-foreground">
                  {dragon.type || "Elemental Desconhecido"}
                </p>
              </div>

              {/* Meta 3: Data de Criação */}
              <div className="detail-meta-item rounded-xl border border-border/70 bg-background/50 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Data de Despertar</span>
                </div>
                <p className="font-mono text-sm font-semibold text-foreground">
                  {formatDate(dragon.createdAt)}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>Registrado nos anais</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chronicles & Lore Section (Field 'histories') */}
          <div className="detail-history-section">
            <DragonHistoryList histories={dragon.histories} />
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {dragon && (
        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          dragonName={dragon.name}
          onConfirm={handleDelete}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
