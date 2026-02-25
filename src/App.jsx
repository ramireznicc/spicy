import { useState, useCallback } from 'react'
import IntroScreen from './components/IntroScreen'
import ModeScreen from './components/ModeScreen'
import CustomChallengesScreen from './components/CustomChallengesScreen'
import GameScreen from './components/GameScreen'
import EndScreen from './components/EndScreen'
import { CARDS } from './data/cards'
import { playLevelUp } from './sounds'

function getLevel(round) {
  if (round <= 10) return 'tibio'
  if (round <= 20) return 'caliente'
  return 'picante'
}

function pickCard(activeCats, level, usedCards, customPool = []) {
  function collect(used) {
    const avail = []
    for (const cat of activeCats) {
      const pool = CARDS[cat]?.[level]
      if (!pool) continue
      for (let i = 0; i < pool.length; i++) {
        const key = `${cat}-${level}-${i}`
        if (!used.has(key)) avail.push({ card: pool[i], category: cat, key })
      }
    }
    for (let i = 0; i < customPool.length; i++) {
      const key = `personalizado-${i}`
      if (!used.has(key)) avail.push({ card: customPool[i], category: 'personalizado', key })
    }
    return avail
  }

  let available = collect(usedCards)
  let newUsedCards = usedCards

  if (available.length === 0) {
    const reset = new Set(usedCards)
    for (const cat of activeCats) {
      const pool = CARDS[cat]?.[level]
      if (!pool) continue
      for (let i = 0; i < pool.length; i++) reset.delete(`${cat}-${level}-${i}`)
    }
    for (let i = 0; i < customPool.length; i++) reset.delete(`personalizado-${i}`)
    newUsedCards = reset
    available = collect(newUsedCards)
  }

  if (available.length === 0) return null

  const pick = available[Math.floor(Math.random() * available.length)]
  return { ...pick, newUsedCards: new Set([...newUsedCards, pick.key]) }
}

function App() {
  const [ageVerified, setAgeVerified] = useState(false)
  const [screen, setScreen] = useState('intro')
  const [players, setPlayers] = useState(['', ''])
  const [gameMode, setGameMode] = useState('classic')
  const [customChallenges, setCustomChallenges] = useState([])
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
  const [totalRounds, setTotalRounds] = useState(30)

  const dealCard = useCallback((r, cats, used, customPool) => {
    const level = getLevel(r)
    const result = pickCard(cats, level, used, customPool)
    if (result) {
      setCurrentCard(result.card)
      setCurrentCategory(result.category)
      setUsedCards(result.newUsedCards)
      setAnimKey((k) => k + 1)
    }
  }, [])

  const startGame = useCallback(
    (mode, challenges) => {
      const cats = mode === 'custom'
        ? new Set()
        : new Set(['verdad', 'reto', 'pregunta', 'fantasia'])
      const rounds = mode === 'custom' ? challenges.length : 30
      setGameMode(mode)
      setCustomChallenges(challenges)
      setTotalRounds(rounds)
      setCurrentTurn(0)
      setRound(1)
      setPlayed(0)
      setSkipped(0)
      setUsedCards(new Set())
      setActiveCats(cats)
      setScreen('game')
      dealCard(1, cats, new Set(), challenges)
    },
    [dealCard]
  )

  const handleStart = useCallback((playerNames) => {
    setPlayers(playerNames)
    setScreen('mode')
  }, [])

  const handleSelectMode = useCallback(
    (mode) => {
      if (mode === 'classic') {
        startGame('classic', [])
      } else {
        setGameMode('custom')
        setScreen('custom-challenges')
      }
    },
    [startGame]
  )

  const handleCustomDone = useCallback(
    (challenges) => {
      startGame('custom', challenges)
    },
    [startGame]
  )

  const advance = useCallback(
    (wasSkipped) => {
      if (wasSkipped) {
        setSkipped((s) => s + 1)
      } else {
        setPlayed((p) => p + 1)
      }

      const nextRound = round + 1
      if (nextRound > totalRounds) {
        setScreen('end')
        return
      }

      if (getLevel(round) !== getLevel(nextRound)) {
        playLevelUp()
        setLevelChanged(true)
        setTimeout(() => setLevelChanged(false), 1000)
      }

      setRound(nextRound)
      setCurrentTurn((t) => (t + 1) % players.length)
      dealCard(nextRound, activeCats, usedCards, customChallenges)
    },
    [round, activeCats, usedCards, dealCard, players, customChallenges, totalRounds]
  )

  const handleNext = useCallback(() => advance(false), [advance])
  const handleSkip = useCallback(() => advance(true), [advance])

  const handleToggleCat = useCallback((cat) => {
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
  }, [])

  const handleRestart = useCallback(() => {
    setScreen('intro')
    setCurrentCard(null)
    setCustomChallenges([])
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
      {screen === 'mode' && <ModeScreen onSelect={handleSelectMode} />}
      {screen === 'custom-challenges' && (
        <CustomChallengesScreen players={players} onDone={handleCustomDone} />
      )}
      {screen === 'game' && (
        <GameScreen
          players={players}
          currentTurn={currentTurn}
          round={round}
          totalRounds={totalRounds}
          level={getLevel(round)}
          currentCard={currentCard}
          currentCategory={currentCategory}
          animKey={animKey}
          activeCats={activeCats}
          levelChanged={levelChanged}
          gameMode={gameMode}
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
