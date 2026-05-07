import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import WorkoutForm from '../components/WorkoutForm';
import { ChevronLeft } from 'lucide-react';

export default function EditWorkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`/api/workouts/${id}`)
      .then((res) => {
        const w = res.data;
        setInitialData({
          activity_name: w.activity_name,
          activity_type: w.activity_type,
          duration_minutes: String(w.duration_minutes),
          workout_date: (w.workout_date || '').slice(0, 10),
          intensity: w.intensity,
          notes: w.notes || '',
        });
      })
      .catch(() => setError('Could not load workout data.'))
      .finally(() => setFetchLoading(false));
  }, [id]);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await axios.put(`/api/workouts/${id}`, data);
      navigate(`/workout/${id}`);
    } catch {
      setError('Failed to update workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900">
        Loading…
      </div>
    );
  }

  return (
    <div className="p-4 pt-6">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-gray-500 active:text-gray-800"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Edit Workout</h1>
      </div>

      {error && (
        <div className="mb-5 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      {initialData && (
        <WorkoutForm initialData={initialData} onSubmit={handleSubmit} loading={loading} />
      )}
    </div>
  );
}
