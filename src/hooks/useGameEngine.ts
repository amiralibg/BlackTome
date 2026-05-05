import { useCallback, useEffect, useMemo, useState } from 'react'
import { defaultAiConfig } from '../config/aiConfig'
import { createPlayerFromDraft, gameEngineService, initialPlayer, openingScene } from '../services/gameEngineService'
import type { CharacterDraft, Choice, GameState, HistoryEntry, Settings } from '../types/game'
import { clearGameSave, hasGameSave, loadGameSave, loadSettings, saveGameState, saveSettings } from '../utils/storage'

const nowIso = () => new Date().toISOString()
const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

export const defaultSettings: Settings = {
  textSpeed: 'normal',
  animationIntensity: 'normal',
  themeContrast: 'balanced',
  soundEnabled: false,
  aiModeEnabled: false,
  useCustomAiConfig: false,
  apiBaseUrl: '',
  aiModel: defaultAiConfig.aiModel,
  apiKey: '',
}

function createInitialState(): GameState {
  const timestamp = nowIso()
  return {
    phase: 'start',
    scene: openingScene,
    player: initialPlayer,
    history: [],
    session: {
      id: makeId(),
      startedAt: timestamp,
      lastUpdatedAt: timestamp,
      chapter: 'I. The Rain That Would Not Fall',
      turn: 0,
    },
  }
}

function storyEntry(text: string): HistoryEntry {
  return { id: makeId(), type: 'story', text, timestamp: nowIso() }
}

function actionEntry(type: 'choice' | 'custom', text: string): HistoryEntry {
  return { id: makeId(), type, text, timestamp: nowIso() }
}

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>(() => loadGameSave() ?? createInitialState())
  const [settings, setSettingsState] = useState<Settings>(() => ({ ...defaultSettings, ...loadSettings() }))
  const [isLoading, setIsLoading] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isQuitModalOpen, setIsQuitModalOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(true)
  const [isReadingMode, setIsReadingMode] = useState(false)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  useEffect(() => {
    if (gameState.phase === 'playing') {
      saveGameState(gameState)
    }
  }, [gameState])

  const canContinue = useMemo(() => hasGameSave() && gameState.phase !== 'playing', [gameState.phase])

  const setSettings = useCallback((patch: Partial<Settings>) => {
    setSettingsState((current) => ({ ...current, ...patch }))
  }, [])

  const startNewJourney = useCallback(async (draft: CharacterDraft) => {
    setIsLoading(true)
    const createdPlayer = createPlayerFromDraft(draft)
    const result = await gameEngineService.startGame(draft)
    const timestamp = nowIso()
    setGameState({
      phase: 'playing',
      scene: result.scene,
      player: { ...createdPlayer, ...result.playerPatch },
      history: [storyEntry(result.scene.text)],
      session: {
        id: makeId(),
        startedAt: timestamp,
        lastUpdatedAt: timestamp,
        chapter: 'I. The Rain That Would Not Fall',
        turn: 1,
      },
    })
    setIsLoading(false)
  }, [])

  const continueJourney = useCallback(() => {
    const saved = loadGameSave()
    if (saved) {
      setGameState({ ...saved, phase: 'playing' })
    }
  }, [])


  const returnToStartMenu = useCallback(() => {
    setIsQuitModalOpen(false)
    setGameState((current) => ({ ...current, phase: 'start' }))
  }, [])

  const quitAndStartNew = useCallback(() => {
    clearGameSave()
    setIsQuitModalOpen(false)
    setIsReadingMode(false)
    setGameState(createInitialState())
  }, [])

  const submitChoice = useCallback(async (choice: Choice) => {
    setIsLoading(true)
    const result = await gameEngineService.submitChoice(choice, gameState, settings)
    setGameState((current) => ({
      ...current,
      scene: result.scene,
      player: { ...current.player, ...result.playerPatch },
      history: [...current.history, actionEntry('choice', choice.label), storyEntry(result.scene.text)].slice(-30),
      session: { ...current.session, lastUpdatedAt: nowIso(), turn: current.session.turn + 1 },
    }))
    setIsLoading(false)
  }, [gameState, settings])

  const submitCustomAction = useCallback(async (input: string) => {
    const trimmed = input.trim()
    if (!trimmed) return
    setIsLoading(true)
    const result = await gameEngineService.submitCustomAction(trimmed, gameState, settings)
    setGameState((current) => ({
      ...current,
      scene: result.scene,
      player: { ...current.player, ...result.playerPatch },
      history: [...current.history, actionEntry('custom', trimmed), storyEntry(result.scene.text)].slice(-30),
      session: { ...current.session, lastUpdatedAt: nowIso(), turn: current.session.turn + 1 },
    }))
    setIsLoading(false)
  }, [gameState, settings])

  return {
    gameState,
    settings,
    isLoading,
    isSettingsOpen,
    isQuitModalOpen,
    isHistoryOpen,
    isReadingMode,
    canContinue,
    setSettings,
    setIsSettingsOpen,
    setIsQuitModalOpen,
    setIsHistoryOpen,
    setIsReadingMode,
    startNewJourney,
    continueJourney,
    returnToStartMenu,
    quitAndStartNew,
    submitChoice,
    submitCustomAction,
  }
}
