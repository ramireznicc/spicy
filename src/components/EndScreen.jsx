export default function EndScreen({ played, skipped, onRestart }) {
  return (
    <div className="end">
      <div className="end-emoji">💋</div>
      <h1 className="end-title">¡Things got Spicy!</h1>
      <div className="end-stats">
        <div className="stat">
          <span className="stat-number">{played}</span>
          <span className="stat-label">jugadas</span>
        </div>
        <div className="stat">
          <span className="stat-number">{skipped}</span>
          <span className="stat-label">pasadas</span>
        </div>
      </div>
      <p className="end-text">Esperamos que hayan disfrutado el juego... y lo que viene después 🔥</p>
      <button className="btn-start" onClick={onRestart}>
        Jugar de nuevo 🔥
      </button>
    </div>
  )
}
