import { useState, useEffect, useRef } from 'react'
import { playPop, playTick, playChime } from '../sounds'

const CAT_LABELS = {
  verdad: 'Verdad',
  reto: 'Reto',
  pregunta: 'Pregunta',
  fantasia: 'Fantasía',
}

function parseTimerSeconds(text) {
  const minMatch = text.match(/(\d+)\s*minutos?/i)
  if (minMatch) return parseInt(minMatch[1], 10) * 60
  const secMatch = text.match(/(\d+)\s*segundos?/i)
  if (secMatch) return parseInt(secMatch[1], 10)
  return 0
}

function formatTime(s) {
  if (s >= 60) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${String(sec).padStart(2, '0')}`
  }
  return `${s}s`
}

export default function Card({ card, category }) {
  const total = parseTimerSeconds(card.text)
  const [started, setStarted] = useState(false)
  const [remaining, setRemaining] = useState(total)
  const finished = total > 0 && started && remaining <= 0
  const chimePlayed = useRef(false)

  useEffect(() => { playPop() }, [])

  useEffect(() => {
    if (total <= 0 || !started) return
    setRemaining(total)
    chimePlayed.current = false
    const id = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(id)
          if (!chimePlayed.current) {
            chimePlayed.current = true
            playChime()
          }
          if (navigator.vibrate) navigator.vibrate([200, 100, 200])
          return 0
        }
        if (prev <= 4 && prev > 1) playTick()
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [total, started])

  const radius = 36
  const stroke = 4
  const circumference = 2 * Math.PI * radius
  const progress = total > 0 && started ? remaining / total : 1
  const offset = circumference * (1 - progress)

  return (
    <div className={`card${finished ? ' card-timer-done' : ''}`}>
      <div className="card-emoji">{card.emoji}</div>
      <span className={`card-badge badge-${category}`}>
        {CAT_LABELS[category]}
      </span>
      <p className="card-text">{card.text}</p>
      {total > 0 && (
        <div className="card-timer">
          <svg width={(radius + stroke) * 2} height={(radius + stroke) * 2}>
            <circle
              className="timer-ring-bg"
              cx={radius + stroke}
              cy={radius + stroke}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={stroke}
            />
            <circle
              className="timer-ring-progress"
              cx={radius + stroke}
              cy={radius + stroke}
              r={radius}
              fill="none"
              stroke={finished ? 'var(--gold)' : 'var(--accent)'}
              strokeWidth={stroke}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${radius + stroke} ${radius + stroke})`}
            />
          </svg>
          {!started && !finished ? (
            <button className="timer-btn" onClick={() => setStarted(true)}>
              Empezar
            </button>
          ) : (
            <span className={`timer-text${finished ? ' timer-text-done' : ''}${!finished && started && remaining <= 3 ? ' timer-text-warning' : ''}`}>
              {finished ? '✓' : formatTime(remaining)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
