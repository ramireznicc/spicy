import { useState } from 'react'

export default function IntroScreen({ onStart }) {
  const [players, setPlayers] = useState(['', ''])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = players.map((p) => p.trim())
    if (trimmed.every((p) => p) && !hasDuplicates) {
      onStart(trimmed)
    }
  }

  const addPlayer = () => {
    if (players.length < 6) {
      setPlayers((prev) => [...prev, ''])
    }
  }

  const removePlayer = (index) => {
    setPlayers((prev) => prev.filter((_, i) => i !== index))
  }

  const updatePlayer = (index, value) => {
    setPlayers((prev) => prev.map((p, i) => (i === index ? value : p)))
  }

  const normalized = players.map((p) => p.trim().toLowerCase())
  const duplicateIndexes = new Set(
    normalized.flatMap((name, i) =>
      name && normalized.indexOf(name) !== i ? [i, normalized.indexOf(name)] : []
    )
  )
  const hasDuplicates = duplicateIndexes.size > 0
  const canStart = players.every((p) => p.trim()) && !hasDuplicates

  return (
    <div className="intro">
      <div className="flame-emoji">🔥</div>
      <h1 className="title">Spicy</h1>
      <p className="subtitle">Un juego para encender la llama 💋</p>
      <form className="name-form" onSubmit={handleSubmit}>
        {players.map((player, index) => (
          <div key={index} className="player-input-row">
            <input
              type="text"
              placeholder={`Nombre jugador/a ${index + 1}`}
              value={player}
              onChange={(e) => updatePlayer(index, e.target.value)}
              maxLength={20}
              className={duplicateIndexes.has(index) ? 'input-error' : ''}
            />
            {index >= 2 && (
              <button
                type="button"
                className="btn-remove-player"
                onClick={() => removePlayer(index)}
                aria-label="Eliminar jugador"
              >
                ×
              </button>
            )}
          </div>
        ))}
        {hasDuplicates && (
          <p className="input-error-msg">Los nombres deben ser únicos</p>
        )}
        {players.length < 6 && (
          <button type="button" className="btn-add-player" onClick={addPlayer}>
            + Añadir jugador
          </button>
        )}
        <button
          type="submit"
          className="btn-start"
          disabled={!canStart}
        >
          Empezar el juego 🔥
        </button>
      </form>
    </div>
  )
}
