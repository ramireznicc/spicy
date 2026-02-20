import { useState, useCallback } from 'react'
import IntroScreen from './components/IntroScreen'
import GameScreen from './components/GameScreen'
import EndScreen from './components/EndScreen'
import { CARDS } from './data/cards'
import { playLevelUp } from './sounds'

function getLevel(round) {
  if (round <= 10) return 'tibio'
  if (round <= 20) return 'caliente'
  return 'picante'
}

function pickCard(activeCats, level, usedCards) {
  const available = []

  for (const cat of activeCats) {
    const pool = CARDS[cat]?.[level]
    if (!pool) continue
    for (let i = 0; i < pool.length; i++) {
      const key = `${cat}-${level}-${i}`
      if (!usedCards.has(key)) {
        available.push({ card: pool[i], category: cat, key })
      }
    }
  }

  if (available.length === 0) {
    // Reset used cards for active categories at this level and retry
    const resetUsed = new Set(usedCards)
    for (const cat of activeCats) {
      const pool = CARDS[cat]?.[level]
      if (!pool) continue
      for (let i = 0; i < pool.length; i++) {
        resetUsed.delete(`${cat}-${level}-${i}`)
      }
    }
    // Re-collect
    for (const cat of activeCats) {
      const pool = CARDS[cat]?.[level]
      if (!pool) continue
      for (let i = 0; i < pool.length; i++) {
        const key = `${cat}-${level}-${i}`
        if (!resetUsed.has(key)) {
          available.push({ card: pool[i], category: cat, key })
        }
      }
    }
    if (available.length > 0) {
      const pick = available[Math.floor(Math.random() * available.length)]
      return { ...pick, newUsedCards: new Set([...resetUsed, pick.key]) }
    }
    return null
  }

  const pick = available[Math.floor(Math.random() * available.length)]
  return { ...pick, newUsedCards: new Set([...usedCards, pick.key]) }
}

function App() {
  const [ageVerified, setAgeVerified] = useState(false)
  const [screen, setScreen] = useState('intro')
  const [players, setPlayers] = useState(['', ''])
  const [currentTurn, setCurrentTurn] = useState(0)
  const [round, setRound] = useState(1)
  const [played, setPlayed] = useState(0)
  const [skipped, setSkipped] = useState(0)
  const [usedCards, setUsedCards] = useState(new Set())
  const [activeCats, setActiveCats] = useState(
    new Set(['verdad', 'reto', 'pregunta', 'fantasia'])
  )
  const [currentCard, setCurrentCard] = useState(null)
  const [currentCategory, setCurrentCategory] = useState('')
  const [animKey, setAnimKey] = useState(0)
  const [levelChanged, setLevelChanged] = useState(false)

  const dealCard = useCallback(
    (r, cats, used) => {
      const level = getLevel(r)
      const result = pickCard(cats, level, used)
      if (result) {
        setCurrentCard(result.card)
        setCurrentCategory(result.category)
        setUsedCards(result.newUsedCards)
        setAnimKey((k) => k + 1)
      }
    },
    []
  )

  const handleStart = useCallback(
    (name1, name2) => {
      setPlayers([name1, name2])
      setCurrentTurn(0)
      setRound(1)
      setPlayed(0)
      setSkipped(0)
      setUsedCards(new Set())
      setActiveCats(new Set(['verdad', 'reto', 'pregunta', 'fantasia']))
      setScreen('game')
      dealCard(1, new Set(['verdad', 'reto', 'pregunta', 'fantasia']), new Set())
    },
    [dealCard]
  )

  const advance = useCallback(
    (wasSkipped) => {
      if (wasSkipped) {
        setSkipped((s) => s + 1)
      } else {
        setPlayed((p) => p + 1)
      }

      const nextRound = round + 1
      if (nextRound > 30) {
        setPlayed((p) => (wasSkipped ? p : p))
        setScreen('end')
        return
      }

      if (getLevel(round) !== getLevel(nextRound)) {
        playLevelUp()
        setLevelChanged(true)
        setTimeout(() => setLevelChanged(false), 1000)
      }

      setRound(nextRound)
      setCurrentTurn((t) => (t === 0 ? 1 : 0))
      dealCard(nextRound, activeCats, usedCards)
    },
    [round, activeCats, usedCards, dealCard]
  )

  const handleNext = useCallback(() => advance(false), [advance])
  const handleSkip = useCallback(() => advance(true), [advance])

  const handleToggleCat = useCallback(
    (cat) => {
      setActiveCats((prev) => {
        const next = new Set(prev)
        if (next.has(cat)) {
          if (next.size <= 1) return prev
          next.delete(cat)
        } else {
          next.add(cat)
        }
        return next
      })
    },
    []
  )

  const handleRestart = useCallback(() => {
    setScreen('intro')
    setCurrentCard(null)
  }, [])

  if (!ageVerified) {
    return (
      <div className="container">
        <div className="age-gate">
          <div className="age-gate-card">
            <h1 className="age-gate-title">Contenido para adultos</h1>
            <div className="age-gate-divider" />
            <p className="age-gate-text">
              Al continuar, confirmás que tenés 18 años o más
              y aceptás acceder a contenido de carácter adulto.
            </p>
            <button className="age-gate-btn" onClick={() => setAgeVerified(true)}>
              Soy mayor de 18 años
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      {screen === 'intro' && <IntroScreen onStart={handleStart} />}
      {screen === 'game' && (
        <GameScreen
          players={players}
          currentTurn={currentTurn}
          round={round}
          level={getLevel(round)}
          currentCard={currentCard}
          currentCategory={currentCategory}
          animKey={animKey}
          activeCats={activeCats}
          levelChanged={levelChanged}
          onNext={handleNext}
          onSkip={handleSkip}
          onToggleCat={handleToggleCat}
        />
      )}
      {screen === 'end' && (
        <EndScreen
          played={played}
          skipped={skipped}
          onRestart={handleRestart}
        />
      )}
    </div>
  )
}

export default App
