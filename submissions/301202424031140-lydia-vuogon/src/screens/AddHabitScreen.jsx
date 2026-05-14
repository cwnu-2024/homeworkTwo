import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHabits } from '../context/HabitContext'

const CATEGORIES = ['Health', 'Fitness', 'Productivity', 'Learning', 'Lifestyle', 'Other']

const initialForm = {
  name: '',
  category: '',
  weeklyTarget: '',
  goal: '',
  startDate: '',
}

export default function AddHabitScreen() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const { dispatch } = useHabits()
  const navigate = useNavigate()

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  function validate() {
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'Habit name is required'
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!form.category) {
      newErrors.category = 'Please select a category'
    }

    if (!form.weeklyTarget) {
      newErrors.weeklyTarget = 'Weekly target is required'
    } else {
      const num = Number(form.weeklyTarget)
      if (isNaN(num) || !Number.isInteger(num) || num < 1 || num > 7) {
        newErrors.weeklyTarget = 'Must be a whole number between 1 and 7'
      }
    }

    if (!form.startDate) {
      newErrors.startDate = 'Start date is required'
    } else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const selected = new Date(form.startDate)
      selected.setHours(0, 0, 0, 0)
      if (selected < today) {
        newErrors.startDate = 'Start date must be today or later'
      }
    }

    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    dispatch({
      type: 'ADD_HABIT',
      payload: {
        name: form.name.trim(),
        category: form.category,
        weeklyTarget: Number(form.weeklyTarget),
        goal: form.goal.trim(),
        startDate: form.startDate,
      },
    })

    navigate('/')
  }

  return (
    <div className="screen form-screen">
      <h2>New Habit</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Habit Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Morning Run"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="field">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="">-- Select --</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <span className="error">{errors.category}</span>}
        </div>

        <div className="field">
          <label htmlFor="weeklyTarget">Times per Week *</label>
          <input
            id="weeklyTarget"
            name="weeklyTarget"
            type="number"
            min="1"
            max="7"
            placeholder="1-7"
            value={form.weeklyTarget}
            onChange={handleChange}
          />
          {errors.weeklyTarget && <span className="error">{errors.weeklyTarget}</span>}
        </div>

        <div className="field">
          <label htmlFor="goal">Goal Description</label>
          <textarea
            id="goal"
            name="goal"
            placeholder="Why do you want to build this habit?"
            rows="3"
            value={form.goal}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="startDate">Start Date *</label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
          />
          {errors.startDate && <span className="error">{errors.startDate}</span>}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Habit
          </button>
        </div>
      </form>
    </div>
  )
}
