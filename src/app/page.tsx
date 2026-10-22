"use client";

import { useCurrentUser } from "@/context/AuthContext";
import { DashboardScreen } from "@/components/screens/DashboardScreen";
import { LandingScreen } from "@/components/screens/LandingScreen";

export default function HomePage() {
  const user = useCurrentUser();
  return user ? <DashboardScreen /> : <LandingScreen />;
}
