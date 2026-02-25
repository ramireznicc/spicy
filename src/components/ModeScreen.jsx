export default function ModeScreen({ onSelect }) {
  return (
    <div className="mode-screen">
      <h2 className="mode-title">¿Cómo quieren jugar?</h2>
      <div className="mode-options">
        <button className="mode-card" onClick={() => onSelect('classic')}>
          <span className="mode-card-emoji">🃏</span>
          <div className="mode-card-info">
            <span className="mode-card-name">Juego clásico</span>
            <span className="mode-card-desc">Preguntas y retos ya preparados</span>
          </div>
        </button>
        <button className="mode-card" onClick={() => onSelect('custom')}>
          <span className="mode-card-emoji">✏️</span>
          <div className="mode-card-info">
            <span className="mode-card-name">Retos personalizados</span>
            <span className="mode-card-desc">Cada jugador escribe sus propios retos</span>
          </div>
        </button>
      </div>
    </div>
  )
}
