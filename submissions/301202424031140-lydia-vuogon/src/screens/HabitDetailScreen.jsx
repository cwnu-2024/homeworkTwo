import { useParams, useNavigate } from 'react-router-dom'
import { useHabits } from '../context/HabitContext'

export default function HabitDetailScreen() {
  const { id } = useParams()
  const { habits } = useHabits()
  const navigate = useNavigate()

  const habit = habits.find(h => h.id === id)

  if (!habit) {
    return (
      <div className="screen detail-screen">
        <h2>Habit Not Found</h2>
        <p>The habit you are looking for does not exist.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="screen detail-screen">
      <h2>{habit.name}</h2>

      <div className="detail-card">
        <div className="detail-row">
          <span className="detail-label">Category</span>
          <span className="detail-value">{habit.category}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Weekly Target</span>
          <span className="detail-value">{habit.weeklyTarget} times</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Start Date</span>
          <span className="detail-value">{habit.startDate}</span>
        </div>
        {habit.goal && (
          <div className="detail-row">
            <span className="detail-label">Goal</span>
            <span className="detail-value">{habit.goal}</span>
          </div>
        )}
      </div>

      <button className="btn btn-secondary" onClick={() => navigate('/')}>
        Back to Habits
      </button>
    </div>
  )
}
