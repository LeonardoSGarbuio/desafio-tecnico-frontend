"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  onRetry?: () => void;
  isSearch?: boolean;
}

export function EmptyState({
  title = "Nenhum dragão encontrado no santuário",
  description = "Os céus estão silenciosos. Cadastre um novo dragão para começar a povoar o vale ancestral.",
  actionText = "Despertar Novo Dragão",
  actionHref = "/dragons/new",
  onAction,
  onRetry,
  isSearch = false,
}: EmptyStateProps) {
  return (
    <div className="relative flex flex-col items-center justify-center py-16 px-6 text-center max-w-xl mx-auto rounded-2xl border border-emerald-500/20 bg-card/40 backdrop-blur-md overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-brass-500/10 blur-3xl pointer-events-none" />

      {/* Visual Image */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-6 rounded-2xl overflow-hidden border border-emerald-400/25 shadow-2xl shadow-emerald-950/50">
        <Image
          src="/images/empty-state.webp"
          alt="Vale dos dragões silencioso"
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          sizes="(max-width: 768px) 192px, 224px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
      </div>

      <h3 className="font-display text-xl sm:text-2xl font-bold tracking-wide text-foreground mb-3">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 max-w-md">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button
            variant="outline"
            onClick={onRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </Button>
        )}

        {actionHref && !isSearch && (
          <Link href={actionHref}>
            <Button variant="glow" className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              {actionText}
            </Button>
          </Link>
        )}

        {onAction && isSearch && (
          <Button
            variant="secondary"
            onClick={onAction}
            className="flex items-center gap-2"
          >
            Limpar busca
          </Button>
        )}
      </div>
    </div>
  );
}
