import type { ReactNode } from "react";
import type { Settings } from "../types/game";
import { AmbientBackground } from "./AmbientBackground";

type AppShellProps = {
  children: ReactNode;
  settings: Settings;
};

export function AppShell({ children, settings }: AppShellProps) {
  const contrastClass = {
    soft: "text-stone-300",
    balanced: "text-stone-200",
    high: "text-white contrast-125",
  }[settings.themeContrast];

  const motionClass =
    settings.animationIntensity === "low" ? "motion-reduce" : "";

  return (
    <div
      className={`min-h-[calc(100svh - 200px)] overflow-x-hidden ${contrastClass} ${motionClass}`}
    >
      <AmbientBackground />
      <main className="relative mx-auto flex min-h-svh w-full max-w-370 px-4 py-5 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
