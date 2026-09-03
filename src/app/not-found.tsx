import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center p-6 bg-black overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <Image
          src="/images/dragons-flight.webp"
          alt="Dragões em voo sobre montanhas ao pôr do sol"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />
      </div>

      <div className="relative z-10 max-w-lg text-center space-y-6 rounded-3xl border border-emerald-500/20 bg-card/60 p-8 sm:p-12 backdrop-blur-xl shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brass-500/30 bg-brass-500/10 text-brass-300 text-xs font-mono font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Coordenadas Perdidas nos Céus</span>
        </div>

        <h1 className="font-display text-5xl sm:text-7xl font-black tracking-widest text-white">
          404
        </h1>

        <p className="font-serif italic text-base sm:text-lg text-white/80 leading-relaxed">
          Você se aventurou além dos limites mapeados do santuário. Os dragões não voam por estas terras.
        </p>

        <div className="pt-2">
          <Link href="/dragons">
            <Button variant="glow" size="lg" className="flex items-center gap-2 mx-auto">
              <ArrowLeft className="w-4 h-4" />
              Retornar ao Santuário
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
