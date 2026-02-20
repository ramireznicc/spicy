const CATEGORIES = [
  { key: 'verdad', label: 'Verdades' },
  { key: 'reto', label: 'Retos' },
  { key: 'pregunta', label: 'Preguntas' },
  { key: 'fantasia', label: 'Fantasías' },
]

export default function CategoryChips({ activeCats, onToggle }) {
  return (
    <div className="category-chips">
      {CATEGORIES.map(({ key, label }) => (
        <button
          key={key}
          className={`chip ${activeCats.has(key) ? 'chip-active' : ''}`}
          onClick={() => onToggle(key)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
