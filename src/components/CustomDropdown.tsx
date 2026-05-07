import { useEffect, useId, useRef, useState } from "react"

type CustomDropdownProps<T extends string> = {
  value: T
  options: T[]
  onChange: (value: T) => void
  placeholder?: string
  className?: string
}

export function CustomDropdown<T extends string>({
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  className = '',
}: CustomDropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const buttonId = useId()
  const listboxId = useId()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const selectedLabel = value ? value.replace(/-/g, ' ') : placeholder

  return (
    <div ref={rootRef} className={`relative w-full ${className}`}>
      <button
        id={buttonId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-stone-200/10 bg-stone-950 px-3 py-2 text-left text-sm text-stone-100 outline-none transition hover:border-violet-200/25 focus:border-violet-200/40 focus:ring-2 focus:ring-violet-300/15"
      >
        <span className="min-w-0 truncate capitalize">
          {selectedLabel}
        </span>

        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-stone-200/10 bg-[#100d16] shadow-[0_18px_50px_rgba(0,0,0,0.55)]">
          <div
            id={listboxId}
            role="listbox"
            aria-labelledby={buttonId}
            className="max-h-60 overflow-y-auto p-1.5"
          >
            {options.map((option) => {
              const isSelected = option === value

              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm capitalize transition ${
                    isSelected
                      ? 'bg-violet-300/15 text-violet-100'
                      : 'text-stone-300 hover:bg-white/6 hover:text-white'
                  }`}
                >
                  <span className="min-w-0 truncate">{option.replace(/-/g, ' ')}</span>

                  {isSelected && (
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-violet-200"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 5.29a1 1 0 0 1 0 1.42l-7.25 7.25a1 1 0 0 1-1.415 0L3.296 9.215a1 1 0 1 1 1.415-1.414l4.036 4.036 6.543-6.543a1 1 0 0 1 1.414-.004Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
