import { useNavigate } from 'react-router-dom'
import { useHabits } from '../context/HabitContext'
import HabitCard from '../components/HabitCard'

export default function HomeScreen() {
  const { habits } = useHabits()
  const navigate = useNavigate()

  return (
    <div className="screen home-screen">
      <h2>My Habits</h2>

      {habits.length === 0 ? (
        <div className="empty-state">
          <p>No habits yet. Start tracking your daily habits!</p>
        </div>
      ) : (
        <div className="habit-list">
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onClick={() => navigate(`/habit/${habit.id}`)}
            />
          ))}
        </div>
      )}

      <button className="btn btn-primary fab" onClick={() => navigate('/add')}>
        + Add Habit
      </button>
    </div>
  )
}
