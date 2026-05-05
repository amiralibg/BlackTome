export type GamePhase = 'start' | 'playing'

export type AnimationIntensity = 'low' | 'normal' | 'high'
export type ThemeContrast = 'soft' | 'balanced' | 'high'
export type TextSpeed = 'slow' | 'normal' | 'fast'
export type CharacterArchetypeId = 'builder' | 'wizard' | 'hunter' | 'occultist'

export type StatKey = 'health' | 'energy' | 'sanity'

export type CharacterArchetype = {
  id: CharacterArchetypeId
  name: string
  tagline: string
  description: string
  statBonus: Partial<Record<StatKey, number>>
  startingItem: string
}

export type CharacterDraft = {
  name: string
  archetypeId: CharacterArchetypeId
}

export type Settings = {
  textSpeed: TextSpeed
  animationIntensity: AnimationIntensity
  themeContrast: ThemeContrast
  soundEnabled: boolean
  aiModeEnabled: boolean
  useCustomAiConfig: boolean
  apiBaseUrl: string
  aiModel: string
  apiKey: string
}

export type PlayerStatsModel = {
  name: string
  archetypeId: CharacterArchetypeId
  archetypeName: string
  health: number
  energy: number
  sanity: number
  inventory: string[]
}

export type Choice = {
  id: string
  label: string
  tone?: string
}

export type HistoryEntry = {
  id: string
  type: 'story' | 'choice' | 'custom'
  text: string
  timestamp: string
}

export type SceneState = {
  id: string
  text: string
  choices: Choice[]
}

export type SessionMetadata = {
  id: string
  startedAt: string
  lastUpdatedAt: string
  chapter: string
  turn: number
}

export type GameState = {
  phase: GamePhase
  scene: SceneState
  player: PlayerStatsModel
  history: HistoryEntry[]
  session: SessionMetadata
}

export type EngineResult = {
  scene: SceneState
  playerPatch?: Partial<PlayerStatsModel>
  historyNote?: string
}
