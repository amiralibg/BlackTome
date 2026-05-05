import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'

type CustomActionInputProps = {
  onSubmit: (input: string) => void
  disabled?: boolean
  compact?: boolean
}

export function CustomActionInput({ onSubmit, disabled = false, compact = false }: CustomActionInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = '0px'
    textarea.style.height = `${Math.min(textarea.scrollHeight, compact ? 120 : 180)}px`
  }, [value, compact])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className={`rounded-xl backdrop-blur-xl p-1.5`}>
      <div className="grid gap-2">
        <textarea
          ref={textareaRef}
          id="custom-action"
          value={value}
          rows={1}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
              event.currentTarget.form?.requestSubmit()
            }
          }}
          disabled={disabled}
          autoComplete="off"
          placeholder="Describe your action in detail..."
          className="min-h-20 w-full resize-none overflow-y-auto rounded-lg border border-crimson-200/15 bg-stone-950/50 px-3 py-2.5 text-sm leading-relaxed text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-crimson-200/40 focus:ring-2 focus:ring-crimson-300/20 disabled:opacity-50"
        />
        <button type="submit" disabled={disabled || !value.trim()} className="min-h-10 rounded-lg border border-crimson-200/30 bg-crimson-950/40 px-4 text-xs font-bold uppercase tracking-wider text-crimson-100 transition-all duration-200 hover:border-crimson-100/60 hover:bg-crimson-900/45 focus:outline-none focus:ring-2 focus:ring-crimson-200/50 disabled:cursor-not-allowed disabled:opacity-40">
          Submit Action
        </button>
      </div>
    </form>
  )
}
