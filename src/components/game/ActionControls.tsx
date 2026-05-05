import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { Choice } from '../../types/game'
import { CustomActionInput } from '../CustomActionInput'

export type ActionMode = 'paths' | 'write'

type ActionControlsProps = {
  choices: Choice[]
  activeMode: ActionMode
  showWriteMode: boolean
  isLoading: boolean
  onModeChange: (mode: ActionMode) => void
  onSelectChoice: (choice: Choice) => void
  onSubmitCustomAction: (input: string) => void
}

export function DesktopActionPanel({ choices, activeMode, showWriteMode, isLoading, onModeChange, onSelectChoice, onSubmitCustomAction }: ActionControlsProps) {
  return (
    <div className="sticky bottom-3 z-20 hidden animate-slide-up rounded-2xl backdrop-blur-2xl lg:block">
      {showWriteMode && (
        <div className="mb-2 flex items-center gap-2 rounded-2xl border border-stone-200/8 px-3 py-2.5">
          <ModeButton active={activeMode === 'paths'} onClick={() => onModeChange('paths')} tone="paths">
            Choose Path
          </ModeButton>
          <ModeButton active={activeMode === 'write'} onClick={() => onModeChange('write')} tone="write">
            Write Custom
          </ModeButton>
        </div>
      )}

      <div className="rounded-2xl border border-stone-200/8 p-3">
        {activeMode === 'paths' ? (
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {choices.map((choice, index) => (
              <PathButton key={choice.id} choice={choice} index={index} disabled={isLoading} onSelect={onSelectChoice} />
            ))}
          </div>
        ) : (
          <CustomActionInput onSubmit={onSubmitCustomAction} disabled={isLoading} compact />
        )}
      </div>
    </div>
  )
}

export function MobileActionDock({ choices, activeMode, showWriteMode, isLoading, onModeChange, onSelectChoice, onSubmitCustomAction }: ActionControlsProps) {
  const [value, setValue] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = '0px'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`
  }, [value])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmitCustomAction(trimmed)
    setValue('')
    setIsExpanded(false)
  }

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 px-2 lg:hidden">
        {showWriteMode && (
          <div className="mb-2 flex items-center gap-2 rounded-2xl border border-stone-200/6 px-2 py-2 backdrop-blur-3xl">
            <ModeButton active={activeMode === 'paths'} onClick={() => {
              onModeChange('paths')
              setIsExpanded(false)
            }} tone="paths" compact>
              Paths
            </ModeButton>
            <ModeButton active={activeMode === 'write'} onClick={() => {
              onModeChange('write')
              setIsExpanded(false)
            }} tone="write" compact>
              Write
            </ModeButton>
          </div>
        )}

        <div className="mb-2 rounded-2xl border border-stone-200/6 px-2 py-2 backdrop-blur-3xl">
          {activeMode === 'paths' ? (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              disabled={isLoading}
              className="flex w-full items-center justify-between rounded-xl border border-violet-200/15 bg-violet-950/20 px-3 py-3 transition-all duration-200 active:scale-[0.98] disabled:opacity-40"
            >
              <div className="text-left">
                <span className="block text-sm font-bold text-violet-100">Choose Your Path</span>
                <span className="mt-0.5 block text-xs text-violet-200/50">{choices.length} options</span>
              </div>
              <svg className={`h-5 w-5 text-violet-200/60 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <textarea
                ref={textareaRef}
                value={value}
                rows={1}
                onChange={(event) => setValue(event.target.value)}
                disabled={isLoading}
                placeholder="Describe your action..."
                className="min-h-15 w-full resize-none rounded-xl border border-crimson-200/15 bg-stone-950/50 px-3 py-2 text-sm leading-relaxed text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-crimson-200/40 focus:ring-2 focus:ring-crimson-300/15 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !value.trim()}
                className="w-full rounded-xl border border-crimson-200/25 bg-crimson-950/30 py-2.5 text-sm font-bold uppercase tracking-wider text-crimson-100 transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Send Action
              </button>
            </form>
          )}
        </div>
      </div>

      {isExpanded && activeMode === 'paths' && (
        <PathBottomSheet choices={choices} onClose={() => setIsExpanded(false)} onSelectChoice={(choice) => {
          onSelectChoice(choice)
          setIsExpanded(false)
        }} />
      )}
    </>
  )
}

