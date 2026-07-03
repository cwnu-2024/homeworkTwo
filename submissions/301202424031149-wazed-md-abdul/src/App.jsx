import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import CreateHabitPage from './pages/CreateHabitPage.jsx'
import HabitDetailPage from './pages/HabitDetailPage.jsx'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateHabitPage />} />
        <Route path="/habit/:id" element={<HabitDetailPage />} />
      </Routes>
    </div>
  )
}

export default App
