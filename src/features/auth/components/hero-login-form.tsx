"use client";

import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../schemas/auth-schema";
import { useAuth, FIXED_USER_CREDENTIALS } from "../context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowRight, KeyRound, Sparkles } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";

export function HeroLoginForm() {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // GSAP Animations: Parallax do mouse & revelação cinematográfica
  useGSAP(
    () => {
      // Timeline de revelação de entrada
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-subheadline", {
        opacity: 0,
        y: -15,
        duration: 0.8,
        delay: 0.2,
      })
        .from(
          ".hero-main-title",
          {
            opacity: 0,
            y: 40,
            duration: 1.2,
            letterSpacing: "0.4em",
          },
          "-=0.5"
        )
        .from(
          ".hero-quote",
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
          },
          "-=0.6"
        )
        .from(
          ".hero-form-box",
          {
            opacity: 0,
            y: 35,
            duration: 0.9,
          },
          "-=0.4"
        );

      // Efeito Parallax suave de mouse move
      const handleMouseMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        const xPercent = (e.clientX / innerWidth - 0.5) * 15;
        const yPercent = (e.clientY / innerHeight - 0.5) * 15;

        gsap.to(".hero-bg-layer", {
          x: xPercent,
          y: yPercent,
          duration: 1.2,
          ease: "power2.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    },
    { scope: containerRef }
  );

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        toast.success("Portal aberto! Seja bem-vindo ao Santuário dos Dragões.");
      } else {
        toast.error(result.error || "Credenciais inválidas.");
        // Pequena animação GSAP de sacudida no erro
        gsap.fromTo(
          ".hero-form-box",
          { x: -8 },
          { x: 8, duration: 0.08, repeat: 4, yoyo: true, ease: "power1.inOut" }
        );
      }
    } catch {
      toast.error("Ocorreu um erro ao tentar acessar o santuário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setValue("email", FIXED_USER_CREDENTIALS.email, { shouldValidate: true });
    setValue("password", FIXED_USER_CREDENTIALS.password, { shouldValidate: true });
    toast.info("Credenciais de administrador preenchidas para teste.");
  };

  return (
    <div ref={containerRef} className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center text-center">
      {/* Top micro badge */}
      <div className="hero-subheadline inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md mb-6">
        <Sparkles className="w-3.5 h-3.5 text-brass-300" />
        <span className="font-display text-[11px] sm:text-xs tracking-[0.25em] text-white/90 uppercase font-semibold">
          Plataforma de Gerenciamento Ancestral
        </span>
      </div>

      {/* Main Title - Inspired by "EXPLORE" reference */}
      <h1 className="hero-main-title font-display text-4xl sm:text-7xl lg:text-8xl font-black tracking-[0.2em] sm:tracking-[0.25em] text-white uppercase drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] mb-4 select-none">
        SANCTUARY
      </h1>

      {/* Editorial Subtitle */}
      <p className="hero-quote font-serif italic text-lg sm:text-2xl text-white/80 max-w-xl mb-10 drop-shadow-md">
        &ldquo;Onde criaturas ancestrais encontram refúgio e o lendário se torna realidade.&rdquo;
      </p>

      {/* Minimalist Floating Login Box */}
      <div className="hero-form-box w-full max-w-md bg-black/55 backdrop-blur-xl border border-white/15 rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-left">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <h2 className="font-display text-sm font-semibold tracking-wider text-white uppercase">
              Acesso do Guardião
            </h2>
          </div>

          <button
            type="button"
            onClick={handleFillDemo}
            className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors underline decoration-emerald-500/40 underline-offset-4"
            title="Preencher com admin@email.com / 123456"
          >
            Preencher Demo
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-white/70 uppercase mb-1.5">
              E-mail do Guardião
            </label>
            <Input
              type="email"
              placeholder="admin@email.com"
              error={errors.email?.message}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:border-emerald-400 focus-visible:ring-emerald-400/40"
              {...register("email")}
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-white/70 uppercase mb-1.5">
              Chave de Acesso
            </label>
            <Input
              type="password"
              placeholder="••••••"
              error={errors.password?.message}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:border-emerald-400 focus-visible:ring-emerald-400/40"
              {...register("password")}
            />
          </div>

          <Button
            type="submit"
            variant="glow"
            size="lg"
            isLoading={isSubmitting}
            className="w-full mt-2 font-display tracking-widest uppercase text-xs"
          >
            <span>Despertar Portal</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>

          <p className="text-[11px] text-center text-white/50 pt-2 font-mono">
            Credenciais padrão: admin@email.com / 123456
          </p>
        </form>
      </div>
    </div>
  );
}
