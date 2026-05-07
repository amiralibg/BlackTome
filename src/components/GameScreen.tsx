import { useState } from 'react'
import type { Choice, GameState, Settings } from '../types/game'
import { HistoryLog } from './HistoryLog'
import { PlayerStats } from './PlayerStats'
import { StoryPanel } from './StoryPanel'
import { DesktopActionPanel, MobileActionDock, type ActionMode } from './game/ActionControls'
import { MobileResourceBar, MobileResourcesSheet } from './game/MobileResources'

type GameScreenProps = {
  gameState: GameState
  settings: Settings
  isLoading: boolean
  streamingStoryText: string
  isHistoryOpen: boolean
  isReadingMode: boolean
  onSelectChoice: (choice: Choice) => void
  onSubmitCustomAction: (input: string) => void
  onToggleHistory: () => void
  onToggleReadingMode: () => void
  onOpenSettings: () => void
  onOpenQuitMenu: () => void
}

export function GameScreen({ gameState, settings, isLoading, streamingStoryText, isHistoryOpen, isReadingMode, onSelectChoice, onSubmitCustomAction, onToggleHistory, onToggleReadingMode, onOpenSettings, onOpenQuitMenu }: GameScreenProps) {
  const showWriteMode = settings.aiModeEnabled
  const [activeMode, setActiveMode] = useState<ActionMode>('paths')
  const [isResourcesOpen, setIsResourcesOpen] = useState(false)
  const visibleMode = showWriteMode ? activeMode : 'paths'

  return (
    <div className={`grid w-full gap-5 py-2 lg:min-h-0 ${isReadingMode ? 'lg:grid-cols-1' : 'lg:grid-cols-[18rem_minmax(0,1fr)]'}`}>
      <aside className={`order-2 hidden min-h-0 content-start gap-5 lg:order-1 lg:grid ${isReadingMode ? 'lg:hidden' : 'lg:max-h-full lg:grid-rows-[auto_minmax(0,1fr)]'}`}>
        <PlayerStats player={gameState.player} />
        <HistoryLog history={gameState.history} isOpen={isHistoryOpen} onToggle={onToggleHistory} />
      </aside>

      <section className={`order-1 flex min-h-[calc(100svh-2.5rem)] min-w-0 flex-col gap-5 pb-50 lg:min-h-0 lg:pb-0 ${isReadingMode ? '' : 'lg:order-2'}`}>
        <MobileResourceBar player={gameState.player} onOpen={() => setIsResourcesOpen(true)} />

        <SessionHeader onOpenSettings={onOpenSettings} onOpenQuitMenu={onOpenQuitMenu} />

        <div className="min-h-0 flex-1">
          <StoryPanel
            text={gameState.scene.text}
            streamingText={streamingStoryText}
            isStreaming={isLoading && Boolean(streamingStoryText)}
            isLoading={isLoading && !streamingStoryText}
            chapter={gameState.session.chapter}
            turn={gameState.session.turn}
            settings={settings}
            readingMode={isReadingMode}
            onToggleReadingMode={onToggleReadingMode}
          />
        </div>

        {!isReadingMode && (
          <DesktopActionPanel
            choices={gameState.scene.choices}
            activeMode={visibleMode}
            showWriteMode={showWriteMode}
            isLoading={isLoading}
            onModeChange={setActiveMode}
            onSelectChoice={onSelectChoice}
            onSubmitCustomAction={onSubmitCustomAction}
          />
        )}
      </section>

      {!isReadingMode && (
        <MobileActionDock
          choices={gameState.scene.choices}
          activeMode={visibleMode}
          showWriteMode={showWriteMode}
          isLoading={isLoading}
          onModeChange={setActiveMode}
          onSelectChoice={onSelectChoice}
          onSubmitCustomAction={onSubmitCustomAction}
        />
      )}

      <MobileResourcesSheet player={gameState.player} isOpen={isResourcesOpen} onClose={() => setIsResourcesOpen(false)} />
    </div>
  )
}

type SessionHeaderProps = {
  onOpenSettings: () => void
  onOpenQuitMenu: () => void
}

function SessionHeader({ onOpenSettings, onOpenQuitMenu }: SessionHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-stone-200/10 bg-black/24 px-4 py-3 backdrop-blur-xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-500">Blacktome session</p>
        <p className="mt-1 font-serif-display text-2xl text-stone-100">A living page awaits your hand</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onOpenSettings} className="rounded-full border border-stone-200/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-300 transition hover:border-stone-200/35 hover:text-white focus:outline-none focus:ring-2 focus:ring-stone-200/50">
          Settings
        </button>
        <button type="button" onClick={onOpenQuitMenu} className="rounded-full border border-crimson-200/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-crimson-100/80 transition hover:border-crimson-200/55 hover:text-crimson-50 focus:outline-none focus:ring-2 focus:ring-crimson-200/60">
          Quit
        </button>
      </div>
    </header>
  )
}
