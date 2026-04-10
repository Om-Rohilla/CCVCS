"use client";

import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "destructive";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "inline-flex items-center justify-center rounded-md bg-brand-gold text-brand-white font-medium px-4 py-2 shadow-sm transition duration-200 ease-out hover:brightness-110 hover:scale-[1.02] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-navy disabled:opacity-60 disabled:cursor-not-allowed",
  secondary:
    "inline-flex items-center justify-center rounded-md border border-brand-gold/70 text-brand-light px-4 py-2 transition duration-200 hover:bg-brand-gold hover:text-brand-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-navy disabled:opacity-60 disabled:cursor-not-allowed",
  destructive:
    "inline-flex items-center justify-center rounded-md bg-red-600 text-brand-white font-medium px-4 py-2 shadow-sm transition duration-200 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-brand-navy disabled:opacity-60 disabled:cursor-not-allowed",
};

export const Button = ({
  className,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={cn(variantClasses[variant], className)}
    {...props}
  />
);
