<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <title>HabitFlow – Daily Habit Tracker</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --primary: #6C63FF;
      --primary-dark: #574fd6;
      --accent: #FF6584;
      --success: #43D9AD;
      --warning: #FFB547;
      --bg: #F4F3FF;
      --card: #FFFFFF;
      --text: #1a1a2e;
      --muted: #6B7280;
      --border: #E5E7EB;
      --error: #EF4444;
      --radius: 16px;
      --shadow: 0 4px 24px rgba(108,99,255,0.10);
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    .app {
      width: 100%;
      max-width: 430px;
      min-height: 100vh;
      background: var(--bg);
      position: relative;
      overflow: hidden;
    }

    /* ── SCREEN SYSTEM ── */
    .screen {
      display: none;
      flex-direction: column;
      min-height: 100vh;
      animation: fadeIn .22s ease;
    }
    .screen.active { display: flex; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    /* ── NAV BAR ── */
    .nav-bar {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      background: var(--card);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .nav-bar .back-btn {
      background: none;
      border: none;
      font-size: 22px;
      cursor: pointer;
      margin-right: 12px;
      color: var(--primary);
      line-height: 1;
    }
    .nav-bar h2 { font-size: 18px; font-weight: 700; }
    .nav-bar .nav-action {
      margin-left: auto;
      background: none;
      border: none;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary);
      cursor: pointer;
    }

    /* ── SCROLL BODY ── */
    .scroll-body {
      flex: 1;
      overflow-y: auto;
      padding: 20px 20px 40px;
    }

    /* ── HOME SCREEN ── */
    .home-header {
      background: linear-gradient(135deg, var(--primary) 0%, #a78bfa 100%);
      color: white;
      padding: 40px 24px 32px;
      border-radius: 0 0 32px 32px;
    }
    .home-header .greeting { font-size: 14px; opacity: .8; margin-bottom: 4px; }
    .home-header h1 { font-size: 26px; font-weight: 800; margin-bottom: 8px; }
    .home-header .subtitle { font-size: 13px; opacity: .75; }

    .stats-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
      margin: 20px 20px 0;
    }
    .stat-card {
      background: var(--card);
      border-radius: var(--radius);
      padding: 14px 10px;
      text-align: center;
      box-shadow: var(--shadow);
    }
    .stat-card .stat-num { font-size: 24px; font-weight: 800; color: var(--primary); }
    .stat-card .stat-label { font-size: 11px; color: var(--muted); margin-top: 2px; }

    .section-title {
      font-size: 16px;
      font-weight: 700;
      margin: 24px 20px 12px;
    }

    .habit-list { padding: 0 20px; display: flex; flex-direction: column; gap: 12px; }

    .habit-card {
      background: var(--card);
      border-radius: var(--radius);
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 14px;
      box-shadow: var(--shadow);
      cursor: pointer;
      transition: transform .15s;
    }
    .habit-card:active { transform: scale(.98); }
    .habit-icon {
      width: 46px; height: 46px;
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }
    .habit-info { flex: 1; min-width: 0; }
    .habit-name { font-size: 15px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .habit-meta { font-size: 12px; color: var(--muted); margin-top: 2px; }
    .habit-streak { font-size: 12px; font-weight: 700; color: var(--warning); }

    .check-btn {
      width: 34px; height: 34px;
      border-radius: 50%;
      border: 2.5px solid var(--border);
      background: none;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
      transition: all .2s;
    }
    .check-btn.done { background: var(--success); border-color: var(--success); }

    .fab {
      position: fixed;
      bottom: 28px;
      right: calc(50% - 215px + 20px);
      width: 58px; height: 58px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white;
      border: none;
      font-size: 28px;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(108,99,255,.4);
      display: flex; align-items: center; justify-content: center;
      transition: transform .15s;
    }
    .fab:active { transform: scale(.93); }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--muted);
    }
    .empty-state .empty-icon { font-size: 48px; margin-bottom: 12px; }
    .empty-state p { font-size: 15px; }

    /* ── FORM SCREEN ── */
    .form-section { margin-bottom: 20px; }
    .form-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: .5px;
      margin-bottom: 8px;
      display: block;
    }
    .form-input, .form-select, .form-textarea {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid var(--border);
      border-radius: 12px;
      font-size: 16px;
      background: var(--card);
      color: var(--text);
      outline: none;
      transition: border-color .2s;
      font-family: inherit;
    }
    .form-input:focus, .form-select:focus, .form-textarea:focus {
      border-color: var(--primary);
    }
    .form-input.error, .form-select.error, .form-textarea.error {
      border-color: var(--error);
    }
    .form-textarea { resize: none; min-height: 90px; }
    .error-msg {
      color: var(--error);
      font-size: 12px;
      margin-top: 5px;
      display: none;
    }
    .error-msg.visible { display: block; }

    .emoji-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 8px;
    }
    .emoji-btn {
      aspect-ratio: 1;
      border-radius: 12px;
      border: 2px solid var(--border);
      background: var(--card);
      font-size: 22px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all .15s;
    }
    .emoji-btn.selected { border-color: var(--primary); background: #ede9fe; }

    .color-grid {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .color-btn {
      width: 36px; height: 36px;
      border-radius: 50%;
      border: 3px solid transparent;
      cursor: pointer;
      transition: transform .15s;
    }
    .color-btn.selected { border-color: var(--text); transform: scale(1.15); }

    .freq-tabs {
      display: flex;
      background: var(--border);
      border-radius: 10px;
      padding: 3px;
      gap: 3px;
    }
    .freq-tab {
      flex: 1;
      padding: 9px 6px;
      border: none;
      border-radius: 8px;
      background: none;
      font-size: 13px;
      font-weight: 600;
      color: var(--muted);
      cursor: pointer;
      transition: all .2s;
    }
    .freq-tab.active { background: var(--card); color: var(--primary); box-shadow: 0 2px 6px rgba(0,0,0,.08); }

    .submit-btn {
      width: 100%;
      padding: 16px;
      border: none;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 8px;
      transition: opacity .2s, transform .15s;
    }
    .submit-btn:active { opacity: .9; transform: scale(.98); }

    /* ── DETAIL SCREEN ── */
    .detail-hero {
      padding: 32px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .detail-hero-icon {
      width: 90px; height: 90px;
      border-radius: 28px;
      display: flex; align-items: center; justify-content: center;
      font-size: 44px;
      margin-bottom: 16px;
    }
    .detail-hero h2 { font-size: 24px; font-weight: 800; margin-bottom: 6px; }
    .detail-hero .detail-cat { font-size: 13px; color: var(--muted); }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
    }
    .detail-tile {
      background: var(--card);
      border-radius: var(--radius);
      padding: 16px;
      box-shadow: var(--shadow);
    }
    .detail-tile .tile-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .5px; margin-bottom: 4px; }
    .detail-tile .tile-val { font-size: 20px; font-weight: 800; }

    .detail-note-card {
      background: var(--card);
      border-radius: var(--radius);
      padding: 18px;
      box-shadow: var(--shadow);
      margin-bottom: 20px;
    }
    .detail-note-card h4 { font-size: 13px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: .5px; margin-bottom: 8px; }
    .detail-note-card p { font-size: 15px; line-height: 1.6; }

    .detail-actions { display: flex; gap: 12px; }
    .action-btn {
      flex: 1;
      padding: 14px;
      border-radius: 12px;
      border: none;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: opacity .2s;
    }
    .action-btn:active { opacity: .85; }
    .action-btn.primary { background: var(--primary); color: white; }
    .action-btn.danger { background: #FEE2E2; color: var(--error); }

    /* ── TOAST ── */
    .toast {
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: var(--text);
      color: white;
      padding: 12px 20px;
      border-radius: 30px;
      font-size: 14px;
      font-weight: 600;
      opacity: 0;
      transition: all .3s;
      z-index: 999;
      white-space: nowrap;
    }
    .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  </style>
</head>
<body>
<div class="app">

  <!-- ════════════════════════════ HOME SCREEN ════════════════════════════ -->
  <div class="screen active" id="screen-home">
    <div class="home-header">
      <div class="greeting">Good day 👋</div>
      <h1>HabitFlow</h1>
      <div class="subtitle">Track your daily habits &amp; build streaks</div>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-num" id="stat-total">0</div>
        <div class="stat-label">Habits</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" id="stat-done">0</div>
        <div class="stat-label">Done Today</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" id="stat-streak">0</div>
        <div class="stat-label">Best Streak</div>
      </div>
    </div>

    <div class="section-title">Today's Habits</div>
    <div class="habit-list" id="habit-list">
      <div class="empty-state" id="empty-state">
        <div class="empty-icon">🌱</div>
        <p>No habits yet.<br>Tap <strong>+</strong> to add your first one!</p>
      </div>
    </div>

    <button class="fab" onclick="goTo('screen-form')">+</button>
  </div>

  <!-- ════════════════════════════ FORM SCREEN ════════════════════════════ -->
  <div class="screen" id="screen-form">
    <div class="nav-bar">
      <button class="back-btn" onclick="goTo('screen-home')">‹</button>
      <h2>New Habit</h2>
    </div>
    <div class="scroll-body">

      <!-- Habit Name -->
      <div class="form-section">
        <label class="form-label" for="f-name">Habit Name *</label>
        <input class="form-input" id="f-name" type="text" placeholder="e.g. Morning Run" maxlength="40" />
        <div class="error-msg" id="e-name">Name is required (at least 3 characters).</div>
      </div>

      <!-- Category -->
      <div class="form-section">
        <label class="form-label" for="f-category">Category *</label>
        <select class="form-select" id="f-category">
          <option value="">— Select a category —</option>
          <option value="Health">🏃 Health &amp; Fitness</option>
          <option value="Mind">🧘 Mindfulness</option>
          <option value="Study">📚 Study &amp; Learning</option>
          <option value="Finance">💰 Finance</option>
          <option value="Social">🤝 Social</option>
          <option value="Creative">🎨 Creative</option>
          <option value="Other">⭐ Other</option>
        </select>
        <div class="error-msg" id="e-category">Please select a category.</div>
      </div>

      <!-- Goal (number) -->
      <div class="form-section">
        <label class="form-label" for="f-goal">Daily Goal (minutes) *</label>
        <input class="form-input" id="f-goal" type="number" placeholder="e.g. 30" min="1" max="1440" />
        <div class="error-msg" id="e-goal">Enter a number between 1 and 1440.</div>
      </div>

      <!-- Start Date -->
      <div class="form-section">
        <label class="form-label" for="f-date">Start Date *</label>
        <input class="form-input" id="f-date" type="date" />
        <div class="error-msg" id="e-date">Start date cannot be in the past.</div>
      </div>

      <!-- Frequency -->
      <div class="form-section">
        <label class="form-label">Frequency</label>
        <div class="freq-tabs">
          <button class="freq-tab active" data-freq="Daily" onclick="selectFreq(this)">Daily</button>
          <button class="freq-tab" data-freq="Weekdays" onclick="selectFreq(this)">Weekdays</button>
          <button class="freq-tab" data-freq="Weekends" onclick="selectFreq(this)">Weekends</button>
          <button class="freq-tab" data-freq="Custom" onclick="selectFreq(this)">Custom</button>
        </div>
      </div>

      <!-- Reminder toggle -->
      <div class="form-section" style="display:flex;align-items:center;justify-content:space-between;">
        <div>
          <label class="form-label" style="margin:0">Reminder</label>
          <div style="font-size:13px;color:var(--muted);margin-top:2px">Get a daily push reminder</div>
        </div>
        <label style="position:relative;display:inline-block;width:48px;height:28px">
          <input type="checkbox" id="f-reminder" style="opacity:0;width:0;height:0">
          <span style="position:absolute;cursor:pointer;inset:0;background:#ccc;border-radius:34px;transition:.3s" id="toggle-track"></span>
          <span style="position:absolute;content:'';height:22px;width:22px;left:3px;bottom:3px;background:white;border-radius:50%;transition:.3s" id="toggle-thumb"></span>
        </label>
      </div>

      <!-- Emoji Picker -->
      <div class="form-section">
        <label class="form-label">Icon</label>
        <div class="emoji-grid" id="emoji-grid">
          <!-- filled by JS -->
        </div>
      </div>

      <!-- Color Picker -->
      <div class="form-section">
        <label class="form-label">Color</label>
        <div class="color-grid" id="color-grid"></div>
      </div>

      <!-- Note -->
      <div class="form-section">
        <label class="form-label" for="f-note">Notes (optional)</label>
        <textarea class="form-textarea" id="f-note" placeholder="Why is this habit important to you?"></textarea>
      </div>

      <button class="submit-btn" onclick="submitForm()">Save Habit</button>
    </div>
  </div>

  <!-- ════════════════════════════ DETAIL SCREEN ════════════════════════════ -->
  <div class="screen" id="screen-detail">
    <div class="nav-bar">
      <button class="back-btn" onclick="goTo('screen-home')">‹</button>
      <h2>Habit Detail</h2>
    </div>
    <div class="scroll-body">
      <div class="detail-hero">
        <div class="detail-hero-icon" id="d-icon-box">
          <span id="d-icon">🏃</span>
        </div>
        <h2 id="d-name">—</h2>
        <div class="detail-cat" id="d-category">—</div>
      </div>

      <div class="detail-grid">
        <div class="detail-tile">
          <div class="tile-label">Daily Goal</div>
          <div class="tile-val" id="d-goal">—</div>
        </div>
        <div class="detail-tile">
          <div class="tile-label">Frequency</div>
          <div class="tile-val" id="d-freq">—</div>
        </div>
        <div class="detail-tile">
          <div class="tile-label">Start Date</div>
          <div class="tile-val" id="d-date" style="font-size:15px">—</div>
        </div>
        <div class="detail-tile">
          <div class="tile-label">Reminder</div>
          <div class="tile-val" id="d-reminder">—</div>
        </div>
        <div class="detail-tile">
          <div class="tile-label">Current Streak</div>
          <div class="tile-val" id="d-streak">—</div>
        </div>
        <div class="detail-tile">
          <div class="tile-label">Status</div>
          <div class="tile-val" id="d-status">—</div>
        </div>
      </div>

      <div class="detail-note-card" id="d-note-card">
        <h4>Notes</h4>
        <p id="d-note">—</p>
      </div>

      <div class="detail-actions">
        <button class="action-btn primary" id="d-check-btn" onclick="toggleDetailCheck()">✓ Mark Done</button>
        <button class="action-btn danger" onclick="deleteHabit()">🗑 Delete</button>
      </div>
    </div>
  </div>

  <div class="toast" id="toast"></div>
</div>

<script>
// ──────────────────────────────────────────────────────────────
// State
// ──────────────────────────────────────────────────────────────
let habits = JSON.parse(localStorage.getItem('hf_habits') || '[]');
let selectedEmoji = '🏃';
let selectedColor = '#6C63FF';
let selectedFreq  = 'Daily';
let currentHabitId = null;

const EMOJIS = ['🏃','🧘','📚','💧','🥗','💪','🎯','✍️','🎨','🎵','💰','😴','🌿','🤝','🧠','⭐'];
const COLORS = ['#6C63FF','#FF6584','#43D9AD','#FFB547','#60A5FA','#F472B6','#34D399','#FBBF24','#A78BFA','#FB923C'];

// ──────────────────────────────────────────────────────────────
// Screen Navigation
// ──────────────────────────────────────────────────────────────
function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
  if (id === 'screen-home') renderHome();
}

// ──────────────────────────────────────────────────────────────
// Build pickers on load
// ──────────────────────────────────────────────────────────────
function buildPickers() {
  const eg = document.getElementById('emoji-grid');
  eg.innerHTML = '';
  EMOJIS.forEach(e => {
    const b = document.createElement('button');
    b.className = 'emoji-btn' + (e === selectedEmoji ? ' selected' : '');
    b.textContent = e;
    b.onclick = () => { selectedEmoji = e; document.querySelectorAll('.emoji-btn').forEach(x=>x.classList.remove('selected')); b.classList.add('selected'); };
    eg.appendChild(b);
  });

  const cg = document.getElementById('color-grid');
  cg.innerHTML = '';
  COLORS.forEach(c => {
    const b = document.createElement('button');
    b.className = 'color-btn' + (c === selectedColor ? ' selected' : '');
    b.style.background = c;
    b.onclick = () => { selectedColor = c; document.querySelectorAll('.color-btn').forEach(x=>x.classList.remove('selected')); b.classList.add('selected'); };
    cg.appendChild(b);
  });

  // Toggle styling
  const cb = document.getElementById('f-reminder');
  const track = document.getElementById('toggle-track');
  const thumb = document.getElementById('toggle-thumb');
  cb.onchange = () => {
    track.style.background = cb.checked ? '#6C63FF' : '#ccc';
    thumb.style.transform = cb.checked ? 'translateX(20px)' : 'translateX(0)';
  };

  // Default date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('f-date').value = today;
  document.getElementById('f-date').min = today;
}

// ──────────────────────────────────────────────────────────────
// Frequency tabs
// ──────────────────────────────────────────────────────────────
function selectFreq(btn) {
  document.querySelectorAll('.freq-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  selectedFreq = btn.dataset.freq;
}

// ──────────────────────────────────────────────────────────────
// Validation & Submit
// ──────────────────────────────────────────────────────────────
function setError(id, errId, show) {
  const input = document.getElementById(id);
  const err   = document.getElementById(errId);
  if (show) { input.classList.add('error'); err.classList.add('visible'); }
  else       { input.classList.remove('error'); err.classList.remove('visible'); }
}

function submitForm() {
  let valid = true;
  const name  = document.getElementById('f-name').value.trim();
  const cat   = document.getElementById('f-category').value;
  const goal  = parseInt(document.getElementById('f-goal').value);
  const date  = document.getElementById('f-date').value;
  const note  = document.getElementById('f-note').value.trim();
  const reminder = document.getElementById('f-reminder').checked;
  const today = new Date().toISOString().split('T')[0];

  if (!name || name.length < 3) { setError('f-name','e-name',true); valid=false; } else setError('f-name','e-name',false);
  if (!cat)                      { setError('f-category','e-category',true); valid=false; } else setError('f-category','e-category',false);
  if (!goal || goal<1||goal>1440){ setError('f-goal','e-goal',true); valid=false; } else setError('f-goal','e-goal',false);
  if (!date || date < today)     { setError('f-date','e-date',true); valid=false; } else setError('f-date','e-date',false);

  if (!valid) return;

  const habit = {
    id: Date.now(),
    name, cat, goal, date, note, reminder,
    emoji: selectedEmoji,
    color: selectedColor,
    freq: selectedFreq,
    streak: 0,
    doneToday: false,
    createdAt: new Date().toLocaleDateString()
  };

  habits.push(habit);
  save();
  resetForm();
  showToast('🎉 Habit saved!');
  setTimeout(() => goTo('screen-home'), 400);
}

function resetForm() {
  ['f-name','f-goal','f-note'].forEach(id => document.getElementById(id).value='');
  document.getElementById('f-category').value='';
  document.getElementById('f-reminder').checked=false;
  document.getElementById('toggle-track').style.background='#ccc';
  document.getElementById('toggle-thumb').style.transform='translateX(0)';
  selectedEmoji='🏃'; selectedColor='#6C63FF'; selectedFreq='Daily';
  document.getElementById('f-date').value=new Date().toISOString().split('T')[0];
  buildPickers();
  document.querySelectorAll('.freq-tab').forEach((t,i)=>t.classList.toggle('active',i===0));
}

// ──────────────────────────────────────────────────────────────
// Home render
// ──────────────────────────────────────────────────────────────
function renderHome() {
  const list  = document.getElementById('habit-list');
  const empty = document.getElementById('empty-state');
  const done  = habits.filter(h=>h.doneToday).length;
  const best  = habits.reduce((m,h)=>Math.max(m,h.streak),0);

  document.getElementById('stat-total').textContent  = habits.length;
  document.getElementById('stat-done').textContent   = done;
  document.getElementById('stat-streak').textContent = best;

  // remove old cards
  list.querySelectorAll('.habit-card').forEach(c=>c.remove());
  empty.style.display = habits.length ? 'none' : 'block';

  habits.forEach(h => {
    const card = document.createElement('div');
    card.className = 'habit-card';
    card.innerHTML = `
      <div class="habit-icon" style="background:${h.color}22">${h.emoji}</div>
      <div class="habit-info">
        <div class="habit-name">${h.name}</div>
        <div class="habit-meta">${h.cat} · ${h.freq} · ${h.goal} min</div>
        ${h.streak>0?`<div class="habit-streak">🔥 ${h.streak} day streak</div>`:''}
      </div>
      <button class="check-btn ${h.doneToday?'done':''}" onclick="toggleCheck(event,${h.id})">
        ${h.doneToday?'✓':''}
      </button>
    `;
    card.addEventListener('click', (e) => {
      if(e.target.closest('.check-btn')) return;
      openDetail(h.id);
    });
    list.appendChild(card);
  });
}

// ──────────────────────────────────────────────────────────────
// Toggle done on home
// ──────────────────────────────────────────────────────────────
function toggleCheck(e, id) {
  e.stopPropagation();
  const h = habits.find(x=>x.id===id);
  if(!h) return;
  h.doneToday = !h.doneToday;
  if(h.doneToday) { h.streak++; showToast(`✅ "${h.name}" done!`); }
  else { h.streak = Math.max(0,h.streak-1); }
  save();
  renderHome();
}

// ──────────────────────────────────────────────────────────────
// Detail
// ──────────────────────────────────────────────────────────────
function openDetail(id) {
  currentHabitId = id;
  const h = habits.find(x=>x.id===id);
  if(!h) return;

  document.getElementById('d-icon').textContent  = h.emoji;
  document.getElementById('d-icon-box').style.background = h.color+'22';
  document.getElementById('d-name').textContent  = h.name;
  document.getElementById('d-category').textContent = h.cat + ' · Created ' + h.createdAt;
  document.getElementById('d-goal').textContent  = h.goal + ' min';
  document.getElementById('d-freq').textContent  = h.freq;
  document.getElementById('d-date').textContent  = h.date;
  document.getElementById('d-reminder').textContent = h.reminder ? '🔔 On' : '🔕 Off';
  document.getElementById('d-streak').textContent = h.streak > 0 ? '🔥 ' + h.streak : '—';
  document.getElementById('d-status').textContent = h.doneToday ? '✅ Done' : '⏳ Pending';

  const noteCard = document.getElementById('d-note-card');
  if(h.note) { document.getElementById('d-note').textContent = h.note; noteCard.style.display='block'; }
  else { noteCard.style.display='none'; }

  const btn = document.getElementById('d-check-btn');
  btn.textContent = h.doneToday ? '↩ Unmark' : '✓ Mark Done';
  btn.style.background = h.doneToday ? '#43D9AD' : '#6C63FF';

  goTo('screen-detail');
}

function toggleDetailCheck() {
  const h = habits.find(x=>x.id===currentHabitId);
  if(!h) return;
  h.doneToday = !h.doneToday;
  h.streak = h.doneToday ? h.streak+1 : Math.max(0,h.streak-1);
  save();
  openDetail(h.id); // re-render detail
}

function deleteHabit() {
  if(!confirm('Delete this habit?')) return;
  habits = habits.filter(x=>x.id!==currentHabitId);
  save();
  showToast('🗑 Habit deleted');
  goTo('screen-home');
}

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────
function save() { localStorage.setItem('hf_habits', JSON.stringify(habits)); }

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2400);
}

// ──────────────────────────────────────────────────────────────
// Init
// ──────────────────────────────────────────────────────────────
buildPickers();
renderHome();
</script>
</body>
</html>
