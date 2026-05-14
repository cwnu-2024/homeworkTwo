import { Routes, Route, NavLink } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen'
import AddHabitScreen from './screens/AddHabitScreen'
import HabitDetailScreen from './screens/HabitDetailScreen'
import { HabitProvider } from './context/HabitContext'
import './App.css'

export default function App() {
  return (
    <HabitProvider>
      <div className="app">
        <header className="app-header">
          <NavLink to="/" className="app-title">Habit Tracker</NavLink>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/add" element={<AddHabitScreen />} />
            <Route path="/habit/:id" element={<HabitDetailScreen />} />
          </Routes>
        </main>
      </div>
    </HabitProvider>
  )
}
