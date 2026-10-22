import type { FieldErrors, LoginInput, RegisterInput } from "@/types";

export const MIN_AGE = 18;
export const MAX_AGE = 99;

export type RegisterField = keyof RegisterInput;
export type LoginField = keyof LoginInput;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export function validateRegister(input: RegisterInput): FieldErrors<RegisterField> {
  const errors: FieldErrors<RegisterField> = {};

  if (!input.name.trim()) {
    errors.name = "Tell us what to call you.";
  } else if (input.name.trim().length < 2) {
    errors.name = "Name needs at least 2 characters.";
  }

  if (!input.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(input.email.trim())) {
    errors.email = "That email doesn't look right.";
  }

  if (!input.password) {
    errors.password = "Create a password.";
  } else if (input.password.length < 8) {
    errors.password = "Use at least 8 characters.";
  } else if (!/\d/.test(input.password)) {
    errors.password = "Add at least one number.";
  }

  if (!Number.isFinite(input.age)) {
    errors.age = "Age is required.";
  } else if (input.age < MIN_AGE) {
    errors.age = `MatchArcade is strictly ${MIN_AGE}+. You must be ${MIN_AGE} or older to join.`;
  } else if (input.age > MAX_AGE) {
    errors.age = "Please enter a realistic age.";
  }

  if (!input.gender) {
    errors.gender = "Pick how you identify.";
  }

  if (!input.interestedIn) {
    errors.interestedIn = "Pick who you'd like to meet.";
  }

  return errors;
}

export function validateLogin(input: LoginInput): FieldErrors<LoginField> {
  const errors: FieldErrors<LoginField> = {};

  if (!input.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(input.email.trim())) {
    errors.email = "That email doesn't look right.";
  }

  if (!input.password) {
    errors.password = "Password is required.";
  }

  return errors;
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean);
}
