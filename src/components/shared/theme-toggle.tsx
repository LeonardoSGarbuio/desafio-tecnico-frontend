"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9" aria-label="Toggle theme">
        <Sun className="h-4 w-4 opacity-50" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 border-emerald-500/30 bg-card/60 hover:border-emerald-400"
      aria-label="Alternar tema"
      title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-brass-400 transition-all hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-emerald-600 transition-all hover:-rotate-12" />
      )}
    </Button>
  );
}
