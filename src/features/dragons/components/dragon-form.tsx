"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dragonSchema, DragonFormValues } from "../schemas/dragon-schema";
import { Dragon } from "../types/dragon-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, ArrowLeft, Flame, Sparkles } from "lucide-react";
import Link from "next/link";
import { normalizeHistories } from "../api/dragon-api";

interface DragonFormProps {
  initialData?: Dragon;
  onSubmit: (data: DragonFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

const COMMON_ELEMENTS = [
  "Fogo",
  "Gelo",
  "Tempestade",
  "Terra",
  "Luz",
  "Trevas",
  "Espiritual",
  "Elemental",
  "Arcano",
];

export function DragonForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: DragonFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  const defaultHistories = initialData
    ? normalizeHistories(initialData.histories).join("\n")
    : "";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DragonFormValues>({
    resolver: zodResolver(dragonSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "",
      histories: defaultHistories,
    },
  });

  const selectedType = watch("type");

  const handleFormSubmit = async (values: DragonFormValues) => {
    try {
      await onSubmit(values);
      toast.success(
        isEdit
          ? `Dragão "${values.name}" atualizado com sucesso!`
          : `Dragão "${values.name}" registrado no santuário com sucesso!`
      );
      router.push("/dragons");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao salvar informações do dragão.";
      toast.error(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 rounded-2xl border border-emerald-500/20 bg-card/60 p-6 sm:p-8 backdrop-blur-md shadow-xl"
    >
      {/* Campo: Nome do Dragão */}
      <div className="space-y-2">
        <label
          htmlFor="dragon-name"
          className="block text-xs font-semibold uppercase tracking-widest text-foreground flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-brass-400" />
          Nome do Dragão <span className="text-destructive">*</span>
        </label>
        <Input
          id="dragon-name"
          placeholder="Ex: Fúria da Noite, Draco, Fafnir..."
          error={errors.name?.message}
          {...register("name")}
        />
        <p className="text-[11px] text-muted-foreground font-serif">
          O título ou nome ancestral pelo qual a criatura é reconhecida pelos guardiões.
        </p>
      </div>

      {/* Campo: Tipo / Elemento */}
      <div className="space-y-2">
        <label
          htmlFor="dragon-type"
          className="block text-xs font-semibold uppercase tracking-widest text-foreground flex items-center gap-1.5"
        >
          <Flame className="w-3.5 h-3.5 text-emerald-400" />
          Tipo ou Elemento <span className="text-destructive">*</span>
        </label>
        <Input
          id="dragon-type"
          placeholder="Ex: Fogo, Gelo, Luz, Elemental..."
          error={errors.type?.message}
          {...register("type")}
        />

        {/* Quick select element chips */}
        <div className="pt-1.5">
          <span className="text-[11px] text-muted-foreground block mb-1.5 font-serif">
            Sugestões rápidas de elementos:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_ELEMENTS.map((elem) => {
              const isSelected = selectedType?.toLowerCase() === elem.toLowerCase();
              return (
                <button
                  type="button"
                  key={elem}
                  onClick={() => setValue("type", elem, { shouldValidate: true })}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                    isSelected
                      ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 font-semibold"
                      : "border-border/60 bg-background/40 text-muted-foreground hover:border-emerald-500/40 hover:text-foreground"
                  }`}
                >
                  {elem}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Campo: Histórias e Habilidades (Bônus diferencial) */}
      <div className="space-y-2">
        <label
          htmlFor="dragon-histories"
          className="block text-xs font-semibold uppercase tracking-widest text-foreground flex items-center gap-1.5"
        >
          Crônicas & Habilidades Especiais (Opcional)
        </label>
        <textarea
          id="dragon-histories"
          rows={4}
          placeholder="Insira histórias, feitos lendários ou habilidades (uma por linha)..."
          className="w-full rounded-md border border-border bg-card/60 px-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 backdrop-blur-sm resize-y"
          {...register("histories")}
        />
        <p className="text-[11px] text-muted-foreground font-serif">
          Dica: Separe múltiplos feitos ou características adicionando uma por linha.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-border/60 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
        <Link href="/dragons">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Cancelar
          </Button>
        </Link>

        <Button
          type="submit"
          variant="glow"
          isLoading={isSubmitting}
          className="w-full sm:w-auto min-w-[160px]"
        >
          <Save className="w-4 h-4 mr-1.5" />
          {isEdit ? "Salvar Alterações" : "Registrar no Santuário"}
        </Button>
      </div>
    </form>
  );
}
