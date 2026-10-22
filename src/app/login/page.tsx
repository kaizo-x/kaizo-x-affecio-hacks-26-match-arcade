import Link from "next/link";
import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthModal";
import { AuthShell } from "@/components/auth/AuthShell";

export const metadata: Metadata = {
  title: "Sign in · MatchArcade 🎮",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Player 1, ready?"
      title="Turn a match into a conversation."
      subtitle="MatchArcade replaces awkward openers with shared arcade rounds — trivia, riddles and two truths, played together in real time."
      footer={
        <>
          New to the arcade?{" "}
          <Link href="/register" className="font-semibold text-rose-soft underline-offset-4 hover:underline">
            Create your player card
          </Link>
        </>
      }
    >
      <AuthForm mode="login" />
    </AuthShell>
  );
}
