import React from "react";
import Image from "next/image";
import { AppHeader } from "@/components/shared/app-header";
import { AppFooter } from "@/components/shared/app-footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Subtle atmospheric background pattern using the custom generated landscape */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-15 dark:opacity-10 overflow-hidden">
        <Image
          src="/images/dashboard-bg.webp"
          alt="Atmosphere texture"
          fill
          className="object-cover object-center filter grayscale contrast-125"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-background/90" />
      </div>

      <AppHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {children}
      </main>

      <AppFooter />
    </div>
  );
}
