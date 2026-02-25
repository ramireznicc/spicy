import { useState } from 'react'

const MIN_CHALLENGES = 5

export default function CustomChallengesScreen({ players, onDone }) {
  const [playerIndex, setPlayerIndex] = useState(0)
  const [challengesByPlayer, setChallengesByPlayer] = useState(
    () => players.map(() => [])
  )
  const [input, setInput] = useState('')
  const [duplicateError, setDuplicateError] = useState(false)

  const currentPlayer = players[playerIndex]
  const currentChallenges = challengesByPlayer[playerIndex]
  const allChallenges = challengesByPlayer.flat().map((c) => c.toLowerCase())
  const inputNormalized = input.trim().toLowerCase()
  const isDuplicate = inputNormalized.length > 0 && allChallenges.includes(inputNormalized)
  const canAdd = input.trim().length > 0 && !isDuplicate
  const canFinish = currentChallenges.length >= MIN_CHALLENGES

  const addChallenge = () => {
    const text = input.trim()
    if (!text) return
    if (allChallenges.includes(text.toLowerCase())) {
      setDuplicateError(true)
      return
    }
    setDuplicateError(false)
    setChallengesByPlayer((prev) =>
      prev.map((list, i) => (i === playerIndex ? [...list, text] : list))
    )
    setInput('')
  }

  const removeChallenge = (index) => {
    setChallengesByPlayer((prev) =>
      prev.map((list, i) =>
        i === playerIndex ? list.filter((_, j) => j !== index) : list
      )
    )
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    setDuplicateError(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (canAdd) addChallenge()
    }
  }

  const handleFinish = () => {
    if (!canFinish) return
    if (playerIndex < players.length - 1) {
      setPlayerIndex((p) => p + 1)
      setInput('')
      setDuplicateError(false)
    } else {
      const formatted = challengesByPlayer
        .flat()
        .map((text) => ({ emoji: '🎯', text }))
      onDone(formatted)
    }
  }

  const isLastPlayer = playerIndex === players.length - 1
  const showError = duplicateError || isDuplicate

  return (
    <div className="custom-challenges">
      <div className="custom-challenges-header">
        <div className="custom-challenges-progress">
          Jugador {playerIndex + 1} de {players.length}
        </div>
        <h2 className="custom-challenges-title">
          Retos de <span className="turn-name">{currentPlayer}</span>
        </h2>
        <p className="custom-challenges-hint">
          Escribí tus retos para los demás. Mínimo {MIN_CHALLENGES}.
        </p>
      </div>

      <div className="custom-input-row">
        <input
          type="text"
          placeholder="Escribí un reto..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          maxLength={140}
          autoFocus
          className={showError ? 'input-error' : ''}
        />
        <button
          type="button"
          className="btn-add-challenge"
          onClick={addChallenge}
          disabled={!canAdd}
        >
          +
        </button>
      </div>
      {showError && (
        <p className="input-error-msg">Este reto ya fue agregado</p>
      )}

      <ul className="challenge-list">
        {currentChallenges.map((challenge, i) => (
          <li key={i} className="challenge-item">
            <span className="challenge-text">{challenge}</span>
            <button
              type="button"
              className="btn-remove-challenge"
              onClick={() => removeChallenge(i)}
              aria-label="Eliminar reto"
            >
              ×
            </button>
          </li>
        ))}
        {currentChallenges.length === 0 && (
          <li className="challenge-empty">Todavía no agregaste ningún reto</li>
        )}
      </ul>

      <div className="custom-challenges-footer">
        <span className="challenge-count">
          {currentChallenges.length} / {MIN_CHALLENGES} mínimos
        </span>
        <button
          className="btn-start"
          onClick={handleFinish}
          disabled={!canFinish}
        >
          {isLastPlayer ? 'Empezar el juego 🔥' : `Siguiente jugador →`}
        </button>
      </div>
    </div>
  )
}
