import { defaultAiConfig, isDefaultAiConfigured } from '../config/aiConfig'
import { CustomCheckbox } from './CustomCheckbox'
import type { Settings } from '../types/game'

type SettingsModalProps = {
  open: boolean
  settings: Settings
  onChange: (patch: Partial<Settings>) => void
  onClose: () => void
}

export function SettingsModal({ open, settings, onChange, onClose }: SettingsModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/70 p-4 backdrop-blur-md animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className="max-h-[92svh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-stone-200/10 bg-[#0a080e]/98 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.6)] animate-scale-in sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-crimson-200/60">Codex tuning</p>
            <h2 id="settings-title" className="mt-1.5 font-serif-display text-3xl text-stone-100">Settings</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-stone-200/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-300 transition hover:border-crimson-200/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-crimson-200/50">Close</button>
        </div>

        <div className="grid gap-4">
          <SelectRow label="Text speed" value={settings.textSpeed} options={['slow', 'normal', 'fast']} onChange={(textSpeed) => onChange({ textSpeed })} />
          <SelectRow label="Animation intensity" value={settings.animationIntensity} options={['low', 'normal', 'high']} onChange={(animationIntensity) => onChange({ animationIntensity })} />
          <SelectRow label="Theme contrast" value={settings.themeContrast} options={['soft', 'balanced', 'high']} onChange={(themeContrast) => onChange({ themeContrast })} />

          <ToggleRow label="Sound / music" description="Placeholder for ambient audio and interface sounds." checked={settings.soundEnabled} onChange={(soundEnabled) => onChange({ soundEnabled })} />
          <ToggleRow label="AI mode" description="Generate story turns with the configured OpenAI-compatible service." checked={settings.aiModeEnabled} onChange={(aiModeEnabled) => onChange({ aiModeEnabled })} />
          <ToggleRow label="Use custom AI config" description="Turn on to override the default Liara env configuration with your own provider." checked={settings.useCustomAiConfig} onChange={(useCustomAiConfig) => onChange({ useCustomAiConfig })} />

          {!settings.useCustomAiConfig ? (
            <div className="rounded-xl border border-stone-200/8 bg-white/[0.02] p-4">
              <p className="text-sm font-semibold text-stone-200">Default Liara AI configuration</p>
              <p className="mt-1 text-sm text-stone-500">Loaded from Vite env variables. API key status: {isDefaultAiConfigured() ? 'configured' : 'missing'}.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <ReadOnlyField label="Base URL" value={defaultAiConfig.apiBaseUrl || 'Missing VITE_BLACKTOME_AI_BASE_URL'} />
                <ReadOnlyField label="Model" value={defaultAiConfig.aiModel || 'Missing VITE_BLACKTOME_AI_MODEL'} />
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-stone-200/8 bg-white/[0.02] p-4">
              <label htmlFor="api-base-url" className="text-sm font-semibold text-stone-200">Custom OpenAI-compatible configuration</label>
              <p className="mt-1 text-sm text-stone-500">Use any provider that supports /chat/completions. This custom key is saved only in this browser.</p>
              <div className="mt-4 grid gap-3">
                <input id="api-base-url" value={settings.apiBaseUrl} onChange={(event) => onChange({ apiBaseUrl: event.target.value })} placeholder="https://api.example.com/v1" className="rounded-xl border border-stone-200/10 bg-stone-950/70 px-4 py-2.5 text-sm text-stone-100 outline-none placeholder:text-stone-600 focus:border-violet-200/40 focus:ring-2 focus:ring-violet-300/15" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input value={settings.aiModel} onChange={(event) => onChange({ aiModel: event.target.value })} placeholder="provider/model-name" className="rounded-xl border border-stone-200/10 bg-stone-950/70 px-4 py-2.5 text-sm text-stone-100 outline-none placeholder:text-stone-600 focus:border-violet-200/40 focus:ring-2 focus:ring-violet-300/15" />
                  <input type="password" value={settings.apiKey} onChange={(event) => onChange({ apiKey: event.target.value })} placeholder="Custom API key" className="rounded-xl border border-stone-200/10 bg-stone-950/70 px-4 py-2.5 text-sm text-stone-100 outline-none placeholder:text-stone-600 focus:border-violet-200/40 focus:ring-2 focus:ring-violet-300/15" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

type ReadOnlyFieldProps = {
  label: string
  value: string
}

function ReadOnlyField({ label, value }: ReadOnlyFieldProps) {
  return (
    <div className="rounded-xl border border-stone-200/8 bg-stone-950/50 px-3 py-2.5">
      <span className="block text-[0.6rem] font-bold uppercase tracking-wider text-stone-500">{label}</span>
      <span className="mt-1 block truncate text-sm text-stone-200" title={value}>{value}</span>
    </div>
  )
}


type SelectRowProps<T extends string> = {
  label: string
  value: T
  options: T[]
  onChange: (value: T) => void
}

function SelectRow<T extends string>({ label, value, options, onChange }: SelectRowProps<T>) {
  return (
    <label className="flex flex-col gap-2 rounded-xl border border-stone-200/8 bg-white/[0.02] p-3.5 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-semibold text-stone-200">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value as T)} className="rounded-lg border border-stone-200/10 bg-stone-950 px-3 py-2 text-sm capitalize text-stone-100 outline-none focus:border-violet-200/40 focus:ring-2 focus:ring-violet-300/15">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}

type ToggleRowProps = {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="rounded-xl border border-stone-200/8 bg-white/[0.02] p-3.5">
      <CustomCheckbox
        checked={checked}
        onChange={onChange}
        label={label}
        description={description}
      />
    </div>
  )
}
