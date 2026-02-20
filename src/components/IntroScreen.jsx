import { useState } from 'react'

export default function IntroScreen({ onStart }) {
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name1.trim() && name2.trim()) {
      onStart(name1.trim(), name2.trim())
    }
  }

  return (
    <div className="intro">
      <div className="flame-emoji">🔥</div>
      <h1 className="title">Spicy</h1>
      <p className="subtitle">Un juego para encender la llama 💋</p>
      <form className="name-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre jugador/a 1"
          value={name1}
          onChange={(e) => setName1(e.target.value)}
          maxLength={20}
        />
        <input
          type="text"
          placeholder="Nombre jugador/a 2"
          value={name2}
          onChange={(e) => setName2(e.target.value)}
          maxLength={20}
        />
        <button
          type="submit"
          className="btn-start"
          disabled={!name1.trim() || !name2.trim()}
        >
          Empezar el juego 🔥
        </button>
      </form>
    </div>
  )
}
