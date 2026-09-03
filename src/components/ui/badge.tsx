import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 tracking-wide uppercase",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-emerald-600/20 text-emerald-300 border border-emerald-500/30",
        secondary:
          "border-transparent bg-brass-600/20 text-brass-300 border border-brass-500/30",
        destructive:
          "border-transparent bg-destructive/20 text-destructive-foreground border border-destructive/30",
        outline: "text-foreground border border-border",
        fire: "bg-orange-500/15 text-orange-300 border border-orange-500/30 shadow-[0_0_12px_rgba(249,115,22,0.2)]",
        ice: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]",
        storm: "bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.2)]",
        earth: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
        void: "bg-zinc-800 text-zinc-300 border border-zinc-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
