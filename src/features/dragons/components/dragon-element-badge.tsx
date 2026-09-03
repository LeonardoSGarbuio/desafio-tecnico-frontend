import React from "react";
import { Badge } from "@/components/ui/badge";
import { Flame, Snowflake, Zap, Mountain, Sun, Moon, Sparkles, Compass, Shield } from "lucide-react";

interface DragonElementBadgeProps {
  type: string;
  className?: string;
  showIcon?: boolean;
}

export function DragonElementBadge({
  type,
  className,
  showIcon = true,
}: DragonElementBadgeProps) {
  const normalized = (type || "").toLowerCase().trim();

  let variant: "fire" | "ice" | "storm" | "earth" | "default" | "secondary" | "void" = "default";
  let Icon = Sparkles;

  if (
    normalized.includes("fogo") ||
    normalized.includes("fire") ||
    normalized.includes("chama") ||
    normalized.includes("lava")
  ) {
    variant = "fire";
    Icon = Flame;
  } else if (
    normalized.includes("gelo") ||
    normalized.includes("ice") ||
    normalized.includes("frost") ||
    normalized.includes("frio")
  ) {
    variant = "ice";
    Icon = Snowflake;
  } else if (
    normalized.includes("tempestade") ||
    normalized.includes("storm") ||
    normalized.includes("trov") ||
    normalized.includes("plasma") ||
    normalized.includes("raio")
  ) {
    variant = "storm";
    Icon = Zap;
  } else if (
    normalized.includes("terra") ||
    normalized.includes("earth") ||
    normalized.includes("pedra") ||
    normalized.includes("rocha")
  ) {
    variant = "earth";
    Icon = Mountain;
  } else if (
    normalized.includes("luz") ||
    normalized.includes("light") ||
    normalized.includes("solar")
  ) {
    variant = "secondary";
    Icon = Sun;
  } else if (
    normalized.includes("trevas") ||
    normalized.includes("sombra") ||
    normalized.includes("dark") ||
    normalized.includes("void")
  ) {
    variant = "void";
    Icon = Moon;
  } else if (
    normalized.includes("espiritual") ||
    normalized.includes("arcano") ||
    normalized.includes("mágico")
  ) {
    variant = "default";
    Icon = Sparkles;
  } else if (normalized.includes("ocidental") || normalized.includes("clássico")) {
    variant = "secondary";
    Icon = Shield;
  } else {
    variant = "default";
    Icon = Compass;
  }

  return (
    <Badge variant={variant} className={`gap-1.5 py-1 px-3 text-xs tracking-wider ${className || ""}`}>
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      <span>{type || "Elemental"}</span>
    </Badge>
  );
}
