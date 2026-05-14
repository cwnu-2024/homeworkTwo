import { createContext, useContext, useReducer } from 'react'

const HabitContext = createContext()

function habitReducer(state, action) {
  switch (action.type) {
    case 'ADD_HABIT':
      return [...state, { ...action.payload, id: Date.now().toString() }]
    default:
      return state
  }
}

export function HabitProvider({ children }) {
  const [habits, dispatch] = useReducer(habitReducer, [])

  return (
    <HabitContext.Provider value={{ habits, dispatch }}>
      {children}
    </HabitContext.Provider>
  )
}

export function useHabits() {
  const context = useContext(HabitContext)
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider')
  }
  return context
}
