# MatchArcade 🎮💬

> **Hackathon:** AFFECIO HACKS '26  
> **Track:** Track 2 — From Match to Conversation  
> **Team Name:** kaizo-x  
> **Team Members:** Sayali Pagare

---

## 📌 Project Overview
**MatchArcade** tackles post-match ghosting in online dating by replacing awkward text openers with instant, 60-second co-op mini-games directly inside the chat interface. Game outcomes automatically generate dynamic conversation starters to kickstart organic dialogue. Built with Next.js, Tailwind CSS, and real-time sync, the platform also integrates identity verification and safety controls for a secure, engaging experience.

---

## 🚀 Progress & Commit Logs

### 🔹 First Commit (`Initial Commit & Phase 1 Scaffolding`)
In our first commit, we built the foundational architecture, design system, user authentication, and trust/safety infrastructure:
- **Project Setup:** Configured Next.js 14+ App Router, TypeScript, and Tailwind CSS.
- **Dating UI Design System:** Implemented a modern dark-mode aesthetic with glassmorphism, warm rose (`#f43f5e`), and arcade purple (`#a855f7`) accents.
- **Auth Engine & Onboarding:** Built registration screens with 18+ age verification checks, login session state, and a multi-step profile avatar & vibe-tag setup.
- **Privacy & Safety Control Panel:** Created a dedicated safety drawer featuring incognito mode toggles, selfie verification triggers, dating safety tips, and a reusable Block/Report modal.
- **Dashboard Preview:** Deployed the active match layout complete with "Break the Ice 🎮" action triggers.


### 🔹 Commit 2 (`Phase 2: Core Game Engine & Chat Injection`)
- **Arcade Launcher Modal (`ArcadeModal.tsx`):** Built a central game launcher modal triggered directly from match profile cards.
- **Hot Take Swipe Engine (`HotTakeSwipe.tsx`):** Implemented a 15-second opinion matching module that compares player choices on controversial takes and outputs alignment results.
- **HTML5 Co-Op Canvas (`CoOpCanvas.tsx`):** Developed an interactive 30-second shared drawing board with color palette controls, canvas clearing, and prompt generators.
- **Dynamic Chat Thread (`ChatThread.tsx`):** Built an interactive chat interface that automatically injects post-game outcome chips at the top of the thread as clickable one-tap icebreakers.
- **Structured Content Store (`arcadeContent.ts`):** Created modular datasets for hot takes and drawing prompts to ensure variety across game sessions.


---

## ✨ Core Features
- **Arcade Launcher:** Interactive launcher embedded in match cards to start micro-games.
- **Hot Take Swipe:** 15-second opinion matching module comparing responses on fun controversial takes.
- **Co-Op Canvas:** Interactive 30-second shared drawing board with synchronized stroke state.
- **Dynamic Context Chips:** Auto-generated conversation starters pushed directly into the chat thread post-game.
- **Trust & Safety Suite:** Profile visibility controls, selfie verification badge system, and reporting mechanisms.

---

## 🛠️ Tech Stack
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling & UI:** Tailwind CSS, Framer Motion, Lucide Icons
- **State & Sync:** React Context API / Realtime Sync
- **Deployment:** Vercel

---

## 🔒 Confidentiality & Third-Party Disclosure
- No API keys, secret credentials, or environment tokens are committed to this repository.
- Open-source packages used: Next.js, React, Tailwind CSS, Framer Motion, Lucide-React.
