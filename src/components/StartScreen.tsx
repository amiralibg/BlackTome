import { useMemo, useState } from "react";
import blacktomeIcon from "../assets/images/blacktome.png";
import { archetypeThemes, characterArchetypes } from "../data/archetypes";
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
  const [touched, setTouched] = useState(false);

  const selectedArchetype = useMemo(
    () =>
      characterArchetypes.find((archetype) => archetype.id === archetypeId) ??
      characterArchetypes[0],
    [archetypeId],
  );

  const theme = archetypeThemes[selectedArchetype.id];
  const canStart = name.trim().length >= 2;
  const showNameError = touched && !canStart;

  function handleStart() {
    setTouched(true);
    if (!canStart) return;
    onStart({ name: name.trim(), archetypeId });
  }

  function handleNameKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleStart();
    }
  }

  return (
    <section className="relative min-h-dvh w-full overflow-x-hidden bg-[#05030a] px-3 py-4 text-stone-100 sm:px-5 sm:py-6 lg:px-8 lg:py-10">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-88 w-88 -translate-x-1/2 rounded-full bg-crimson-900/20 blur-[80px] sm:h-120 sm:w-184 sm:blur-[120px]" />
        <div className="absolute -right-32 top-64 h-80 w-[20rem] rounded-full bg-violet-950/25 blur-[90px] sm:-right-48 sm:top-80 sm:h-128 sm:w-lg sm:blur-[110px]" />
        <div className="absolute -bottom-32 -left-24 h-72 w-[18rem] rounded-full bg-red-950/20 blur-[90px] sm:-bottom-48 sm:-left-32 sm:h-120 sm:w-120 sm:blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,30,45,0.18),transparent_38%),linear-gradient(to_bottom,rgba(8,6,10,0.35),rgba(8,6,10,0.96))]" />
      </div>

      <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-4 sm:gap-6 lg:gap-7">
        {/* Header */}
        <header className="animate-fade-up overflow-hidden rounded-3xl border border-stone-200/10 bg-black/20 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:rounded-4xl sm:p-6 lg:p-7">
          <div className="flex min-w-0 flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-5 sm:text-left">
            <div className="h-20 w-20 shrink-0 rounded-[1.25rem] border border-stone-200/10 bg-[radial-gradient(circle,rgba(185,28,28,0.26),transparent_62%)] p-1.5 shadow-[0_0_50px_rgba(76,29,149,0.25)] sm:h-24 sm:w-24 sm:rounded-[1.75rem]">
              <img
                src={blacktomeIcon}
                alt="Blacktome icon"
                className="h-full w-full rounded-2xl object-cover sm:rounded-[1.35rem]"
              />
            </div>

            <div className="min-w-0">
              <p
                className={`text-[0.58rem] font-semibold uppercase tracking-[0.28em] ${theme.softLabel} sm:text-[0.65rem] sm:tracking-[0.32em]`}
              >
                A living grimoire awaits
              </p>

              <h1 className="mt-1.5 font-serif-display text-4xl tracking-tighter text-stone-100 sm:mt-2 sm:text-6xl lg:text-7xl">
                Blacktome
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-300/80 sm:mt-3 sm:text-lg sm:leading-8">
                Open a living grimoire, bargain with old shadows, and write your
                fate into pages that remember every sin.
              </p>
            </div>
          </div>
        </header>

        {/* Main panel */}
        <main className="animate-fade-up min-w-0 overflow-hidden rounded-3xl border border-stone-200/10 bg-[#08060c]/80 shadow-[0_24px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl [animation-delay:120ms] [animation-fill-mode:both] sm:rounded-4xl">
          <div className="grid min-w-0 gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
            {/* Form first on mobile, second on desktop */}
            <section className="order-1 min-w-0 p-4 sm:p-6 lg:order-2 lg:p-7">
              <div className="min-w-0">
                <p
                  className={`text-[0.62rem] font-semibold uppercase tracking-[0.28em] ${theme.softLabel} sm:text-[0.65rem] sm:tracking-[0.3em]`}
                >
                  Create your reader
                </p>

                <h2 className="mt-2 font-serif-display text-2xl text-stone-100 sm:text-4xl">
                  Who opens the tome?
                </h2>
              </div>

              <label
                htmlFor="character-name"
                className="mt-5 block text-sm font-semibold text-stone-300 sm:mt-6"
              >
                Character name
              </label>

              <input
                id="character-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onBlur={() => setTouched(true)}
                onKeyDown={handleNameKeyDown}
                placeholder="Mara Veyr"
                aria-invalid={showNameError}
                className={`mt-2 h-13 w-full min-w-0 rounded-2xl border bg-stone-950/70 px-4 text-base text-stone-100 outline-none transition placeholder:text-stone-600 ${
                  showNameError
                    ? "border-red-400/60 focus:border-red-300/70 focus:ring-2 focus:ring-red-300/15"
                    : `border-stone-200/10 focus:border-stone-200/20 focus:ring-2 ${theme.ring}`
                }`}
              />

              <p className="mt-2 text-xs text-stone-500">
                Use at least 2 characters.
              </p>

              {showNameError && (
                <p className="mt-1 text-xs text-red-300">
                  Please enter at least 2 characters.
                </p>
              )}

              <fieldset className="mt-6 min-w-0 sm:mt-7">
                <legend className="mb-3 text-sm font-semibold text-stone-300">
                  Character type
                </legend>

                {/* Mobile horizontal scroll */}
                <div className="sm:hidden">
                  <div className="-mx-1 overflow-x-auto overflow-y-hidden pb-2 pl-1 pr-1 snap-x snap-mandatory touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex min-w-max gap-3">
                      {characterArchetypes.map((archetype) => {
                        const isSelected = archetypeId === archetype.id;
                        const cardTheme = archetypeThemes[archetype.id];

                        return (
                          <button
                            key={archetype.id}
                            type="button"
                            onClick={() => setArchetypeId(archetype.id)}
                            aria-pressed={isSelected}
                            aria-label={`Select ${archetype.name}`}
                            className={`group relative w-[calc(100vw-4.5rem)] min-w-64 max-w-[320px] shrink-0 snap-start overflow-hidden rounded-2xl border text-left transition-all duration-200 focus:outline-none ${
                              isSelected
                                ? `${cardTheme.selectedCard} ${cardTheme.selectedCardShadow} focus:ring-2 ${cardTheme.ring}`
                                : `border-stone-200/10 bg-white/3 ${cardTheme.hoverCard} focus:ring-2 focus:ring-stone-200/30`
                            }`}
                          >
                            <div className="flex min-w-0 gap-3 p-3">
                              <div className="relative flex h-34 w-28 shrink-0 items-end justify-center overflow-hidden rounded-xl bg-[radial-gradient(circle_at_center,rgba(120,30,45,0.22),rgba(0,0,0,0.18)_55%,rgba(0,0,0,0.5))]">
                                <img
                                  src={archetype.image}
                                  alt={`${archetype.name} character artwork`}
                                  className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.03]"
                                />
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-[#09070d] to-transparent" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <span className="block truncate font-serif-display text-xl leading-none text-stone-100">
                                  {archetype.name}
                                </span>

                                <span
                                  className={`mt-2 block text-[0.58rem] font-semibold uppercase tracking-[0.16em] ${cardTheme.accentText}`}
                                >
                                  {archetype.tagline}
                                </span>

                                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-400">
                                  {archetype.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Desktop grid */}
                <div className="hidden gap-3 sm:grid sm:grid-cols-2">
                  {characterArchetypes.map((archetype) => {
                    const isSelected = archetypeId === archetype.id;
                    const cardTheme = archetypeThemes[archetype.id];

                    return (
                      <button
                        key={archetype.id}
                        type="button"
                        onClick={() => setArchetypeId(archetype.id)}
                        aria-pressed={isSelected}
                        aria-label={`Select ${archetype.name}`}
                        className={`group relative min-w-0 overflow-hidden rounded-2xl border text-left transition-all duration-200 focus:outline-none ${
                          isSelected
                            ? `${cardTheme.selectedCard} ${cardTheme.selectedCardShadow} focus:ring-2 ${cardTheme.ring}`
                            : `border-stone-200/10 bg-white/3 ${cardTheme.hoverCard} focus:ring-2 focus:ring-stone-200/30`
                        }`}
                      >
                        <div className="flex min-h-35 min-w-0 gap-3 p-3 sm:min-h-42 sm:flex-col sm:p-4">
                          <div className="relative flex h-28 w-24 shrink-0 items-end justify-center overflow-hidden rounded-xl bg-[radial-gradient(circle_at_center,rgba(120,30,45,0.22),rgba(0,0,0,0.18)_55%,rgba(0,0,0,0.5))] sm:h-40 sm:w-full">
                            <img
                              src={archetype.image}
                              alt={`${archetype.name} character artwork`}
                              className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.03]"
                            />
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-[#09070d] to-transparent" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <span className="block truncate font-serif-display text-xl leading-none text-stone-100 sm:text-2xl">
                              {archetype.name}
                            </span>

                            <span
                              className={`mt-2 block text-[0.58rem] font-semibold uppercase tracking-[0.16em] ${cardTheme.accentText} sm:text-[0.62rem] sm:tracking-[0.18em]`}
                            >
                              {archetype.tagline}
                            </span>

                            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-400">
                              {archetype.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Mobile archetype summary */}
              <div
                className={`mt-6 rounded-2xl border border-stone-200/10 p-4 sm:hidden ${theme.previewBg}`}
              >
                <p
                  className={`text-[0.65rem] font-semibold uppercase tracking-[0.24em] ${theme.softLabel}`}
                >
                  Selected archetype
                </p>

                <h3 className="mt-2 font-serif-display text-2xl text-stone-100">
                  {selectedArchetype.name}
                </h3>

                <p
                  className={`mt-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] ${theme.accentText}`}
                >
                  {selectedArchetype.tagline}
                </p>

                <p className="mt-3 text-sm leading-relaxed text-stone-300">
                  Starts with{" "}
                  <span className={theme.accentText}>
                    {selectedArchetype.startingItem.toLowerCase()}
                  </span>
                  .
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-stone-200/10 bg-black/25 p-4 sm:mt-7">
                <p className="text-sm leading-relaxed text-stone-400">
                  Enter a name, choose an archetype, then begin your descent
                  into the Blacktome.
                </p>
              </div>

              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  onClick={handleStart}
                  disabled={!canStart}
                  className={`min-h-13 rounded-2xl border px-5 py-4 text-sm font-bold uppercase tracking-wider shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition-all duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-40 ${theme.cta} ${theme.ctaHover} ${theme.ring}`}
                >
                  Start Journey
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={onContinue}
                    disabled={!canContinue}
                    className="min-h-13 rounded-2xl border border-stone-200/12 bg-stone-950/45 px-4 py-4 text-sm font-bold uppercase tracking-wider text-stone-200 transition-all duration-200 hover:border-stone-200/20 hover:bg-white/6 focus:outline-none focus:ring-2 focus:ring-stone-200/40 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Continue
                  </button>

                  <button
                    type="button"
                    onClick={onSettings}
                    className="min-h-13 rounded-2xl border border-stone-200/10 bg-white/3 px-4 py-4 text-sm font-bold uppercase tracking-wider text-stone-300 transition-all duration-200 hover:border-stone-200/25 hover:bg-white/6 focus:outline-none focus:ring-2 focus:ring-stone-200/40"
                  >
                    Settings
                  </button>
                </div>
              </div>
            </section>

            {/* Preview second on mobile, first on desktop */}
            <section className="order-2 relative hidden min-w-0 overflow-hidden border-t border-stone-200/10 bg-black/25 p-4 sm:p-6 lg:order-1 lg:block lg:rounded-l-4xl lg:rounded-tr-none lg:border-r lg:border-t-0 lg:p-7">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-crimson-950/20 to-transparent" />
                <div
                  className={`absolute left-1/2 top-12 h-56 w-56 -translate-x-1/2 rounded-full blur-[70px] sm:top-16 sm:h-72 sm:w-72 sm:blur-[80px] ${theme.previewGlow}`}
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_35%)]" />
              </div>

              <div className="relative min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className={`text-[0.62rem] font-semibold uppercase tracking-[0.28em] ${theme.softLabel} sm:text-[0.65rem] sm:tracking-[0.3em]`}
                    >
                      Selected archetype
                    </p>

                    <h2 className="mt-3 truncate font-serif-display text-3xl leading-none text-stone-100 sm:text-5xl">
                      {selectedArchetype.name}
                    </h2>

                    <p
                      className={`mt-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] ${theme.accentText} sm:text-xs sm:tracking-[0.24em]`}
                    >
                      {selectedArchetype.tagline}
                    </p>
                  </div>

                  <div
                    className={`rounded-full border px-3 py-1 text-[0.6rem] font-bold uppercase tracking-wider ${theme.badge}`}
                  >
                    Chosen
                  </div>
                </div>

                <div
                  className={`relative mt-5 flex min-h-64 items-end justify-center overflow-hidden rounded-[1.25rem] border border-stone-200/10 p-3 sm:mt-6 sm:min-h-96 sm:rounded-3xl sm:p-4 lg:min-h-136 ${theme.previewBg}`}
                >
                  <img
                    src={selectedArchetype.image}
                    alt={`${selectedArchetype.name} full character artwork`}
                    className="max-h-56 w-full max-w-full object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.6)] sm:max-h-88 lg:max-h-128"
                  />
                  <div className="pointer-events-none absolute inset-x-4 bottom-0 h-20 bg-linear-to-t from-black/50 to-transparent sm:inset-x-6 sm:h-24" />
                </div>

                <div className="mt-4 rounded-2xl border border-stone-200/10 bg-black/35 p-4 sm:mt-5">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-stone-500">
                    Gameplay effect
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-stone-300">
                    {selectedArchetype.name} starts with{" "}
                    <span className={theme.accentText}>
                      {selectedArchetype.startingItem.toLowerCase()}
                    </span>{" "}
                    and changes your starting health, energy, sanity, AI
                    narration, risks, and available solutions.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </section>
  );
}
