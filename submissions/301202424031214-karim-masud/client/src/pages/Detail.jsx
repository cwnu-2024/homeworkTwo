import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Edit2, Trash2, Clock, Calendar, Zap, FileText } from 'lucide-react';

const typeColors = {
  Running: 'bg-blue-100 text-blue-700',
  Cycling: 'bg-yellow-100 text-yellow-700',
  Swimming: 'bg-cyan-100 text-cyan-700',
  Gym: 'bg-purple-100 text-purple-700',
  Yoga: 'bg-green-100 text-green-700',
  Other: 'bg-gray-100 text-gray-700',
};

const intensityConfig = {
  Low: { emoji: '🟢', color: 'text-green-600' },
  Medium: { emoji: '🟡', color: 'text-yellow-600' },
  High: { emoji: '🔴', color: 'text-red-600' },
};

function formatFullDate(dateStr) {
  const d = new Date(dateStr.slice(0, 10) + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/workouts/${id}`)
      .then((res) => setWorkout(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/api/workouts/${id}`);
      navigate('/history', { replace: true });
    } catch {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900">Loading…</div>
    );
  }

  if (!workout) {
    return (
      <div className="p-4 pt-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 dark:text-gray-400">
          <ChevronLeft size={24} />
        </button>
        <p className="text-red-500 mt-4">Workout not found.</p>
      </div>
    );
  }

  const color = typeColors[workout.activity_type] || typeColors.Other;
  const intensity = intensityConfig[workout.intensity] || {};

  return (
    <div className="p-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-gray-500 active:text-gray-800"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-1">
          <Link
            to={`/edit/${id}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-medium"
          >
            <Edit2 size={15} />
            Edit
          </Link>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-500 text-sm font-medium"
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${color}`}>
          {workout.activity_type}
        </span>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{workout.activity_name}</h1>
      </div>

      {/* Detail Rows */}
      <div className="space-y-3">
        <DetailRow
          icon={<Clock size={20} className="text-blue-500" />}
          label="Duration"
          value={`${workout.duration_minutes} minutes`}
        />
        <DetailRow
          icon={<Calendar size={20} className="text-purple-500" />}
          label="Date"
          value={formatFullDate(workout.workout_date)}
        />
        <DetailRow
          icon={<Zap size={20} className="text-orange-400" />}
          label="Intensity"
          value={
            <span className={`font-semibold ${intensity.color}`}>
              {intensity.emoji} {workout.intensity}
            </span>
          }
        />
        {workout.notes && (
          <DetailRow
            icon={<FileText size={20} className="text-gray-400" />}
            label="Notes"
            value={workout.notes}
          />
        )}
      </div>

      {/* Logged on */}
      <p className="text-xs text-gray-400 dark:text-gray-600 mt-6 text-center">
        Logged on {new Date(workout.created_at).toLocaleString()}
      </p>

      {/* Delete Confirmation Bottom Sheet */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl p-6 w-full max-w-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Delete Workout?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              "{workout.activity_name}" will be permanently deleted. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium active:bg-gray-50 dark:active:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-medium disabled:opacity-60 active:bg-red-700"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700/50 rounded-xl p-4 shadow-sm dark:shadow-none">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <div className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{label}</div>
        <div className="text-gray-800 dark:text-gray-200 text-base">{value}</div>
      </div>
    </div>
  );
}
