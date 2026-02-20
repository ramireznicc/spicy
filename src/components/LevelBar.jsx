const LEVEL_NAMES = {
  tibio: '🌡️ Tibio',
  caliente: '🔥 Caliente',
  picante: '🌶️ Picante',
}

function DotRow({ start, count, round }) {
  return (
    <div className="level-bar-row">
      {Array.from({ length: count }, (_, j) => {
        const i = start + j
        let cls = 'dot'
        if (i < round - 1) cls += ' dot-past'
        else if (i === round - 1) cls += ' dot-current'
        return <div key={i} className={cls} />
      })}
    </div>
  )
}

export default function LevelBar({ round, level, levelChanged }) {
  return (
    <div className="level-section">
      <div className="level-bar">
        <DotRow start={0} count={15} round={round} />
        <DotRow start={15} count={15} round={round} />
      </div>
      <div className={`level-label${levelChanged ? ' level-label-up' : ''}`}>{LEVEL_NAMES[level]}</div>
    </div>
  )
}
