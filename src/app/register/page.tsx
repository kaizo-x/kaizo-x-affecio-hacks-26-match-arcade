import Link from "next/link";
import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthModal";
import { AuthShell } from "@/components/auth/AuthShell";

export const metadata: Metadata = {
  title: "Create account · MatchArcade 🎮",
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="New player"
      title="Build your player card."
      subtitle="Tell us who you are and who you'd like to meet. Next up: a three-step setup for your avatar, vibe tags and safety preferences."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-rose-soft underline-offset-4 hover:underline">
            Sign in instead
          </Link>
        </>
      }
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}
