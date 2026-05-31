"use client";

import { useEffect, useState } from "react";
import { isOnboardingComplete } from "@/lib/storage";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { AppShell } from "@/components/AppShell";

export default function Home() {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    setOnboarded(isOnboardingComplete());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "#0d0e1a" }}>
        <div className="shimmer font-[family-name:var(--font-cinzel)] text-3xl">✦</div>
      </div>
    );
  }

  if (!onboarded) {
    return <OnboardingFlow onComplete={() => setOnboarded(true)} />;
  }

  return <AppShell />;
}
