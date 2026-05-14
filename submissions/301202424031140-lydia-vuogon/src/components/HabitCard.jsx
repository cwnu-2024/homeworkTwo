export default function HabitCard({ habit, onClick }) {
  const categoryColors = {
    Health: '#10B981',
    Fitness: '#F59E0B',
    Productivity: '#3B82F6',
    Learning: '#8B5CF6',
    Lifestyle: '#EC4899',
    Other: '#6B7280',
  }

  return (
    <div className="habit-card" onClick={onClick}>
      <div className="habit-card-top">
        <span
          className="habit-category"
          style={{ backgroundColor: categoryColors[habit.category] || '#6B7280' }}
        >
          {habit.category}
        </span>
        <span className="habit-target">{habit.weeklyTarget}x / week</span>
      </div>
      <h3 className="habit-name">{habit.name}</h3>
      {habit.goal && <p className="habit-goal">{habit.goal}</p>}
    </div>
  )
}
