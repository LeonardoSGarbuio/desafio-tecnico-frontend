"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Pencil, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { fetchDragonById, updateDragon } from "@/services/dragon-api";

export default function EditDragonPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Carregar dados atuais do dragão
  useEffect(() => {
    if (!id) return;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchDragonById(id);
        setName(data.name || "");
        setType(data.type || "");
        if (data.imageUrl) {
          setImageUrl(data.imageUrl);
          setImagePreview(data.imageUrl);
        }
      } catch {
        setError("Não foi possível carregar os dados para edição.");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione um arquivo de imagem válido (PNG, JPG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        const maxDim = 1200;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const optimized = canvas.toDataURL("image/webp", 0.85);
        setImageUrl(optimized);
        setImagePreview(optimized);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("O nome do dragão é obrigatório.");
      return;
    }

    if (!type.trim()) {
      toast.error("O tipo do dragão é obrigatório.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateDragon(id, {
        name: name.trim(),
        type: type.trim(),
        imageUrl: imageUrl.trim() || undefined,
      });
      toast.success(`Dragão "${name.trim()}" atualizado com sucesso!`);
      router.push("/dragons");
    } catch {
      toast.error("Falha ao atualizar o dragão. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#050505]">
      {/* Background Cinematográfico */}
      <div className="fixed inset-0 pointer-events-none">
        <Image
          src="/images/detail-bg.webp"
          alt="Paisagem de Edição"
          fill
          priority
          className="object-cover object-center opacity-30 scale-105"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-brightness-95" />
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

      {/* Loading inicial */}
      {isLoading && (
        <div className="relative z-10 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-sm text-white/60">Carregando dados do dragão...</p>
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

      {/* Card de Edição com Vidro */}
      {!isLoading && !error && (
        <div
          className="relative z-10 w-full max-w-[460px] rounded-[2rem] p-7 sm:p-9 text-white shadow-2xl my-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.06) 100%)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: "1px solid rgba(255, 255, 255, 0.28)",
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.45), inset 0 1px 1px 0 rgba(255, 255, 255, 0.35)",
          }}
        >
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wider text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 uppercase mb-2">
              <Pencil className="w-3 h-3" />
              Editar Registro
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Atualizar Dragão
            </h1>
            <p className="text-xs text-white/75 mt-1">
              Modifique as informações ou a fotografia do dragão.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome do Dragão */}
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1.5">
                Nome do Dragão <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do dragão"
                className="w-full h-11 px-4 text-sm rounded-xl text-white placeholder:text-white/45 focus:outline-none focus:border-emerald-400 transition-all"
                style={{
                  background: "rgba(255, 255, 255, 0.07)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
                required
              />
            </div>

            {/* Tipo do Dragão */}
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1.5">
                Tipo / Elemento <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Tipo do dragão"
                className="w-full h-11 px-4 text-sm rounded-xl text-white placeholder:text-white/45 focus:outline-none focus:border-emerald-400 transition-all"
                style={{
                  background: "rgba(255, 255, 255, 0.07)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
                required
              />
            </div>

            {/* Anexo de Imagem */}
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1.5">
                Fotografia / Ilustração do Dragão <span className="text-white/40">(Opcional)</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative w-full h-44 rounded-xl overflow-hidden border border-emerald-500/40 group">
                  <Image
                    src={imagePreview}
                    alt="Foto do dragão"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs font-medium bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-white transition-colors"
                    >
                      Alterar foto
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1.5 bg-red-500/30 hover:bg-red-500/50 backdrop-blur-md rounded-lg text-red-200 transition-colors"
                      title="Remover foto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] bg-black/60 backdrop-blur-sm text-emerald-300 font-mono">
                    ✓ Foto anexada
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-28 rounded-xl border border-dashed border-white/25 hover:border-emerald-400/60 bg-white/[0.04] hover:bg-white/[0.08] transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-center p-3"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/90">
                      Clique para anexar ou trocar a imagem
                    </p>
                    <p className="text-[10px] text-white/45 mt-0.5">
                      PNG, JPG, WEBP até 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Botão Salvar Alterações */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 mt-4 rounded-xl text-white font-semibold text-sm shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              style={{
                background:
                  "linear-gradient(90deg, #9acd32 0%, #22c55e 50%, #16a34a 100%)",
                boxShadow: "0 8px 20px -4px rgba(34, 197, 94, 0.45)",
              }}
            >
              {isSubmitting ? (
                <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
