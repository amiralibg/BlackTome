import { useEffect, useMemo, useState } from 'react'
import type { Settings } from '../types/game'

type StoryPanelProps = {
  text: string
  chapter: string
  turn: number
  settings: Settings
  readingMode: boolean
  onToggleReadingMode: () => void
}

const speedClass = {
  slow: '[animation-duration:900ms]',
  normal: '[animation-duration:620ms]',
  fast: '[animation-duration:360ms]',
}

const typewriterSpeed = {
  slow: 50,
  normal: 30,
  fast: 15,
}

const splitGraphemes = (value: string) => {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    return Array.from(segmenter.segment(value), ({ segment }) => segment)
  }

  return Array.from(value)
}

export function StoryPanel({ text, chapter, turn, settings, readingMode, onToggleReadingMode }: StoryPanelProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const paragraphs = useMemo(() => displayedText.split(/\n{2,}/), [displayedText])

  useEffect(() => {
    const characters = splitGraphemes(text)
    const speed = typewriterSpeed[settings.textSpeed]
    let currentIndex = 0
    let timeoutId: ReturnType<typeof setTimeout>

    const typeNextCharacter = () => {
      currentIndex += 1
      setDisplayedText(characters.slice(0, currentIndex).join(''))

      if (currentIndex >= characters.length) {
        setIsTyping(false)
        return
      }

      timeoutId = setTimeout(typeNextCharacter, speed)
    }

    timeoutId = setTimeout(() => {
      if (characters.length === 0 || settings.animationIntensity === 'low') {
        setDisplayedText(text)
        setIsTyping(false)
        return
      }

      setDisplayedText('')
      setIsTyping(true)
      timeoutId = setTimeout(typeNextCharacter, speed)
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [text, settings.animationIntensity, settings.textSpeed])

  return (
    <article className={`relative overflow-hidden rounded-2xl border border-stone-200/10 bg-[#0b090f]/85 shadow-[0_18px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl ${readingMode ? 'min-h-[72svh]' : ''}`}>
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-crimson-200/50 to-transparent" />
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/8 px-4 py-3 sm:px-6">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-crimson-200/60">{chapter}</p>
          <p className="mt-0.5 text-xs text-stone-500">Turn {turn.toString().padStart(2, '0')}</p>
        </div>
        <button type="button" onClick={onToggleReadingMode} className="rounded-full border border-stone-200/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-stone-300 transition hover:border-violet-200/30 hover:text-stone-100 focus:outline-none focus:ring-2 focus:ring-violet-200/50">
          {readingMode ? 'Exit Focus' : 'Focus'}
        </button>
      </div>
      <div className={`space-y-5 px-4 py-6 font-serif-display text-lg leading-relaxed text-stone-100 sm:px-7 sm:py-8 sm:text-xl sm:leading-relaxed ${speedClass[settings.textSpeed]} animate-story-reveal`}>
        {paragraphs.map((paragraph, index) => {
          const isLastParagraph = index === paragraphs.length - 1
          const shouldShowCursor = isTyping && isLastParagraph

          return (
            <p key={index} className="text-pretty first-letter:text-4xl first-letter:text-crimson-200 first-letter:leading-none first-letter:pr-1 sm:first-letter:text-5xl">
              {paragraph || (shouldShowCursor ? '\u00A0' : '')}
              {shouldShowCursor && (
                <>
                  <span className="sr-only">Typing</span>
                  <span aria-hidden="true" className="ml-1 inline-block h-[1em] w-1 translate-y-[0.12em] animate-pulse bg-crimson-200/70" />
                </>
              )}
            </p>
          )
        })}
      </div>
    </article>
  )
}
