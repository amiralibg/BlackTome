import type { GameState, Settings } from '../types/game'

const SAVE_KEY = 'blacktome.save.v1'
const SETTINGS_KEY = 'blacktome.settings.v1'

export function loadGameSave(): GameState | null {
  try {
    const raw = window.localStorage.getItem(SAVE_KEY)
    return raw ? (JSON.parse(raw) as GameState) : null
  } catch {
    return null
  }
}

export function saveGameState(state: GameState) {
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(state))
}

export function hasGameSave() {
  return loadGameSave()?.phase === 'playing'
}

export function clearGameSave() {
  window.localStorage.removeItem(SAVE_KEY)
}

export function loadSettings(): Partial<Settings> | null {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY)
    return raw ? (JSON.parse(raw) as Partial<Settings>) : null
  } catch {
    return null
  }
}

export function saveSettings(settings: Settings) {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
