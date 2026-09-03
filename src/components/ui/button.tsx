"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-950/40 hover:shadow-emerald-500/25 border border-emerald-400/20",
        secondary:
          "bg-brass-600/90 text-white hover:bg-brass-500 shadow-md shadow-brass-950/40 hover:shadow-brass-500/25 border border-brass-400/30 font-semibold",
        outline:
          "border border-emerald-500/30 bg-card/40 backdrop-blur-sm text-foreground hover:bg-emerald-950/40 hover:border-emerald-400/60 hover:text-emerald-300",
        ghost:
          "text-muted-foreground hover:text-foreground hover:bg-emerald-950/30",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm shadow-destructive/20 border border-destructive/30",
        glow:
          "bg-gradient-to-r from-emerald-600 via-emerald-500 to-brass-500 text-white font-semibold hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] border border-emerald-300/30",
        glass:
          "bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/40",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base tracking-wide",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
