"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { Toaster } from "sonner";
import { AuthProvider } from "@/features/auth/context/auth-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            richColors
            closeButton
            theme="dark"
            toastOptions={{
              className: "font-sans border border-emerald-500/30 bg-card text-foreground shadow-emerald-glow",
            }}
          />
        </AuthProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
