import React from "react";
import Link from "next/link";
import Image from "next/image";

export function AppFooter() {
  return (
    <footer className="w-full border-t border-emerald-500/20 bg-card/30 backdrop-blur-md py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-emerald-500/30">
            <Image
              src="/images/dragon-emblem.webp"
              alt="Dragon Sanctuary Emblem"
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
          <div>
            <p className="font-display text-sm font-bold tracking-widest text-foreground uppercase">
              Dragon Sanctuary
            </p>
            <p className="text-xs text-muted-foreground font-serif">
              Arquivamento e Gerenciamento Dracônico
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <Link href="/dragons" className="hover:text-primary transition-colors">
            Lista de Dragões
          </Link>
          <Link href="/dragons/new" className="hover:text-primary transition-colors">
            Cadastrar Dragão
          </Link>
          <span className="text-border">|</span>
          <span className="font-mono text-[11px]">API MockAPI v1</span>
          <span className="text-border">|</span>
          <span className="text-emerald-400 font-medium">Next.js 15 & GSAP</span>
        </div>

        <p className="text-xs text-muted-foreground/70">
          Desafio Técnico Frontend &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
