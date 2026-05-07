import { AppShell } from './components/AppShell'
import { GameScreen } from './components/GameScreen'
import { GameOverModal } from './components/GameOverModal'
// import { LoadingOverlay } from './components/LoadingOverlay'
import { QuitGameModal } from './components/QuitGameModal'
import { SettingsModal } from './components/SettingsModal'
import { StartScreen } from './components/StartScreen'
import { useGameEngine } from './hooks/useGameEngine'

function App() {
  const engine = useGameEngine()

  return (
    <AppShell settings={engine.settings}>
      {engine.gameState.phase === 'playing' ? (
        <GameScreen
          gameState={engine.gameState}
          settings={engine.settings}
          isLoading={engine.isLoading}
          streamingStoryText={engine.streamingStoryText}
          isHistoryOpen={engine.isHistoryOpen}
          isReadingMode={engine.isReadingMode}
          onSelectChoice={engine.submitChoice}
          onSubmitCustomAction={engine.submitCustomAction}
          onToggleHistory={() => engine.setIsHistoryOpen((value) => !value)}
          onToggleReadingMode={() => engine.setIsReadingMode((value) => !value)}
          onOpenSettings={() => engine.setIsSettingsOpen(true)}
          onOpenQuitMenu={() => engine.setIsQuitModalOpen(true)}
        />
      ) : (
        <StartScreen
          canContinue={engine.canContinue}
          onStart={engine.startNewJourney}
          onContinue={engine.continueJourney}
          onSettings={() => engine.setIsSettingsOpen(true)}
        />
      )}

      <QuitGameModal
        open={engine.isQuitModalOpen}
        onClose={() => engine.setIsQuitModalOpen(false)}
        onStartMenu={engine.returnToStartMenu}
        onNewGame={engine.quitAndStartNew}
      />
      <GameOverModal gameOver={engine.gameState.gameOver ?? null} onNewGame={engine.quitAndStartNew} />
      <SettingsModal
        open={engine.isSettingsOpen}
        settings={engine.settings}
        onChange={engine.setSettings}
        onClose={() => engine.setIsSettingsOpen(false)}
      />
      {/* <LoadingOverlay visible={engine.isLoading && !engine.streamingStoryText} /> */}
    </AppShell>
  )
}

export default App
