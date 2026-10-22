import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthContextProvider } from "@/context/AuthContext";
import { SafetyProvider } from "@/context/SafetyProvider";
import { ToastProvider } from "@/context/ToastProvider";

export const metadata: Metadata = {
  title: "MatchArcade 🎮 — Match to Conversation",
  description:
    "A dating and social discovery arcade: match, break the ice with arcade games, and turn a match into a real conversation.",
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          <ToastProvider>
            <SafetyProvider>{children}</SafetyProvider>
          </ToastProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
