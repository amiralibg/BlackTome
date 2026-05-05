import { useMemo, useState } from "react";
import blacktomeIcon from "../assets/images/blacktome.png";
import { characterArchetypes } from "../data/archetypes";
import type { CharacterArchetypeId, CharacterDraft } from "../types/game";

type StartScreenProps = {
  canContinue: boolean;
  onStart: (draft: CharacterDraft) => void;
  onContinue: () => void;
  onSettings: () => void;
};

export function StartScreen({
  canContinue,
  onStart,
  onContinue,
  onSettings,
}: StartScreenProps) {
  const [name, setName] = useState("");
  const [archetypeId, setArchetypeId] =
    useState<CharacterArchetypeId>("builder");
  const selectedArchetype = useMemo(
    () =>
      characterArchetypes.find((archetype) => archetype.id === archetypeId) ??
      characterArchetypes[0],
    [archetypeId],
  );
  const canStart = name.trim().length >= 2;

  function handleStart() {
    if (!canStart) return;
    onStart({ name: name.trim(), archetypeId });
  }

  return (
    <section className="mx-auto grid w-full max-w-6xl place-items-center gap-8 py-6 text-center lg:grid-cols-[minmax(0,0.9fr)_minmax(24rem,1.1fr)] lg:gap-10 lg:py-10 lg:text-left">
      <div className="animate-fade-up">
        <div className="mx-auto mb-6 h-32 w-32 rounded-4xl border border-stone-200/10 bg-[radial-gradient(circle,rgba(185,28,28,0.24),transparent_62%)] pt-1.5 px-1.5 shadow-[0_0_70px_rgba(76,29,149,0.35)] lg:mx-0 lg:h-40 lg:w-40">
          <img
            src={blacktomeIcon}
            alt="Blacktome icon"
            className="h-full w-full rounded-[1.65rem] object-cover shadow-[inset_0_0_28px_rgba(0,0,0,0.5)]"
          />
        </div>
        <h1 className="font-serif-display text-5xl tracking-tighter text-stone-100 sm:text-7xl lg:text-8xl">
          Blacktome
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-base leading-7 text-stone-300/80 sm:text-lg sm:leading-8 lg:mx-0">
          Open a living grimoire, bargain with old shadows, and write your fate
          into pages that remember every sin.
        </p>
      </div>

      <div className="w-full animate-fade-up rounded-2xl border border-stone-200/10 bg-[#0b090f]/85 p-4 text-left shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-5 [animation-delay:180ms] [animation-fill-mode:both]">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-crimson-200/60">
          Create your reader
        </p>
        <h2 className="mt-1.5 font-serif-display text-3xl text-stone-100 sm:text-4xl">
          Who opens the tome?
        </h2>

        <label
          htmlFor="character-name"
          className="mt-5 block text-sm font-semibold text-stone-300"
        >
          Character name
        </label>
        <input
          id="character-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Mara Veyr"
          className="mt-2 min-h-12 w-full rounded-xl border border-stone-200/10 bg-stone-950/70 px-4 text-base text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-crimson-200/40 focus:ring-2 focus:ring-crimson-300/15"
        />

        <fieldset className="mt-5">
          <legend className="mb-2.5 text-sm font-semibold text-stone-300">
            Character type
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {characterArchetypes.map((archetype) => (
              <button
                key={archetype.id}
                type="button"
                onClick={() => setArchetypeId(archetype.id)}
                aria-pressed={archetypeId === archetype.id}
                className={`rounded-xl border p-3.5 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-crimson-200/50 ${archetypeId === archetype.id ? "border-crimson-200/45 bg-crimson-950/30 shadow-[inset_0_0_24px_rgba(159,18,57,0.12)]" : "border-stone-200/8 bg-white/2 hover:border-violet-200/30 hover:bg-violet-950/15"}`}
              >
                <span className="block font-serif-display text-xl text-stone-100 sm:text-2xl">
                  {archetype.name}
                </span>
                <span className="mt-0.5 block text-[0.65rem] uppercase tracking-wider text-crimson-200/50">
                  {archetype.tagline}
                </span>
                <span className="mt-2.5 block text-sm leading-relaxed text-stone-400">
                  {archetype.description}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-4 rounded-xl border border-stone-200/8 bg-black/25 p-3.5">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-stone-500">
            Gameplay effect
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-stone-300">
            {selectedArchetype.name} starts with{" "}
            {selectedArchetype.startingItem.toLowerCase()} and changes your
            starting health, energy, sanity, AI narration, risks, and available
            solutions.
          </p>
        </div>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-[1fr_0.7fr_0.7fr]">
          <button
            type="button"
            onClick={handleStart}
            disabled={!canStart}
            className="group rounded-xl border border-crimson-300/30 bg-crimson-950/35 px-5 py-3 text-sm font-bold uppercase tracking-wider text-stone-100 shadow-[0_12px_50px_rgba(127,29,29,0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:border-crimson-200/60 hover:bg-crimson-900/45 focus:outline-none focus:ring-2 focus:ring-crimson-200/60 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Start Journey
          </button>
          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue}
            className="rounded-xl border border-stone-200/12 bg-stone-950/40 px-4 py-3 text-sm font-bold uppercase tracking-wider text-stone-200 transition-all duration-200 hover:border-violet-200/35 hover:bg-violet-950/25 focus:outline-none focus:ring-2 focus:ring-violet-200/50 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={onSettings}
            className="rounded-xl border border-stone-200/8 bg-white/2 px-4 py-3 text-sm font-bold uppercase tracking-wider text-stone-300 transition-all duration-200 hover:border-stone-200/25 hover:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-stone-200/40"
          >
            Settings
          </button>
        </div>
      </div>
    </section>
  );
}
