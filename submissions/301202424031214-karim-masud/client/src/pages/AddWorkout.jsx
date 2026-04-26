import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import WorkoutForm from '../components/WorkoutForm';
import { ChevronLeft } from 'lucide-react';

export default function AddWorkout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/workouts', data);
      navigate('/history');
    } catch {
      setError('Failed to save workout. Please check the server connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 pt-6">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-gray-500 active:text-gray-800"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Log Workout</h1>
      </div>

      {error && (
        <div className="mb-5 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      <WorkoutForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
