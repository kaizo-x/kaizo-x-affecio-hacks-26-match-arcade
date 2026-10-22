"use client";

import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, icon: Icon, className, type = "text", id, ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [isRevealed, setRevealed] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword && isRevealed ? "text" : type;

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </label>
      <div className="relative">
        {Icon ? (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        ) : null}
        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            "h-12 w-full rounded-2xl border bg-white/5 px-4 text-sm text-white placeholder:text-slate-500 backdrop-blur-md transition-colors focus:outline-none focus:ring-2",
            Icon && "pl-10",
            isPassword && "pr-11",
            error
              ? "border-rose/60 focus:ring-rose/50"
              : "border-white/10 focus:border-accent-purple/60 focus:ring-accent-purple/40",
            className
          )}
          {...rest}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            aria-label={isRevealed ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted transition hover:bg-white/10 hover:text-white"
          >
            {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        ) : null}
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-soft">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
