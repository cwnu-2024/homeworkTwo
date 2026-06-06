const STORAGE_KEY = 'expense_recorder_data';

function getExpenses() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveExpenses(expenses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function navigateTo(screen) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + screen).classList.add('active');

  const backBtn = document.getElementById('backBtn');
  const title = document.getElementById('screenTitle');

  backBtn.style.display = screen === 'home' ? 'none' : 'block';

  const titles = {
    home: 'Expense Recorder',
    add: 'Add Expense',
    list: 'All Expenses',
    detail: 'Expense Detail'
  };
  title.textContent = titles[screen] || 'Expense Recorder';

  if (screen === 'home') updateHome();
  if (screen === 'list') renderList();
}

function goBack() {
  const active = document.querySelector('.screen.active');
  if (active) {
    if (active.id === 'screen-add' || active.id === 'screen-list') {
      navigateTo('home');
    } else if (active.id === 'screen-detail') {
      navigateTo('list');
    }
  }
}

function updateHome() {
  const expenses = getExpenses();
  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  document.getElementById('totalExpenses').textContent = '$' + total.toFixed(2);
  document.getElementById('entryCount').textContent = expenses.length;
}

function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
  document.querySelectorAll('.form-group input, .form-group select')
    .forEach(el => el.classList.remove('error'));
}

function showError(fieldId, msg) {
  const el = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + 'Error');
  if (el) el.classList.add('error');
  if (errorEl) errorEl.textContent = msg;
}

// Form submission
document.getElementById('expenseForm').addEventListener('submit', function(e) {
  e.preventDefault();
  clearErrors();

  const title = document.getElementById('title').value.trim();
  const amount = document.getElementById('amount').value;
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;
  const description = document.getElementById('description').value.trim();

  let valid = true;

  if (!title) {
    showError('title', 'Title is required.');
    valid = false;
  } else if (title.length < 2) {
    showError('title', 'Title must be at least 2 characters.');
    valid = false;
  }

  if (!amount) {
    showError('amount', 'Amount is required.');
    valid = false;
  } else if (isNaN(amount) || parseFloat(amount) <= 0) {
    showError('amount', 'Amount must be greater than $0.');
    valid = false;
  }

  if (!category) {
    showError('category', 'Please select a category.');
    valid = false;
  }

  if (!date) {
    showError('date', 'Please select a date.');
    valid = false;
  } else {
    const selected = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (selected > today) {
      showError('date', 'Date cannot be in the future.');
      valid = false;
    }
  }

  if (!valid) return;

  const expenses = getExpenses();
  expenses.push({
    id: Date.now(),
    title,
    amount: parseFloat(amount).toFixed(2),
    category,
    date,
    description
  });
  saveExpenses(expenses);

  document.getElementById('expenseForm').reset();
  document.getElementById('date').value = new Date().toISOString().split('T')[0];
  navigateTo('home');
});

function renderList() {
  const container = document.getElementById('expenseList');
  const expenses = getExpenses();

  if (expenses.length === 0) {
    container.innerHTML = '<p class="empty-msg">No expenses yet. Add your first one!</p>';
    return;
  }

  container.innerHTML = expenses.slice().reverse().map(exp => `
    <div class="expense-item" onclick="showDetail(${exp.id})">
      <div class="expense-item-header">
        <span class="expense-item-title">${escapeHtml(exp.title)}</span>
        <span class="expense-item-amount">$${exp.amount}</span>
      </div>
      <div class="expense-item-meta">
        ${escapeHtml(exp.category)} &middot; ${formatDate(exp.date)}
      </div>
    </div>
  `).join('');
}

function showDetail(id) {
  const expenses = getExpenses();
  const exp = expenses.find(e => e.id === id);
  if (!exp) {
    navigateTo('list');
    return;
  }

  navigateTo('detail');
  const container = document.getElementById('expenseDetail');
  container.innerHTML = `
    <div class="detail-card">
      <div class="detail-field">
        <div class="detail-label">Amount</div>
        <div class="detail-value amount">$${exp.amount}</div>
      </div>
      <div class="detail-field">
        <div class="detail-label">Title</div>
        <div class="detail-value">${escapeHtml(exp.title)}</div>
      </div>
      <div class="detail-field">
        <div class="detail-label">Category</div>
        <div class="detail-value">${escapeHtml(exp.category)}</div>
      </div>
      <div class="detail-field">
        <div class="detail-label">Date</div>
        <div class="detail-value">${formatDate(exp.date)}</div>
      </div>
      ${exp.description ? `
      <div class="detail-field">
        <div class="detail-label">Description</div>
        <div class="detail-value">${escapeHtml(exp.description)}</div>
      </div>` : ''}
      <button class="delete-btn" onclick="deleteExpense(${exp.id})">Delete Expense</button>
    </div>
  `;
  window.scrollTo(0, 0);
}

function deleteExpense(id) {
  if (!confirm('Delete this expense?')) return;
  let expenses = getExpenses();
  expenses = expenses.filter(e => e.id !== id);
  saveExpenses(expenses);
  navigateTo('list');
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Set default date to today
document.addEventListener('DOMContentLoaded', function() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date').value = today;
  updateHome();
});
