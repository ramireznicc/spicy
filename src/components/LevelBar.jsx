const LEVEL_NAMES = {
  tibio: '🌡️ Tibio',
  caliente: '🔥 Caliente',
  picante: '🌶️ Picante',
}

export default function LevelBar({ round, level }) {
  return (
    <div className="level-section">
      <div className="level-bar">
        {Array.from({ length: 30 }, (_, i) => {
          let cls = 'dot'
          if (i < round - 1) cls += ' dot-past'
          else if (i === round - 1) cls += ' dot-current'
          return <div key={i} className={cls} />
        })}
      </div>
      <div className="level-label">{LEVEL_NAMES[level]}</div>
    </div>
  )
}
