"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, AuthContextType } from "../types/auth-types";

const AUTH_STORAGE_KEY = "@dragon_sanctuary_user";

// Credenciais fixas solicitadas no desafio técnico
export const FIXED_USER_CREDENTIALS = {
  email: "admin@email.com",
  password: "123456",
  name: "Guardião Ancestral",
  role: "Mestre dos Dragões",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  // Carrega o usuário salvo no localStorage na inicialização
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Proteção de rotas no cliente
  useEffect(() => {
    if (isLoading) return;

    const isAuthRoute = pathname === "/login";

    if (!user && !isAuthRoute) {
      router.replace("/login");
    } else if (user && isAuthRoute) {
      router.replace("/dragons");
    }
  }, [user, isLoading, pathname, router]);

  const login = useCallback(
    async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
      // Simula uma pequena latência realista de rede
      await new Promise((resolve) => setTimeout(resolve, 600));

      const normalizedEmail = email.trim().toLowerCase();
      if (
        normalizedEmail === FIXED_USER_CREDENTIALS.email &&
        pass === FIXED_USER_CREDENTIALS.password
      ) {
        const authenticatedUser: User = {
          email: FIXED_USER_CREDENTIALS.email,
          name: FIXED_USER_CREDENTIALS.name,
          role: FIXED_USER_CREDENTIALS.role,
        };

        setUser(authenticatedUser);
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
        } catch {
          // ignore localStorage failure
        }
        return { success: true };
      }

      return {
        success: false,
        error: "Credenciais inválidas. Use admin@email.com e a senha 123456.",
      };
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
    router.replace("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return context;
}
