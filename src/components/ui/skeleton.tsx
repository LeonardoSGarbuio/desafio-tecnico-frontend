import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/60 dark:bg-emerald-950/40 border border-emerald-500/10",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