type ModeButtonProps = {
  active: boolean
  tone: ActionMode
  compact?: boolean
  children: string
  onClick: () => void
}

function ModeButton({ active, tone, compact = false, children, onClick }: ModeButtonProps) {
  const activeClass = tone === 'paths'
    ? 'bg-violet-950/50 text-violet-100 shadow-md shadow-violet-900/20'
    : 'bg-crimson-950/50 text-crimson-100 shadow-md shadow-crimson-900/20'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg px-3 font-semibold transition-all duration-200 ${compact ? 'py-1.5 text-xs' : 'py-2 text-sm'} ${
        active ? activeClass : 'text-stone-400 hover:bg-stone-900/30 hover:text-stone-200 active:bg-stone-900/30'
      }`}
    >
      {children}
    </button>
  )
}

type PathButtonProps = {
  choice: Choice
  index: number
  disabled?: boolean
  onSelect: (choice: Choice) => void
}

function PathButton({ choice, index, disabled = false, onSelect }: PathButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(choice)}
      disabled={disabled}
      className="group min-h-16 rounded-xl border border-stone-200/8 bg-stone-950/40 px-3 py-2.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200/30 hover:bg-violet-950/20 hover:shadow-lg hover:shadow-violet-900/10 focus:outline-none focus:ring-2 focus:ring-violet-200/40 disabled:pointer-events-none disabled:opacity-50"
    >
      <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-wider text-violet-200/50">
        {choice.tone ?? `Path ${index + 1}`}
      </span>
      <span className="line-clamp-2 text-sm font-semibold leading-snug text-stone-100">{choice.label}</span>
    </button>
  )
}

type PathBottomSheetProps = {
  choices: Choice[]
  onClose: () => void
  onSelectChoice: (choice: Choice) => void
}

function PathBottomSheet({ choices, onClose, onSelectChoice }: PathBottomSheetProps) {
  return (
    <div className="fixed inset-0 z-40 animate-fade-in bg-black/70 backdrop-blur-sm lg:hidden" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close paths" onClick={onClose} className="absolute inset-0 h-full w-full cursor-default" />
      <div className="absolute inset-x-0 bottom-0 max-h-[70svh] animate-slide-up overflow-y-auto rounded-t-2xl border-t border-stone-200/10 bg-[#08060b] shadow-[0_-20px_80px_rgba(0,0,0,0.8)]">
        <div className="sticky top-0 z-10 border-b border-stone-200/6 bg-[#08060b]/98 px-4 pb-3 pt-3 backdrop-blur-xl">
          <div className="mx-auto mb-2 h-1 w-12 rounded-full bg-stone-700" />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-violet-200/50">Select</p>
              <h2 className="mt-0.5 font-serif-display text-xl text-stone-100">Available Paths</h2>
            </div>
            <button type="button" onClick={onClose} className="rounded-full border border-stone-200/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-stone-300 active:bg-stone-900/30">
              Close
            </button>
          </div>
        </div>
        <div className="space-y-2 p-3">
          {choices.map((choice, index) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => onSelectChoice(choice)}
              className="w-full rounded-xl border border-stone-200/10 bg-stone-950/60 p-3 text-left transition-all duration-200 active:scale-[0.98] active:bg-stone-900/60"
            >
              <span className="mb-1.5 block text-[0.6rem] font-bold uppercase tracking-wider text-violet-200/50">
                {choice.tone ?? `Path ${index + 1}`}
              </span>
              <span className="block text-sm font-semibold leading-snug text-stone-100">{choice.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
