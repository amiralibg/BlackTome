import { useCallback, useEffect, useMemo, useState } from 'react'
import { defaultAiConfig } from '../config/aiConfig'
import { createPlayerFromDraft, gameEngineService, initialPlayer, openingScene } from '../services/gameEngineService'
import type { CharacterDraft, Choice, GameOverState, GameState, HistoryEntry, PlayerStatsModel, Settings } from '../types/game'
import { clearGameSave, hasGameSave, loadGameSave, loadSettings, saveGameState, saveSettings } from '../utils/storage'

const nowIso = () => new Date().toISOString()
const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`
const MAX_HISTORY_ENTRIES = 18
const FINAL_TURN = 25

export const defaultSettings: Settings = {
  textSpeed: 'normal',
  animationIntensity: 'normal',
  themeContrast: 'balanced',
  soundEnabled: false,
  aiModeEnabled: true,
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

function getGameOverState(player: PlayerStatsModel, turn: number): GameOverState | null {
  if (player.sanity <= 0) {
    return {
      reason: 'sanity',
      title: 'You Go Insane',
      message: 'The Blacktome breaks your mind. Your character can no longer tell memory from ink, and this journey ends here.',
    }
  }

  if (player.health <= 0) {
    return {
      reason: 'health',
      title: 'You Have Fallen',
      message: 'Your wounds are too severe to continue. The Blacktome closes over your final breath.',
    }
  }

  if (player.energy <= 0) {
    return {
      reason: 'energy',
      title: 'You Collapse',
      message: 'Your strength is gone. You fall before you can flee, fight, or finish the ritual.',
    }
  }

  if (turn >= FINAL_TURN) {
    return {
      reason: 'ending',
      title: 'The Tome Closes',
      message: 'This chapter reaches its end. The Blacktome records your choices and seals the page.',
    }
  }

  return null
}

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>(() => loadGameSave() ?? createInitialState())
  const [settings, setSettingsState] = useState<Settings>(() => ({ ...defaultSettings, ...loadSettings() }))
  const [isLoading, setIsLoading] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isQuitModalOpen, setIsQuitModalOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(true)
  const [isReadingMode, setIsReadingMode] = useState(false)
  const [streamingStoryText, setStreamingStoryText] = useState('')

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
      gameOver: null,
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
    if (gameState.gameOver) return
    setIsLoading(true)
    setStreamingStoryText('')
    const result = await gameEngineService.submitChoice(choice, gameState, settings, {
      onStoryText: setStreamingStoryText,
    })
    setGameState((current) => {
      const nextTurn = current.session.turn + 1
      const nextPlayer = { ...current.player, ...result.playerPatch }
      return {
        ...current,
        scene: result.scene,
        player: nextPlayer,
        history: [...current.history, actionEntry('choice', choice.label), storyEntry(result.scene.text)].slice(-MAX_HISTORY_ENTRIES),
        session: { ...current.session, lastUpdatedAt: nowIso(), turn: nextTurn },
        gameOver: getGameOverState(nextPlayer, nextTurn),
      }
    })
    setStreamingStoryText('')
    setIsLoading(false)
  }, [gameState, settings])

  const submitCustomAction = useCallback(async (input: string) => {
    const trimmed = input.trim()
    if (!trimmed || gameState.gameOver) return
    setIsLoading(true)
    setStreamingStoryText('')
    const result = await gameEngineService.submitCustomAction(trimmed, gameState, settings, {
      onStoryText: setStreamingStoryText,
    })
    setGameState((current) => {
      const nextTurn = current.session.turn + 1
      const nextPlayer = { ...current.player, ...result.playerPatch }
      return {
        ...current,
        scene: result.scene,
        player: nextPlayer,
        history: [...current.history, actionEntry('custom', trimmed), storyEntry(result.scene.text)].slice(-MAX_HISTORY_ENTRIES),
        session: { ...current.session, lastUpdatedAt: nowIso(), turn: nextTurn },
        gameOver: getGameOverState(nextPlayer, nextTurn),
      }
    })
    setStreamingStoryText('')
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
    streamingStoryText,
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
