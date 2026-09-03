"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { DragonForm } from "@/features/dragons/components/dragon-form";
import {
  useDragonDetailQuery,
  useUpdateDragonMutation,
} from "@/features/dragons/hooks/use-dragons";
import { DragonFormValues } from "@/features/dragons/schemas/dragon-schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function EditDragonPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    data: dragon,
    isLoading,
    isError,
    error,
    refetch,
  } = useDragonDetailQuery(id);
  const updateMutation = useUpdateDragonMutation(id);

  const handleUpdate = async (values: DragonFormValues) => {
    await updateMutation.mutateAsync({
      name: values.name,
      type: values.type,
      histories: values.histories,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <PageHeader
        title={dragon ? `Editar Dragão: ${dragon.name}` : "Editar Registros"}
        subtitle="Modifique o nome, afinidade elemental ou crônicas registradas para esta criatura."
        backHref={`/dragons/${id}`}
        backLabel="Voltar aos detalhes"
      />

      {isLoading && (
        <div className="rounded-2xl border border-emerald-500/20 bg-card/40 p-8 space-y-6">
          <Skeleton className="h-6 w-1/3 rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-6 w-1/4 rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-28 w-full rounded-md" />
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Skeleton className="h-10 w-28 rounded-md" />
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
          <h3 className="font-display text-xl font-bold text-foreground mb-2">
            Não foi possível carregar os registros deste dragão
          </h3>
          <p className="text-sm text-muted-foreground mb-6 font-serif">
            {error instanceof Error ? error.message : "Erro desconhecido."}
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

      {!isLoading && !isError && dragon && (
        <DragonForm
          initialData={dragon}
          onSubmit={handleUpdate}
          isSubmitting={updateMutation.isPending}
        />
      )}
    </div>
  );
}
