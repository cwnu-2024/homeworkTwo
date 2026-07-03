import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function HabitDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [habit, setHabit] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('habits')
    if (stored) {
      const habits = JSON.parse(stored)
      const found = habits.find((h) => h.id === id)
      setHabit(found)
    }
  }, [id])

  if (!habit) {
    return (
      <div className="page">
        <header className="page-header">
          <button className="btn btn-back" onClick={() => navigate('/')}>
            &larr; Back
          </button>
          <h1>Habit Not Found</h1>
        </header>
        <main className="page-content">
          <p>The habit you are looking for does not exist.</p>
        </main>
      </div>
    )
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'Not set'
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  function formatCreatedAt(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function getDifficultyEmoji(difficulty) {
    switch (difficulty) {
      case 'easy': return '🌟'
      case 'medium': return '💪'
      case 'hard': return '🔥'
      default: return '📋'
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <button className="btn btn-back" onClick={() => navigate('/')}>
          &larr; Back
        </button>
        <h1>{habit.name}</h1>
      </header>

      <main className="page-content">
        <div className="detail-card">
          <div className="detail-row">
            <span className="detail-label">Category</span>
            <span className="detail-value">{habit.category}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Daily Target</span>
            <span className="detail-value">
              {habit.target} {habit.targetUnit}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Difficulty</span>
            <span className="detail-value">
              {getDifficultyEmoji(habit.difficulty)} {habit.difficulty}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Start Date</span>
            <span className="detail-value">{formatDate(habit.startDate)}</span>
          </div>

          <div className="detail-row detail-row-full">
            <span className="detail-label">Description</span>
            <p className="detail-text">{habit.description}</p>
          </div>

          <div className="detail-row">
            <span className="detail-label">Created</span>
            <span className="detail-value">{formatCreatedAt(habit.createdAt)}</span>
          </div>
        </div>

        <button className="btn btn-secondary btn-large" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </main>
    </div>
  )
}

export default HabitDetailPage
