"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Tag, History, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchDragonById, deleteDragon } from "@/services/dragon-api";
import type { Dragon } from "@/types/dragon";
import { resolveDragonImage } from "@/lib/dragon-images";

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data não informada";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "Data não informada";
  }
}

export default function DragonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [dragon, setDragon] = useState<Dragon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth Guard
  useEffect(() => {
    try {
      const stored = localStorage.getItem("@dragon_sanctuary_user");
      if (!stored) {
        router.replace("/");
        return;
      }
    } catch {
      router.replace("/");
    }
  }, [router]);

  // Carregar Dragão
  useEffect(() => {
    if (!id) return;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchDragonById(id);
        setDragon(data);
      } catch {
        setError("Não foi possível carregar os detalhes deste dragão.");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [id]);

  const handleDelete = async () => {
    if (!dragon || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteDragon(dragon.id);
      toast.success(`"${dragon.name}" removido com sucesso.`);
      router.push("/dragons");
    } catch {
      toast.error("Erro ao remover dragão.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#050505]">
      {/* Background Cinematográfico com Glass Overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <Image
          src="/images/detail-bg.webp"
          alt="Paisagem do Santuário"
          fill
          priority
          className="object-cover object-center opacity-40 scale-105"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-brightness-90" />
      </div>

      {/* Header com Botão Voltar */}
      <div className="fixed top-6 left-6 z-20">
        <Link
          href="/dragons"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white/80 hover:text-white transition-all hover:scale-105"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar aos Dragões
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="relative z-10 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-sm text-white/60">Buscando registros ancestrais...</p>
        </div>
      )}

      {/* Erro */}
      {error && !isLoading && (
        <div
          className="relative z-10 max-w-md w-full rounded-2xl p-8 text-center"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <p className="text-white/80 text-sm mb-5">{error}</p>
          <Link
            href="/dragons"
            className="inline-block px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
          >
            Voltar para a Lista
          </Link>
        </div>
      )}

      {/* Card de Detalhes em Vidro (Glassmorphism Clean) */}
      {!isLoading && !error && dragon && (
        <div
          className="relative z-10 w-full max-w-2xl rounded-[2rem] p-7 sm:p-10 text-white shadow-2xl my-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            boxShadow:
              "0 30px 60px -15px rgba(0, 0, 0, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
          }}
        >
          {/* Banner de Imagem do Dragão */}
          <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden mb-6 border border-white/20 shadow-2xl">
            <Image
              src={resolveDragonImage(dragon)}
              alt={dragon.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Topo do Card */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase">
                // ID REGISTRO #{dragon.id}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold mt-1 tracking-tight text-white">
                {dragon.name}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-xs text-white/70">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium text-emerald-300">{dragon.type || "Elemento Não Identificado"}</span>
              </div>
            </div>

            {/* Ações de Edição e Exclusão */}
            <div className="flex items-center gap-2.5">
              <Link
                href={`/dragons/${dragon.id}/edit`}
                className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-medium text-white transition-all hover:bg-white/10"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <Pencil className="w-3.5 h-3.5" />
                Editar
              </Link>

              <button
                onClick={() =>
                  toast(`Tem certeza que deseja banir "${dragon.name}"?`, {
                    action: {
                      label: "Confirmar",
                      onClick: handleDelete,
                    },
                  })
                }
                disabled={isDeleting}
                className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 transition-all hover:bg-red-500/10 disabled:opacity-40"
                style={{
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Excluir
              </button>
            </div>
          </div>

          {/* Grid de Metadados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
            <div
              className="p-4 rounded-xl"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
                <Calendar className="w-3.5 h-3.5 text-white/40" />
                <span>Primeiro Avistamento (Criação)</span>
              </div>
              <p suppressHydrationWarning className="text-sm font-medium text-white/90">
                {formatDate(dragon.createdAt)}
              </p>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
                <Tag className="w-3.5 h-3.5 text-white/40" />
                <span>Classe / Linhagem</span>
              </div>
              <p className="text-sm font-medium text-white/90">
                {dragon.type || "Desconhecida"}
              </p>
            </div>
          </div>

          {/* Histórico / Relatos */}
          <div className="pt-2">
            <div className="flex items-center gap-2 text-xs text-white/60 mb-3">
              <History className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                Histórico & Crônicas do Santuário
              </span>
            </div>

            <div
              className="p-5 rounded-2xl text-xs sm:text-sm text-white/80 leading-relaxed font-normal"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              {dragon.histories && Array.isArray(dragon.histories) && dragon.histories.length > 0 ? (
                <ul className="space-y-2 list-disc list-inside">
                  {dragon.histories.map((entry, idx) => (
                    <li key={idx} className="text-white/85">
                      {String(entry)}
                    </li>
                  ))}
                </ul>
              ) : typeof dragon.histories === "string" && dragon.histories.trim() ? (
                <p>{dragon.histories}</p>
              ) : (
                <p className="text-white/40 italic">
                  Nenhuma crônica registrada para este dragão nos anais ancestrais. As lendas contam que ele sobrevoa os picos nórdicos em silêncio.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
