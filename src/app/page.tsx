"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, Eye, EyeOff } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";

const FIXED_CREDENTIALS = {
  email: "admin@email.com",
  password: "123456",
};

export default function LoginPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Se já está logado, redirecionar direto para /dragons
  useEffect(() => {
    try {
      router.prefetch("/dragons");
      const stored = localStorage.getItem("@dragon_sanctuary_user");
      if (stored) router.replace("/dragons");
    } catch {
      // ignore
    }
  }, [router]);

  // Efeito Parallax sutil com GSAP acompanhando o mouse
  useGSAP(
    () => {
      // Animação de entrada suave do card de vidro
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 24,
        scale: 0.96,
        duration: 1,
        ease: "power3.out",
      });

      // Parallax suave no fundo ao mover o mouse
      const handleMouseMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        const xPercent = (e.clientX / innerWidth - 0.5) * 16;
        const yPercent = (e.clientY / innerHeight - 0.5) * 16;

        gsap.to(".login-bg-image", {
          x: xPercent,
          y: yPercent,
          duration: 1.5,
          ease: "power2.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    },
    { scope: containerRef }
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Por favor, preencha o e-mail e a senha.");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const normalizedEmail = email.trim().toLowerCase();
    if (
      normalizedEmail === FIXED_CREDENTIALS.email &&
      password === FIXED_CREDENTIALS.password
    ) {
      toast.success("Login realizado com sucesso! Bem-vindo.");
      try {
        localStorage.setItem(
          "@dragon_sanctuary_user",
          JSON.stringify({
            email: FIXED_CREDENTIALS.email,
            name: "Guardião Ancestral",
            role: "Administrador",
          })
        );
      } catch {
        // ignore
      }
      setIsLoading(false);
      router.push("/dragons");
    } else {
      setIsLoading(false);
      toast.error("Credenciais inválidas. Use admin@email.com / 123456.");
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { x: -8 },
          { x: 8, duration: 0.07, repeat: 4, yoyo: true, ease: "power1.inOut" }
        );
      }
    }
  };

  const handleFillDemo = () => {
    setEmail(FIXED_CREDENTIALS.email);
    setPassword(FIXED_CREDENTIALS.password);
    toast.info("Credenciais preenchidas: admin@email.com / 123456");
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden"
    >
      {/* 1. Imagem de fundo em tela cheia com efeito Parallax */}
      <div className="login-bg-image absolute -inset-8 scale-105 pointer-events-none will-change-transform">
        <Image
          src="/images/login-hero.webp"
          alt="Paisagem ao fundo"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Overlay sutil para garantir contraste e profundidade */}
        <div className="absolute inset-0 bg-black/25 backdrop-brightness-95" />
      </div>

      {/* 2. Card de Login com Efeito de Vidro (Glassmorphism limpo, conforme referência) */}
      <div
        ref={cardRef}
        suppressHydrationWarning
        className="relative z-10 w-full max-w-[390px] rounded-[2rem] p-8 sm:p-9 text-white shadow-2xl transition-all"
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.08) 100%)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.45), inset 0 1px 1px 0 rgba(255, 255, 255, 0.35)",
        }}
      >
        {/* Cabeçalho do Card */}
        <div className="mb-7">
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">
            Login
          </h1>
          <p className="text-xs text-white/80 font-normal mt-1.5 leading-relaxed">
            Welcome back please login to your account
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} suppressHydrationWarning className="space-y-4">
          {/* Input de E-mail / User Name */}
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="User Name"
              className="w-full h-12 pl-4 pr-11 text-sm rounded-xl text-white placeholder:text-white/65 focus:outline-none transition-all"
              style={{
                background: "rgba(255, 255, 255, 0.07)",
                border: "1px solid rgba(255, 255, 255, 0.35)",
              }}
              required
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none">
              <User className="w-4 h-4" />
            </div>
          </div>

          {/* Input de Senha */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full h-12 pl-4 pr-11 text-sm rounded-xl text-white placeholder:text-white/65 focus:outline-none transition-all"
              style={{
                background: "rgba(255, 255, 255, 0.07)",
                border: "1px solid rgba(255, 255, 255, 0.35)",
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              title={showPassword ? "Ocultar senha" : "Exibir senha"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Linha Remember Me + Preencher Demo */}
          <div className="flex items-center justify-between text-xs text-white/80 pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-emerald-500 cursor-pointer"
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] text-white/90 hover:text-white underline underline-offset-2 transition-colors"
            >
              Preencher demo
            </button>
          </div>

          {/* Botão de Login em Degradê Verde Vibrante (idêntico à referência) */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-2 rounded-xl text-white font-semibold text-sm shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center"
            style={{
              background:
                "linear-gradient(90deg, #9acd32 0%, #22c55e 50%, #16a34a 100%)",
              boxShadow: "0 8px 20px -4px rgba(34, 197, 94, 0.45)",
            }}
          >
            {isLoading ? (
              <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              "Login"
            )}
          </button>

          {/* Link de Rodapé */}
          <div className="text-center pt-3 text-xs text-white/80">
            <span>Don&apos;t have an account? </span>
            <span
              onClick={handleFillDemo}
              className="text-white font-semibold underline cursor-pointer hover:text-white/90"
            >
              Signup
            </span>
          </div>
        </form>

        {/* Assinatura sutil inferior */}
        <div className="mt-8 text-center text-[10px] text-white/50 tracking-wider">
          Dragon Sanctuary Platform
        </div>
      </div>
    </div>
  );
}
