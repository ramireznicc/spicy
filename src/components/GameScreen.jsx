import Card from './Card'
import LevelBar from './LevelBar'
import CategoryChips from './CategoryChips'

export default function GameScreen({
  players,
  currentTurn,
  round,
  totalRounds,
  level,
  currentCard,
  currentCategory,
  animKey,
  activeCats,
  levelChanged,
  gameMode,
  onNext,
  onSkip,
  onToggleCat,
}) {
  const currentPlayer = players[currentTurn]
  const otherPlayer = players[(currentTurn + 1) % players.length]

  const cardWithName = currentCard
    ? { ...currentCard, text: currentCard.text.replace(/\{otro\/a\}/g, otherPlayer) }
    : null

  return (
    <div className="game">
      <div className="game-header">
        <div className="turn-indicator">
          Turno de <span className="turn-name">{currentPlayer}</span>
        </div>
        <div className="round-badge">Ronda {round}/{totalRounds}</div>
      </div>

      {gameMode !== 'custom' && (
        <LevelBar round={round} level={level} levelChanged={levelChanged} />
      )}

      {cardWithName && (
        <Card key={animKey} card={cardWithName} category={currentCategory} />
      )}

      <div className="game-actions">
        <button className="btn-next" onClick={onNext}>
          Siguiente 🔥
        </button>
        <button className="btn-skip" onClick={onSkip}>
          Pasar
        </button>
      </div>

      {gameMode !== 'custom' && (
        <CategoryChips activeCats={activeCats} onToggle={onToggleCat} />
      )}
    </div>
  )
}
