import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0f172a",
          soft: "#131c33",
          deep: "#0a1120",
        },
        rose: {
          DEFAULT: "#f43f5e",
          soft: "#fb7185",
        },
        accent: {
          purple: "#a855f7",
          violet: "#c084fc",
        },
        muted: "#94a3b8",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        glow: "0 0 40px -12px rgba(244, 63, 94, 0.55)",
        "glow-purple": "0 0 45px -14px rgba(168, 85, 247, 0.6)",
        card: "0 24px 60px -30px rgba(2, 6, 23, 0.9)",
      },
      backgroundImage: {
        "arcade-radial":
          "radial-gradient(circle at 15% 12%, rgba(244,63,94,0.20), transparent 45%), radial-gradient(circle at 85% 8%, rgba(168,85,247,0.22), transparent 42%), radial-gradient(circle at 50% 100%, rgba(56,189,248,0.10), transparent 55%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(244,63,94,0.45)" },
          "70%": { boxShadow: "0 0 0 14px rgba(244,63,94,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(244,63,94,0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
        float: "float 5s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
        "pulse-ring": "pulseRing 2s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
