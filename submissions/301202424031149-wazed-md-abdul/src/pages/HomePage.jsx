import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function HomePage() {
  const [habits, setHabits] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('habits')
    if (stored) {
      setHabits(JSON.parse(stored))
    }
  }, [])

  return (
    <div className="page">
      <header className="page-header">
        <h1>Habit Tracker</h1>
        <p className="subtitle">Build better habits, one day at a time</p>
      </header>

      <main className="page-content">
        {habits.length === 0 ? (
          <div className="empty-state">
            <p>No habits yet. Start by creating your first habit!</p>
          </div>
        ) : (
          <ul className="habit-list">
            {habits.map((habit) => (
              <li key={habit.id}>
                <Link to={`/habit/${habit.id}`} className="habit-card">
                  <span className="habit-name">{habit.name}</span>
                  <span className="habit-category">{habit.category}</span>
                  <span className="habit-streak">Target: {habit.target} {habit.targetUnit}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Link to="/create" className="btn btn-primary btn-large">
          + Create New Habit
        </Link>
      </main>
    </div>
  )
}

export default HomePage
