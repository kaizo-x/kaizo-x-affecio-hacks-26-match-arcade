"use client";

import { useId, type SelectHTMLAttributes } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export function Select({
  label,
  options,
  error,
  placeholder = "Select an option",
  className,
  id,
  value,
  ...rest
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="w-full">
      <label htmlFor={selectId} className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          aria-invalid={Boolean(error)}
          className={cn(
            "h-12 w-full appearance-none rounded-2xl border bg-white/5 px-4 pr-10 text-sm text-white backdrop-blur-md transition-colors focus:outline-none focus:ring-2 [&>option]:bg-ink-soft [&>option]:text-white",
            error
              ? "border-rose/60 focus:ring-rose/50"
              : "border-white/10 focus:border-accent-purple/60 focus:ring-accent-purple/40",
            className
          )}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      </div>
      {error ? (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-soft">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
