const STORAGE_KEY = 'health_logs'

let logs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')

function saveLogs() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
}

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function getTodayLogs() {
  const today = getToday()
  return logs.filter(log => log.date === today)
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'))
  document.getElementById('screen-' + id).classList.add('active')
}

function renderHome() {
  const todayLogs = getTodayLogs()
  const totalMinutes = todayLogs.reduce((sum, log) => sum + log.duration, 0)
  document.getElementById('today-total').textContent = totalMinutes + ' min'
  document.getElementById('today-count').textContent = todayLogs.length

  const list = document.getElementById('log-list')
  if (todayLogs.length === 0) {
    list.innerHTML = '<p class="empty-state">No logs yet today. Start your first entry!</p>'
    return
  }

  list.innerHTML = todayLogs
    .sort((a, b) => b.id - a.id)
    .map(log => `
      <div class="log-item" data-id="${log.id}">
        <div class="log-item-left">
          <span class="log-item-type">${log.type}</span>
          <span class="log-item-meta">${log.intensity} &middot; ${formatDate(log.date)}</span>
        </div>
        <div class="log-item-right">
          <div class="log-item-duration">${log.duration}m</div>
          <div class="log-item-intensity">${log.intensity}</div>
        </div>
      </div>
    `).join('')

  list.querySelectorAll('.log-item').forEach(el => {
    el.addEventListener('click', () => {
      const id = parseInt(el.dataset.id)
      showDetail(id)
    })
  })
}

function showDetail(id) {
  const log = logs.find(l => l.id === id)
  if (!log) return

  document.getElementById('detail-date').textContent = formatDate(log.date)
  document.getElementById('detail-type').textContent = log.type
  document.getElementById('detail-duration').textContent = log.duration + ' minutes'
  document.getElementById('detail-intensity').textContent = log.intensity
  document.getElementById('detail-notes').textContent = log.notes || '—'
  showScreen('summary')
}

function setTodayDate() {
  document.getElementById('log-date').value = getToday()
}

function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '')
  document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => el.classList.remove('error'))
}

function showError(id, message) {
  document.getElementById('error-' + id).textContent = message
  const input = document.getElementById('log-' + id)
  if (input) input.classList.add('error')
}

document.getElementById('btn-add-log').addEventListener('click', () => {
  setTodayDate()
  document.getElementById('health-form').reset()
  clearErrors()
  showScreen('form')
})

document.getElementById('btn-back-form').addEventListener('click', () => {
  renderHome()
  showScreen('home')
})

document.getElementById('btn-back-summary').addEventListener('click', () => {
  renderHome()
  showScreen('home')
})

document.getElementById('btn-home').addEventListener('click', () => {
  renderHome()
  showScreen('home')
})

document.getElementById('health-form').addEventListener('submit', (e) => {
  e.preventDefault()
  clearErrors()

  let valid = true

  const date = document.getElementById('log-date').value.trim()
  if (!date) {
    showError('date', 'Date is required.')
    valid = false
  }

  const type = document.getElementById('log-type').value
  if (!type) {
    showError('type', 'Please select an exercise type.')
    valid = false
  }

  const durationRaw = document.getElementById('log-duration').value.trim()
  const duration = parseInt(durationRaw, 10)
  if (!durationRaw || isNaN(duration)) {
    showError('duration', 'Duration is required.')
    valid = false
  } else if (duration < 1 || duration > 480) {
    showError('duration', 'Duration must be between 1 and 480 minutes.')
    valid = false
  }

  const intensityEl = document.querySelector('input[name="intensity"]:checked')
  if (!intensityEl) {
    showError('intensity', 'Please select an intensity level.')
    valid = false
  }

  if (!valid) return

  const notes = document.getElementById('log-notes').value.trim()

  const log = {
    id: Date.now(),
    date,
    type,
    duration,
    intensity: intensityEl.value,
    notes
  }

  logs.push(log)
  saveLogs()

  renderHome()
  showDetail(log.id)
})

renderHome()
showScreen('home')
