import { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export const Card = ({ children, className }: CardProps) => (
  <section
    className={cn(
      "rounded-xl border border-slate-700/60 bg-brand-slate p-6 shadow-lg",
      className,
    )}
  >
    {children}
  </section>
);
