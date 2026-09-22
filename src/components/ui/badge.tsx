import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-1.5 py-0.5 font-mono text-[0.68rem] uppercase tracking-wider leading-none",
  {
    variants: {
      variant: {
        default: "border-border text-muted-foreground",
        accent: "border-accent/50 text-accent-bright",
        good: "border-good/50 text-good",
        bad: "border-bad/50 text-bad",
        warn: "border-warn/50 text-warn",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
