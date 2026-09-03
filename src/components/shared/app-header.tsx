"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "../ui/button";
import { LogOut, PlusCircle, Compass, Shield } from "lucide-react";
import { toast } from "sonner";

export function AppHeader() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    toast.info("Você saiu do santuário ancestral.");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-500/20 bg-background/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <Link href="/dragons" className="flex items-center gap-3.5 group">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-emerald-500/30 bg-emerald-950/40 p-1 transition-all duration-300 group-hover:border-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Image
              src="/images/dragon-emblem.webp"
              alt="Dragon Sanctuary Logo"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="44px"
              priority
            />
          </div>
          <div>
            <span className="font-display text-lg sm:text-xl font-bold tracking-[0.15em] text-foreground group-hover:text-emerald-400 transition-colors uppercase block">
              Dragon Sanctuary
            </span>
            <span className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase block font-serif">
              Portal do Guardião
            </span>
          </div>
        </Link>

        {/* Center / Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-card/50 p-1.5 rounded-full border border-emerald-500/20 backdrop-blur-md">
          <Link
            href="/dragons"
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              pathname === "/dragons"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-950/40"
                : "text-muted-foreground hover:text-foreground hover:bg-emerald-950/30"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Catálogo dos Dragões
          </Link>

          <Link
            href="/dragons/new"
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              pathname === "/dragons/new"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-950/40"
                : "text-muted-foreground hover:text-foreground hover:bg-emerald-950/30"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Despertar Dragão
          </Link>
        </nav>

        {/* User Status & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user && (
            <div className="hidden lg:flex flex-col items-end mr-1 text-right">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-brass-400" />
                <span className="text-xs font-semibold text-foreground">
                  {user.name}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">
                {user.email}
              </span>
            </div>
          )}

          <ThemeToggle />

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs border-destructive/30 hover:bg-destructive/15 hover:border-destructive/60 hover:text-destructive text-muted-foreground transition-all"
            title="Sair da conta"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desconectar</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
