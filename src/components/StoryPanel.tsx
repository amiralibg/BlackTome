import { useEffect, useMemo, useRef, useState } from "react";
import type { Settings } from "../types/game";

type StoryPanelProps = {
  text: string;
  streamingText?: string;
  isStreaming?: boolean;
  isLoading?: boolean;
  chapter: string;
  turn: number;
  settings: Settings;
  readingMode: boolean;
  onToggleReadingMode: () => void;
};

const speedClass = {
  slow: "[animation-duration:900ms]",
  normal: "[animation-duration:620ms]",
  fast: "[animation-duration:360ms]",
};

const typewriterSpeed = {
  slow: 50,
  normal: 30,
  fast: 15,
};

const splitGraphemes = (value: string) => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, {
      granularity: "grapheme",
    });
    return Array.from(segmenter.segment(value), ({ segment }) => segment);
  }

  return Array.from(value);
};

export function StoryPanel({
  text,
  streamingText = "",
  isStreaming = false,
  isLoading = false,
  chapter,
  turn,
  settings,
  readingMode,
  onToggleReadingMode,
}: StoryPanelProps) {
  const [typedCount, setTypedCount] = useState(0);
  const [skipAnimation, setSkipAnimation] = useState(
    settings.animationIntensity === "low"
  );

  const wasStreamingRef = useRef(false);
  const previousTextRef = useRef(text);

  const characters = useMemo(() => splitGraphemes(text), [text]);
  const textLength = characters.length;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (isStreaming) {
      wasStreamingRef.current = true;
      return;
    }

    const animationDisabled = settings.animationIntensity === "low";
    const textChanged = previousTextRef.current !== text;
    const justFinishedStreaming = wasStreamingRef.current;

    previousTextRef.current = text;
    wasStreamingRef.current = false;

    // If text came from streaming, or animations are disabled,
    // reveal immediately without typewriter.
    if (justFinishedStreaming || animationDisabled) {
      timeoutId = setTimeout(() => {
        setSkipAnimation(true);
        setTypedCount(textLength);
      }, 0);

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }

    // New non-streamed text: restart typewriter.
    if (textChanged) {
      timeoutId = setTimeout(() => {
        setSkipAnimation(false);
        setTypedCount(0);
      }, 0);

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [isStreaming, text, textLength, settings.animationIntensity]);

  useEffect(() => {
    if (isStreaming) return;
    if (skipAnimation) return;
    if (typedCount >= textLength) return;
    if (textLength === 0) return;

    const timeoutId = setTimeout(() => {
      setTypedCount((count) => count + 1);
    }, typewriterSpeed[settings.textSpeed]);

    return () => clearTimeout(timeoutId);
  }, [
    isStreaming,
    skipAnimation,
    typedCount,
    textLength,
    settings.textSpeed,
  ]);

  const displayedText = useMemo(() => {
    if (isStreaming) {
      return streamingText || text;
    }

    if (skipAnimation) {
      return text;
    }

    return characters.slice(0, typedCount).join("");
  }, [isStreaming, streamingText, text, skipAnimation, characters, typedCount]);

  const isTyping =
    !isStreaming && !skipAnimation && typedCount > 0 && typedCount < textLength;

  const paragraphs = useMemo(
    () => displayedText.split(/\n{2,}/),
    [displayedText]
  );

  return (
    <article
      className={`relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border bg-[#0b090f]/85 backdrop-blur-xl transition-[box-shadow,border-color] duration-700 ${
        isStreaming || isLoading
          ? "border-crimson-200/20 shadow-[0_18px_70px_rgba(0,0,0,0.3),0_0_0_1px_rgba(251,113,133,0.12),0_0_30px_rgba(251,113,133,0.16)]"
          : "border-stone-200/10 shadow-[0_18px_70px_rgba(0,0,0,0.3)]"
      } ${readingMode ? "min-h-[72svh] lg:min-h-0" : ""}`}
    >
      {(isStreaming || isLoading) && (
        <>
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-crimson-300/10 blur-xl animate-[story-panel-breathe_2.8s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-crimson-200/15 animate-[story-panel-breathe_2.8s_ease-in-out_infinite]" />
        </>
      )}

      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-crimson-200/50 to-transparent" />

      <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/8 px-4 py-3 sm:px-6">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-crimson-200/60">
            {chapter}
          </p>
          <p className="mt-0.5 text-xs text-stone-500">
            {isStreaming
              ? "The tome is writing..."
              : `Turn ${turn.toString().padStart(2, "0")}`}
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleReadingMode}
          className="rounded-full border border-stone-200/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-stone-300 transition hover:border-violet-200/30 hover:text-stone-100 focus:outline-none focus:ring-2 focus:ring-violet-200/50"
        >
          {readingMode ? "Exit Focus" : "Focus"}
        </button>
      </div>

      <div
        className={`min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-6 font-serif-display text-lg leading-relaxed text-stone-100 scrollbar-thin sm:px-7 sm:py-8 sm:text-xl sm:leading-relaxed ${speedClass[settings.textSpeed]} animate-story-reveal`}
      >
        {paragraphs.map((paragraph, index) => {
          const isLastParagraph = index === paragraphs.length - 1;
          const shouldShowCursor = (isTyping || isStreaming) && isLastParagraph;

          return (
            <p
              key={index}
              className="text-pretty first-letter:text-4xl first-letter:text-crimson-200 first-letter:leading-none first-letter:pr-1 sm:first-letter:text-5xl"
            >
              {paragraph || (shouldShowCursor ? "\u00A0" : "")}
              {shouldShowCursor && (
                <>
                  <span className="sr-only">Typing</span>
                  <span
                    aria-hidden="true"
                    className="ml-1 inline-block h-[1em] w-1 translate-y-[0.12em] animate-pulse bg-crimson-200/70"
                  />
                </>
              )}
            </p>
          );
        })}
      </div>

      {isStreaming && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#0b090f] via-[#0b090f]/75 to-transparent">
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-crimson-200/15 bg-black/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-crimson-100/80 shadow-[0_12px_35px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <span className="h-2 w-2 animate-pulse rounded-full bg-crimson-200" />
            Writing live
          </div>
        </div>
      )}
    </article>
  );
}
