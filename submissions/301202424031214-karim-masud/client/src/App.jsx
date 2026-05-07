import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import History from './pages/History';
import AddWorkout from './pages/AddWorkout';
import EditWorkout from './pages/EditWorkout';
import Detail from './pages/Detail';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';

function ProtectedRoute({ children }) {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" replace />;
}

function AppLayout() {
  const { isAuth } = useAuth();
  return (
    <div className="max-w-2xl mx-auto min-h-screen relative" style={{ backgroundColor: 'var(--pg)', transition: 'background-color 0.2s ease' }}>
      <Outlet />
      {isAuth && <BottomNav />}
    </div>
  );
}

function AppShell() {
  const { dark } = useTheme();
  return (
    <BrowserRouter>
      <div className={`${dark ? 'dark' : ''} min-h-screen`}>
        <Routes>
          {/* Auth routes — full-screen, no max-w constraint */}
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* App routes — constrained shell + bottom nav */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/add" element={<ProtectedRoute><AddWorkout /></ProtectedRoute>} />
            <Route path="/edit/:id" element={<ProtectedRoute><EditWorkout /></ProtectedRoute>} />
            <Route path="/workout/:id" element={<ProtectedRoute><Detail /></ProtectedRoute>} />
            <Route path="/stats" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ThemeProvider>
  );
}
