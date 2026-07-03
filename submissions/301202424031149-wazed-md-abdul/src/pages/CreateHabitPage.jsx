import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateHabitPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    category: 'health',
    target: '',
    targetUnit: 'minutes',
    difficulty: 'medium',
    startDate: '',
    description: ''
  })

  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  function validate() {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Habit name is required'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Habit name must be at least 3 characters'
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    if (!formData.target) {
      newErrors.target = 'Target value is required'
    } else if (isNaN(formData.target) || Number(formData.target) <= 0) {
      newErrors.target = 'Target must be a positive number'
    } else if (Number(formData.target) > 1000) {
      newErrors.target = 'Target must be 1000 or less'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    const stored = localStorage.getItem('habits')
    const habits = stored ? JSON.parse(stored) : []

    const newHabit = {
      id: Date.now().toString(),
      ...formData,
      target: Number(formData.target),
      createdAt: new Date().toISOString()
    }

    habits.push(newHabit)
    localStorage.setItem('habits', JSON.stringify(habits))
    navigate(`/habit/${newHabit.id}`)
  }

  return (
    <div className="page">
      <header className="page-header">
        <button className="btn btn-back" onClick={() => navigate('/')}>
          &larr; Back
        </button>
        <h1>Create Habit</h1>
      </header>

      <main className="page-content">
        <form onSubmit={handleSubmit} className="habit-form" noValidate>
          <div className="field">
            <label htmlFor="name">Habit Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Morning Meditation"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="field">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="health">Health & Fitness</option>
              <option value="learning">Learning & Education</option>
              <option value="productivity">Productivity</option>
              <option value="social">Social</option>
              <option value="other">Other</option>
            </select>
            {errors.category && <span className="error">{errors.category}</span>}
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="target">Daily Target</label>
              <input
                id="target"
                name="target"
                type="number"
                placeholder="e.g. 30"
                min="1"
                max="1000"
                value={formData.target}
                onChange={handleChange}
              />
              {errors.target && <span className="error">{errors.target}</span>}
            </div>

            <div className="field">
              <label htmlFor="targetUnit">Unit</label>
              <select
                id="targetUnit"
                name="targetUnit"
                value={formData.targetUnit}
                onChange={handleChange}
              >
                <option value="minutes">Minutes</option>
                <option value="pages">Pages</option>
                <option value="times">Times</option>
                <option value="reps">Reps</option>
                <option value="hours">Hours</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="difficulty">Difficulty</label>
            <div className="radio-group">
              <label className="radio">
                <input
                  type="radio"
                  name="difficulty"
                  value="easy"
                  checked={formData.difficulty === 'easy'}
                  onChange={handleChange}
                />
                Easy
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="difficulty"
                  value="medium"
                  checked={formData.difficulty === 'medium'}
                  onChange={handleChange}
                />
                Medium
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="difficulty"
                  value="hard"
                  checked={formData.difficulty === 'hard'}
                  onChange={handleChange}
                />
                Hard
              </label>
            </div>
          </div>

          <div className="field">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
            />
            {errors.startDate && <span className="error">{errors.startDate}</span>}
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your habit and why it matters..."
              rows="4"
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && <span className="error">{errors.description}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-large">
            Save Habit
          </button>
        </form>
      </main>
    </div>
  )
}

export default CreateHabitPage
