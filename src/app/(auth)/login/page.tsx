import React from "react";
import Image from "next/image";
import { HeroLoginForm } from "@/features/auth/components/hero-login-form";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image Layer with Parallax Target */}
      <div className="hero-bg-layer absolute -inset-8 scale-105 pointer-events-none transition-transform will-change-transform">
        <Image
          src="/images/login-hero.webp"
          alt="Paisagem montanhosa com dragão colossal no santuário"
          fill
          priority
          className="object-cover object-center brightness-75 contrast-110"
          sizes="100vw"
        />

        {/* Ambient Overlays for Cinematic Contrast & Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-emerald-950/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-vignette" />
        <div className="absolute inset-0 bg-noise opacity-30" />
      </div>

      {/* Floating ambient particles (CSS pure) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
        <div className="absolute top-1/4 left-1/5 w-1.5 h-1.5 rounded-full bg-emerald-400/60 blur-[1px] animate-float" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-brass-400/50 blur-[1px] animate-float [animation-delay:2s]" />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-emerald-300/40 blur-[1px] animate-float [animation-delay:4s]" />
        <div className="absolute top-2/3 right-1/3 w-2 h-2 rounded-full bg-brass-300/40 blur-[1px] animate-float [animation-delay:1.5s]" />
      </div>

      {/* Hero Content & Login Form */}
      <HeroLoginForm />

      {/* Bottom Subtle Copyright / Status */}
      <div className="absolute bottom-4 inset-x-0 z-10 flex items-center justify-between px-6 text-[10px] tracking-widest text-white/40 uppercase font-mono">
        <span>Sistema de Defesa do Santuário</span>
        <span className="hidden sm:inline">MockAPI v1 • Guardião Ativo</span>
        <span>Acesso Restrito</span>
      </div>
    </main>
  );
}
