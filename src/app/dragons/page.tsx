"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, LogOut, Eye, Pencil, Trash2, Loader2, Sparkles } from "lucide-react";
import { useGSAP, ScrollTrigger } from "@/lib/gsap";
import { fetchDragons, deleteDragon as deleteDragonApi } from "@/services/dragon-api";
import type { Dragon } from "@/types/dragon";

/* ─── Helpers ──────────────────────────────────────────── */

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data desconhecida";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return "Data desconhecida";
  }
}

import { resolveDragonImage } from "@/lib/dragon-images";

/** Remove nomes inválidos (curtos demais) e deduplica por nome */
function cleanDragonList(raw: Dragon[]): Dragon[] {
  const seen = new Set<string>();
  return raw
    .filter((d) => {
      const name = (d.name || "").trim();
      if (name.length < 3) return false;
      const key = name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => (a.name || "").localeCompare(b.name || "", "pt-BR"));
}

/* ─── Component ────────────────────────────────────────── */

export default function DragonsPage() {
  const showcaseRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [dragons, setDragons] = useState<Dragon[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const activeDragon = dragons[activeIndex] || dragons[0] || null;

  /* ── Auth guard ────────────────────────────────────── */
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

  /* ── Fetch dragons ─────────────────────────────────── */
  const loadDragons = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const raw = await fetchDragons();
      const clean = cleanDragonList(raw);
      setDragons(clean);
    } catch {
      setError("Não foi possível carregar os dragões.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadDragons();
  }, [loadDragons]);

  /* ── GSAP ScrollTrigger — sincronização com o scroll nativo ─── */
  useGSAP(
    () => {
      if (dragons.length <= 1 || !showcaseRef.current) return;

      const trigger = ScrollTrigger.create({
        trigger: showcaseRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.1,
        onUpdate: (self) => {
          const newIdx = Math.min(
            Math.round(self.progress * (dragons.length - 1)),
            dragons.length - 1
          );
          setActiveIndex((prev) => (prev !== newIdx ? newIdx : prev));
        },
      });

      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      return () => {
        clearTimeout(timer);
        trigger.kill();
      };
    },
    { scope: showcaseRef, dependencies: [dragons] }
  );

  /* ── Navegar ao clicar no nome da sidebar ──────────── */
  const handleSelectDragon = (index: number) => {
    setActiveIndex(index);
    if (!showcaseRef.current || dragons.length <= 1) return;

    const totalScrollable = showcaseRef.current.offsetHeight - window.innerHeight;
    if (totalScrollable > 0) {
      const targetY = (index / (dragons.length - 1)) * totalScrollable;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  /* ── Logout ────────────────────────────────────────── */
  const handleLogout = () => {
    localStorage.removeItem("@dragon_sanctuary_user");
    router.replace("/");
  };

  /* ── Delete ────────────────────────────────────────── */
  const handleDelete = async (dragon: Dragon) => {
    if (deletingId) return;
    setDeletingId(dragon.id);
    try {
      await deleteDragonApi(dragon.id);
      setDragons((prev) => prev.filter((d) => d.id !== dragon.id));
      setActiveIndex(0);
      toast.success(`"${dragon.name}" removido com sucesso.`);
    } catch {
      toast.error("Erro ao remover o dragão. Tente novamente.");
    } finally {
      setDeletingId(null);
    }
  };

  /* ── Render ────────────────────────────────────────── */
  return (
    <div className="relative min-h-screen bg-[#080d12] text-white">
      {/* ── 1. Background com Alta Visibilidade e Iluminação Natural ─────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Image
          src="/images/dashboard-bg.webp"
          alt="Santuário dos Dragões"
          fill
          className="object-cover opacity-60 scale-105"
          sizes="100vw"
          priority
        />
        {/* Orbes de luz atmosférica (emerald e âmbar suave) para dar vida e luminosidade */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(circle at 18% 35%, rgba(16, 185, 129, 0.22) 0%, transparent 50%), radial-gradient(circle at 82% 20%, rgba(245, 158, 11, 0.18) 0%, transparent 45%), radial-gradient(circle at 50% 85%, rgba(6, 95, 70, 0.25) 0%, transparent 60%)",
          }}
        />
        {/* Overlay sutil para garantir contraste perfeito com o texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 backdrop-brightness-95" />
      </div>

      {/* ── 2. Header Fixo com Efeito Vidro Claro ──────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 sm:px-10 border-b border-white/15"
        style={{
          background:
            "linear-gradient(90deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.05) 100%)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.35)",
        }}
      >
        <Link href="/dragons" className="flex items-center gap-3 group">
          <div className="relative p-1 rounded-xl bg-white/10 border border-white/20 group-hover:border-emerald-400/50 transition-all">
            <Image
              src="/images/dragon-emblem.webp"
              alt="Dragon Sanctuary"
              width={26}
              height={26}
              className="rounded-lg opacity-95"
            />
          </div>
          <span className="text-sm sm:text-base font-semibold text-white tracking-wide drop-shadow-sm">
            Dragon Sanctuary
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/dragons/new"
            className="flex items-center gap-2 h-9 px-4 text-xs font-semibold text-white rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background:
                "linear-gradient(90deg, #9acd32 0%, #22c55e 50%, #16a34a 100%)",
              boxShadow: "0 4px 15px -2px rgba(34, 197, 94, 0.45)",
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Dragão</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 h-9 px-3.5 text-xs text-white/75 hover:text-white rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* ── Loading State ────────────────────────────── */}
      {isLoading && (
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div
            className="flex flex-col items-center gap-4 p-8 rounded-3xl"
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
            }}
          >
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-sm font-medium text-white/80">Carregando catálogo de dragões...</p>
          </div>
        </div>
      )}

      {/* ── Error State ──────────────────────────────── */}
      {error && !isLoading && (
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div
            className="text-center space-y-4 p-8 rounded-3xl max-w-md"
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
            }}
          >
            <p className="text-white/85 text-sm">{error}</p>
            <button
              onClick={loadDragons}
              className="h-9 px-5 text-xs font-semibold text-white rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-all"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {/* ── Empty State ──────────────────────────────── */}
      {!isLoading && !error && dragons.length === 0 && (
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div
            className="text-center space-y-5 max-w-sm p-8 rounded-3xl"
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
            }}
          >
            <Image
              src="/images/empty-state.webp"
              alt="Nenhum dragão cadastrado"
              width={200}
              height={200}
              className="mx-auto rounded-2xl opacity-75"
            />
            <div>
              <p className="text-white text-base font-semibold">Nenhum dragão encontrado</p>
              <p className="text-white/60 text-xs mt-1">
                O santuário está vazio. Cadastre o primeiro espécime.
              </p>
            </div>
            <Link
              href="/dragons/new"
              className="inline-flex items-center gap-1.5 h-10 px-5 text-xs font-semibold text-white rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Dragão
            </Link>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* ── SHOWCASE EM VIDRO CLARO (CSS Sticky + GSAP) ── */}
      {/* ═══════════════════════════════════════════════ */}
      {!isLoading && !error && dragons.length > 0 && (
        <div
          ref={showcaseRef}
          className="relative w-full"
          style={{ height: `${Math.max(dragons.length, 2) * 55}vh` }}
        >
          {/* Container Sticky: permanece fixo no topo enquanto o scroll avança */}
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            {/* Espaçamento pt-20 (80px) garante 16px livres abaixo do cabeçalho de 64px */}
            <div className="h-full flex flex-col md:flex-row pt-20 pb-4 px-4 sm:pt-20 sm:pb-6 sm:px-6 lg:pt-20 lg:pb-6 lg:px-8 gap-4 sm:gap-6">
              {/* ─── 3. Sidebar em Cartão de Vidro Claro ──────────────── */}
              <aside
                className="w-full md:w-[380px] lg:w-[420px] shrink-0 flex flex-col justify-between p-6 sm:p-7 lg:p-8 rounded-[2rem] text-white shadow-2xl z-20 transition-all border border-white/25"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.08) 100%)",
                  backdropFilter: "blur(28px)",
                  WebkitBackdropFilter: "blur(28px)",
                  boxShadow:
                    "0 25px 50px -12px rgba(0, 0, 0, 0.45), inset 0 1px 1px 0 rgba(255, 255, 255, 0.35)",
                }}
              >
                {/* Bloco Superior: Dragão Ativo */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider text-emerald-300 bg-emerald-500/20 border border-emerald-400/40 uppercase">
                      <Sparkles className="w-3 h-3" />
                      Espécime Ativo
                    </div>
                    <span className="text-[11px] font-mono text-white/50">
                      {String(activeIndex + 1).padStart(2, "0")} /{" "}
                      {String(dragons.length).padStart(2, "0")}
                    </span>
                  </div>

                  {activeDragon && (
                    <div className="dragon-info-panel transition-all duration-300">
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow-sm">
                        {activeDragon.name}
                      </h2>
                      <p className="text-sm font-medium text-emerald-300 mt-1">
                        {activeDragon.type || "Tipo desconhecido"}
                      </p>

                      {/* Divisor suave com gradiente (estilo glass-effect) */}
                      <div
                        className="h-px w-full my-3.5"
                        style={{
                          backgroundImage:
                            "linear-gradient(90deg, transparent, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 80%, transparent)",
                        }}
                      />

                      <p className="text-xs text-white/70">
                        Catalogado em{" "}
                        <span suppressHydrationWarning className="text-white font-medium">
                          {formatDate(activeDragon.createdAt)}
                        </span>
                      </p>

                      {/* Botões de Ação em Vidro */}
                      <div className="flex items-center gap-2 mt-4">
                        <Link
                          href={`/dragons/${activeDragon.id}`}
                          className="flex items-center gap-1.5 h-8 sm:h-9 px-3.5 text-xs font-medium rounded-xl transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
                          style={{
                            background: "rgba(255, 255, 255, 0.12)",
                            border: "1px solid rgba(255, 255, 255, 0.28)",
                          }}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detalhes</span>
                        </Link>

                        <Link
                          href={`/dragons/${activeDragon.id}/edit`}
                          className="flex items-center gap-1.5 h-8 sm:h-9 px-3.5 text-xs font-medium rounded-xl transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
                          style={{
                            background: "rgba(255, 255, 255, 0.12)",
                            border: "1px solid rgba(255, 255, 255, 0.28)",
                          }}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </Link>

                        <button
                          onClick={() =>
                            toast(`Remover "${activeDragon.name}" do santuário?`, {
                              action: {
                                label: "Confirmar",
                                onClick: () => handleDelete(activeDragon),
                              },
                            })
                          }
                          disabled={deletingId === activeDragon.id}
                          className="flex items-center gap-1.5 h-8 sm:h-9 px-3 text-xs font-medium rounded-xl text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-all disabled:opacity-40 cursor-pointer"
                          style={{
                            background: "rgba(239, 68, 68, 0.15)",
                            border: "1px solid rgba(239, 68, 68, 0.35)",
                          }}
                        >
                          {deletingId === activeDragon.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bloco Inferior: Lista de Dragões com Marcadores Luminosos */}
                <div className="hidden sm:block mt-4">
                  <p className="text-[10px] font-semibold tracking-wider uppercase text-white/50 mb-1.5">
                    Índice do Santuário (Role ou Clique)
                  </p>
                  <nav className="relative space-y-0.5 max-h-[28vh] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-white/20" />

                    {dragons.map((dragon, i) => {
                      const isActive = i === activeIndex;
                      return (
                        <button
                          key={dragon.id}
                          type="button"
                          onClick={() => handleSelectDragon(i)}
                          className={`flex items-center gap-3 w-full text-left pl-5 py-1.5 text-xs transition-all duration-300 cursor-pointer rounded-lg ${
                            isActive
                              ? "text-white font-bold bg-white/10"
                              : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                          }`}
                        >
                          <span
                            className={`block h-px transition-all duration-300 shrink-0 ${
                              isActive
                                ? "w-6 bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]"
                                : "w-3 bg-white/30"
                            }`}
                          />
                          <span className="truncate">{dragon.name}</span>
                        </button>
                      );
                    })}
                  </nav>

                  <p className="text-[10px] text-white/40 tracking-wider mt-2.5 pl-5">
                    {dragons.length} dragões catalogados
                  </p>
                </div>
              </aside>

              {/* ─── 4. Painel de Imagem com Moldura em Vidro Cristalino ────────── */}
              <div className="flex-1 relative h-full min-h-[300px]">
                <div
                  className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl border border-white/25"
                  style={{
                    background: "rgba(0, 0, 0, 0.25)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    boxShadow:
                      "0 25px 60px -15px rgba(0, 0, 0, 0.6), inset 0 1px 1px 0 rgba(255, 255, 255, 0.35)",
                  }}
                >
                  {/* Imagens com Crossfade fluido acelerado por GPU */}
                  {dragons.map((dragon, i) => (
                    <div
                      key={dragon.id}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out will-change-[opacity] ${
                        i === activeIndex
                          ? "opacity-100 z-10"
                          : "opacity-0 z-0 pointer-events-none"
                      }`}
                    >
                      <Image
                        src={resolveDragonImage(dragon, i)}
                        alt={dragon.name || "Dragão"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 65vw"
                        priority={i === 0}
                      />
                    </div>
                  ))}

                  {/* Gradiente sutil inferior para destacar os metadados */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15 pointer-events-none z-20" />

                  {/* Badge de Telemetria no Canto Inferior */}
                  {activeDragon && (
                    <div className="absolute bottom-6 right-7 z-30 flex items-center gap-2">
                      <span className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium text-white tracking-wider bg-black/40 backdrop-blur-md border border-white/25 shadow-lg">
                        {String(activeIndex + 1).padStart(2, "0")} /{" "}
                        {String(dragons.length).padStart(2, "0")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
