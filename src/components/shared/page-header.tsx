"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  backHref,
  backLabel = "Voltar",
  action,
  badge,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 mb-8 border-b border-border/60">
      <div className="space-y-1.5">
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {backLabel}
          </Link>
        )}
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="text-sm sm:text-base text-muted-foreground font-serif italic max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="flex items-center gap-3 self-start sm:self-center">{action}</div>}
    </div>
  );
}
