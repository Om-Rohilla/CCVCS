import { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className, ...props }: InputProps) => (
  <input
    className={cn(
      "w-full rounded-lg border border-slate-700 bg-brand-slate px-3 py-2 text-sm text-brand-white placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold",
      className,
    )}
    {...props}
  />
);
