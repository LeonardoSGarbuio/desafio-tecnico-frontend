"use client";

import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DragonForm } from "@/features/dragons/components/dragon-form";
import { useCreateDragonMutation } from "@/features/dragons/hooks/use-dragons";
import { DragonFormValues } from "@/features/dragons/schemas/dragon-schema";
import Image from "next/image";

export default function NewDragonPage() {
  const createMutation = useCreateDragonMutation();

  const handleCreate = async (values: DragonFormValues) => {
    await createMutation.mutateAsync({
      name: values.name,
      type: values.type,
      histories: values.histories,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <PageHeader
        title="Despertar Novo Dragão"
        subtitle="Insira o nome, afinidade elemental e feitos para registrar uma nova criatura no santuário."
        backHref="/dragons"
        backLabel="Voltar para o catálogo"
      />

      {/* Decorative Card Header */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-card to-brass-950/30 p-6 flex items-center gap-5">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-emerald-400/30 shrink-0">
          <Image
            src="/images/dragon-emblem.webp"
            alt="Emblema"
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div>
          <h2 className="font-display text-base sm:text-lg font-bold text-foreground uppercase tracking-wider">
            Cerimônia de Catalogação
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-serif">
            Ao salvar, o dragão será registrado nos anais perpétuos e disponibilizado no catálogo em ordem alfabética.
          </p>
        </div>
      </div>

      <DragonForm onSubmit={handleCreate} isSubmitting={createMutation.isPending} />
    </div>
  );
}
