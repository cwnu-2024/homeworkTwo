import { useState } from 'react';

const ACTIVITY_TYPES = ['Running', 'Cycling', 'Swimming', 'Gym', 'Yoga', 'Other'];
const INTENSITIES = ['Low', 'Medium', 'High'];

function todayLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function validate(data) {
  const errors = {};
  const today = todayLocal();

  if (!data.activity_name.trim()) {
    errors.activity_name = 'Activity name is required.';
  } else if (data.activity_name.trim().length < 3) {
    errors.activity_name = 'Must be at least 3 characters.';
  }

  if (!data.activity_type) {
    errors.activity_type = 'Please select an activity type.';
  }

  if (!data.duration_minutes) {
    errors.duration_minutes = 'Duration is required.';
  } else if (parseInt(data.duration_minutes) < 1 || parseInt(data.duration_minutes) > 600) {
    errors.duration_minutes = 'Must be between 1 and 600 minutes.';
  }

  if (!data.workout_date) {
    errors.workout_date = 'Date is required.';
  } else if (data.workout_date > today) {
    errors.workout_date = 'Date cannot be in the future.';
  }

  if (!data.intensity) {
    errors.intensity = 'Please select an intensity level.';
  }

  return errors;
}

const inputBase =
  'w-full px-4 py-3 rounded-xl border text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition';
const inputNormal = `${inputBase} border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`;
const inputError = `${inputBase} border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-500 text-gray-900 dark:text-white`;

export default function WorkoutForm({ initialData, onSubmit, loading }) {
  const today = todayLocal();
  const [form, setForm] = useState(
    initialData || {
      activity_name: '',
      activity_type: '',
      duration_minutes: '',
      workout_date: today,
      intensity: '',
      notes: '',
    }
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Activity Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Activity Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="activity_name"
          value={form.activity_name}
          onChange={handleChange}
          placeholder="e.g. Morning Run"
          className={errors.activity_name ? inputError : inputNormal}
        />
        {errors.activity_name && (
          <p className="text-red-500 text-sm mt-1">{errors.activity_name}</p>
        )}
      </div>

      {/* Activity Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Activity Type <span className="text-red-500">*</span>
        </label>
        <select
          name="activity_type"
          value={form.activity_type}
          onChange={handleChange}
          className={errors.activity_type ? inputError : inputNormal}
        >
          <option value="">Select type…</option>
          {ACTIVITY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.activity_type && (
          <p className="text-red-500 text-sm mt-1">{errors.activity_type}</p>
        )}
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Duration (minutes) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="duration_minutes"
          value={form.duration_minutes}
          onChange={handleChange}
          min="1"
          max="600"
          placeholder="e.g. 30"
          className={errors.duration_minutes ? inputError : inputNormal}
        />
        {errors.duration_minutes && (
          <p className="text-red-500 text-sm mt-1">{errors.duration_minutes}</p>
        )}
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="workout_date"
          value={form.workout_date}
          onChange={handleChange}
          max={today}
          className={errors.workout_date ? inputError : inputNormal}
        />
        {errors.workout_date && (
          <p className="text-red-500 text-sm mt-1">{errors.workout_date}</p>
        )}
      </div>

      {/* Intensity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Intensity <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          {INTENSITIES.map((level) => (
            <label
              key={level}
              className={`flex-1 flex items-center justify-center py-3 rounded-xl border cursor-pointer transition select-none ${
                form.intensity === level
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <input
                type="radio"
                name="intensity"
                value={level}
                checked={form.intensity === level}
                onChange={handleChange}
                className="sr-only"
              />
              {level}
            </label>
          ))}
        </div>
        {errors.intensity && (
          <p className="text-red-500 text-sm mt-1">{errors.intensity}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (optional)</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          placeholder="How did it go?"
          className={`${inputNormal} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl text-base active:bg-blue-700 disabled:opacity-60 transition"
      >
        {loading ? 'Saving…' : 'Save Workout'}
      </button>
    </form>
  );
}
