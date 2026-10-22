"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, Cake, Heart, LogIn, Mail, Sparkles, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastProvider";
import { GENDER_OPTIONS, INTEREST_OPTIONS } from "@/data/profileOptions";
import { MIN_AGE, hasErrors, validateLogin, validateRegister, type RegisterField } from "@/lib/validation";
import { cn } from "@/lib/utils";
import type { FieldErrors, GenderIdentity, InterestedIn } from "@/types";

export type AuthMode = "login" | "register";

const COPY: Record<AuthMode, { heading: string; subheading: string }> = {
  login: {
    heading: "Welcome back 👋",
    subheading: "Sign in to pick up your matches and conversations.",
  },
  register: {
    heading: "Create your player card",
    subheading: `Takes under a minute. Strictly ${MIN_AGE}+ only.`,
  },
};

export interface AuthFormProps {
  mode: AuthMode;
  onModeChange?: (mode: AuthMode) => void;
  onSuccess?: () => void;
}

/** Shared glass login/register form wired to the mock AuthContext session. */
export function AuthForm({ mode, onModeChange, onSuccess }: AuthFormProps) {
  const { register, login, isBusy, isAuthenticated } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [interestedIn, setInterestedIn] = useState("");
  const [errors, setErrors] = useState<FieldErrors<RegisterField>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  const clearError = (field: RegisterField) => setErrors((current) => ({ ...current, [field]: undefined }));

  const switchMode = (next: AuthMode) => {
    setErrors({});
    setFormError(null);
    setPassword("");
    onModeChange?.(next);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (mode === "login") {
      const input = { email, password };
      const nextErrors = validateLogin(input);
      setErrors(nextErrors);
      if (hasErrors(nextErrors)) {
        toast.error("Check the highlighted fields", "We need a valid email and password to sign you in.");
        return;
      }
      const result = await login(input);
      if (!result.ok || !result.user) {
        setFormError(result.error ?? "We couldn't sign you in.");
        toast.error("Sign in failed", result.error ?? "Please try again.");
        return;
      }
      toast.success(`Welcome back, ${result.user.name}!`, "Your deck is ready — let's break some ice.");
      onSuccess?.();
      router.push("/");
      return;
    }

    const input = {
      name,
      email,
      password,
      age: Number(age),
      gender: gender as GenderIdentity,
      interestedIn: interestedIn as InterestedIn,
    };
    const nextErrors = validateRegister(input);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      const ageBlocked = Boolean(nextErrors.age?.includes(`${MIN_AGE}+`));
      toast.error(
        ageBlocked ? "Age requirement not met" : "Check the highlighted fields",
        ageBlocked
          ? `You must be ${MIN_AGE} or older to create a MatchArcade account.`
          : "Fix the details below and try again."
      );
      return;
    }

    const result = await register(input);
    if (!result.ok || !result.user) {
      setFormError(result.error ?? "We couldn't create your account.");
      toast.error("Registration failed", result.error ?? "Please try again.");
      return;
    }
    toast.success(`Welcome to MatchArcade, ${result.user.name}! 🎮`, "Let's finish your profile in three quick steps.");
    onSuccess?.();
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <h2 className="text-xl font-semibold text-white">{COPY[mode].heading}</h2>
        <p className="mt-1 text-xs text-muted">{COPY[mode].subheading}</p>
      </div>

      {mode === "register" ? (
        <Input
          label="Display name"
          placeholder="How should matches see you?"
          autoComplete="nickname"
          value={name}
          error={errors.name}
          onChange={(event) => {
            setName(event.target.value);
            clearError("name");
          }}
        />
      ) : null}

      <Input
        label="Email"
        type="email"
        icon={Mail}
        placeholder="you@example.com"
        autoComplete="email"
        value={email}
        error={errors.email}
        onChange={(event) => {
          setEmail(event.target.value);
          clearError("email");
        }}
      />

      <Input
        label="Password"
        type="password"
        placeholder={mode === "register" ? "At least 8 characters with a number" : "••••••••"}
        autoComplete={mode === "register" ? "new-password" : "current-password"}
        value={password}
        error={errors.password}
        hint={mode === "register" ? "Use 8+ characters and include at least one number." : undefined}
        onChange={(event) => {
          setPassword(event.target.value);
          clearError("password");
        }}
      />

      {mode === "register" ? (
        <>
          <Input
            label={`Age (${MIN_AGE}+ only)`}
            type="number"
            icon={Cake}
            inputMode="numeric"
            min={1}
            max={120}
            placeholder="e.g. 24"
            value={age}
            error={errors.age}
            onChange={(event) => {
              setAge(event.target.value);
              clearError("age");
            }}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="I identify as"
              options={GENDER_OPTIONS}
              placeholder="Choose one"
              value={gender}
              error={errors.gender}
              onChange={(event) => {
                setGender(event.target.value);
                clearError("gender");
              }}
            />
            <Select
              label="Show me"
              options={INTEREST_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
              placeholder="Choose one"
              value={interestedIn}
              error={errors.interestedIn}
              onChange={(event) => {
                setInterestedIn(event.target.value);
                clearError("interestedIn");
              }}
            />
          </div>

          <p className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-[11px] leading-relaxed text-muted">
            <Heart className="h-3.5 w-3.5 shrink-0 text-rose" />
            By joining you agree to keep MatchArcade kind. Harassment, fake profiles and underage users get removed.
          </p>
        </>
      ) : null}

      {formError ? (
        <p className="flex items-center gap-2 rounded-2xl border border-rose/40 bg-rose/10 px-3.5 py-2.5 text-xs font-medium text-rose-soft">
          <AlertTriangle className="h-3.5 w-3.5" />
          {formError}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        icon={mode === "login" ? LogIn : UserPlus}
        loading={isBusy}
        fullWidth
      >
        {mode === "login" ? "Sign in" : "Create account"}
      </Button>

      {onModeChange ? (
        <p className="text-center text-xs text-muted">
          {mode === "login" ? "New to the arcade? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => switchMode(mode === "login" ? "register" : "login")}
            className="font-semibold text-rose-soft underline-offset-4 hover:underline"
          >
            {mode === "login" ? "Create your player card" : "Sign in instead"}
          </button>
        </p>
      ) : null}
    </form>
  );
}

export interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

const TABS: Array<{ id: AuthMode; label: string }> = [
  { id: "login", label: "Sign in" },
  { id: "register", label: "Create account" },
];

export function AuthModal({ open, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  useEffect(() => {
    if (open) setMode(initialMode);
  }, [open, initialMode]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title="MatchArcade 🎮"
      description="Turn a match into a conversation."
      headerAccessory={
        <span className="hidden items-center gap-1.5 rounded-full border border-rose/40 bg-rose/15 px-2.5 py-1 text-[11px] font-semibold text-rose-soft sm:inline-flex">
          <Sparkles className="h-3 w-3" />
          18+ only
        </span>
      }
    >
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-md">
        {TABS.map((tab) => {
          const isActive = tab.id === mode;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id)}
              aria-pressed={isActive}
              className={cn(
                "relative rounded-xl px-3 py-2 text-xs font-semibold transition-colors",
                isActive ? "text-white" : "text-muted hover:text-white"
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="auth-modal-tab"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-rose/80 to-accent-purple/80"
                />
              ) : null}
              <span className="relative">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <AuthForm mode={mode} onModeChange={setMode} onSuccess={onClose} />

      <p className="mt-5 border-t border-white/10 pt-4 text-center text-[11px] text-muted">
        Accounts live in this browser for the demo build —{" "}
        <Link href="/register" onClick={onClose} className="font-semibold text-rose-soft underline-offset-4 hover:underline">
          see the full sign-up page
        </Link>
      </p>
    </Modal>
  );
}
