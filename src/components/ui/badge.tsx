import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-1.5 py-px text-[10px] font-normal leading-tight",
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
