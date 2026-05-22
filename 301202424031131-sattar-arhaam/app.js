const STORAGE_KEY = "spendwise-expenses";
const LAST_SAVED_KEY = "spendwise-last-saved";

const screens = {
  home: document.getElementById("homeScreen"),
  add: document.getElementById("addScreen"),
  summary: document.getElementById("summaryScreen")
};

const navButtons = document.querySelectorAll("[data-go]");
const expenseForm = document.getElementById("expenseForm");
const formSuccess = document.getElementById("formSuccess");
const clearAllButton = document.getElementById("clearAllButton");
const resetFormButton = document.getElementById("resetFormButton");

let expenses = loadExpenses();
let lastSavedId = localStorage.getItem(LAST_SAVED_KEY);

// Load saved expenses from the browser. If the saved data is broken, start safely with an empty list.
function loadExpenses() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveExpenses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) {
    return "No date";
  }

  return new Date(value + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function todayString() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function createExpenseId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `expense-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function totalSpent() {
  return expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
}

function navigate(screenName) {
  const safeScreen = screens[screenName] ? screenName : "home";

  Object.entries(screens).forEach(([name, screen]) => {
    screen.classList.toggle("active", name === safeScreen);
  });

  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.go === safeScreen);
  });

  window.location.hash = safeScreen;
  renderAll();
}

function renderAll() {
  const total = formatCurrency(totalSpent());
  document.getElementById("headerTotal").textContent = total;
  document.getElementById("homeTotal").textContent = total;
  document.getElementById("expenseCount").textContent = expenses.length;
  renderRecentExpenses();
  renderSummary();
}

function renderRecentExpenses() {
  const container = document.getElementById("recentExpenses");

  if (expenses.length === 0) {
    container.innerHTML = '<p class="empty-state">No expenses yet. Add your first expense to begin.</p>';
    return;
  }

  container.innerHTML = expenses.slice(0, 3).map(renderExpenseItem).join("");
}

function renderExpenseItem(expense) {
  const note = expense.note ? `<p class="expense-meta">${escapeHtml(expense.note)}</p>` : "";
  const reimbursable = expense.reimbursable ? " | Reimbursable" : "";

  return `
    <article class="expense-item">
      <div>
        <p class="expense-title">${escapeHtml(expense.title)}</p>
        <p class="expense-meta">${formatDate(expense.date)}${reimbursable}</p>
        ${note}
        <span class="category-tag">${escapeHtml(expense.category)}</span>
      </div>
      <strong class="expense-amount">${formatCurrency(expense.amount)}</strong>
    </article>
  `;
}

function renderSummary() {
  const lastExpensePanel = document.getElementById("lastExpensePanel");
  const summaryList = document.getElementById("summaryList");
  const summaryCount = document.getElementById("summaryCount");
  const lastExpense = expenses.find((expense) => expense.id === lastSavedId) || expenses[0];

  summaryCount.textContent = `${expenses.length} ${expenses.length === 1 ? "item" : "items"}`;

  if (!lastExpense) {
    lastExpensePanel.innerHTML = `
      <h3 class="summary-title">No saved expense yet</h3>
      <p class="empty-state">Use the Add screen to save an expense. The submitted data will appear here.</p>
    `;
    summaryList.innerHTML = '<p class="empty-state">Nothing to show yet.</p>';
    return;
  }

  lastExpensePanel.innerHTML = `
    <h3 class="summary-title">Last Saved Expense</h3>
    <p class="expense-title">${escapeHtml(lastExpense.title)}</p>
    <div class="detail-grid">
      <p class="detail-line"><span>Amount</span><strong>${formatCurrency(lastExpense.amount)}</strong></p>
      <p class="detail-line"><span>Date</span><strong>${formatDate(lastExpense.date)}</strong></p>
      <p class="detail-line"><span>Category</span><strong>${escapeHtml(lastExpense.category)}</strong></p>
      <p class="detail-line"><span>Reimbursable</span><strong>${lastExpense.reimbursable ? "Yes" : "No"}</strong></p>
      <p class="detail-line"><span>Note</span><strong>${escapeHtml(lastExpense.note || "No note")}</strong></p>
    </div>
  `;

  summaryList.innerHTML = expenses.map(renderExpenseItem).join("");
}

function setError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}Error`);
  field.classList.toggle("input-error", Boolean(message));
  error.textContent = message;
}

function clearErrors() {
  ["title", "amount", "date", "category", "note"].forEach((fieldId) => setError(fieldId, ""));
  formSuccess.textContent = "";
}

function validateForm(formData) {
  const title = formData.get("title").trim();
  const amount = Number(formData.get("amount"));
  const date = formData.get("date");
  const category = formData.get("category");
  const note = formData.get("note").trim();
  let isValid = true;

  clearErrors();

  if (title.length < 3) {
    setError("title", "Enter a title with at least 3 characters.");
    isValid = false;
  }

  if (!amount || amount <= 0 || amount > 10000) {
    setError("amount", "Enter an amount from $0.01 to $10,000.");
    isValid = false;
  }

  if (!date) {
    setError("date", "Choose the expense date.");
    isValid = false;
  } else if (date > todayString()) {
    setError("date", "The date cannot be in the future.");
    isValid = false;
  }

  if (!category) {
    setError("category", "Choose a category.");
    isValid = false;
  }

  if (note.length > 160) {
    setError("note", "Keep the note under 160 characters.");
    isValid = false;
  }

  return isValid;
}

expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(expenseForm);

  if (!validateForm(formData)) {
    return;
  }

  const newExpense = {
    id: createExpenseId(),
    title: formData.get("title").trim(),
    amount: Number(formData.get("amount")).toFixed(2),
    date: formData.get("date"),
    category: formData.get("category"),
    note: formData.get("note").trim(),
    reimbursable: formData.get("reimbursable") === "on",
    createdAt: new Date().toISOString()
  };

  expenses.unshift(newExpense);
  lastSavedId = newExpense.id;
  localStorage.setItem(LAST_SAVED_KEY, lastSavedId);
  saveExpenses();

  formSuccess.textContent = "Expense saved successfully.";
  expenseForm.reset();
  document.getElementById("date").value = todayString();
  navigate("summary");
});

resetFormButton.addEventListener("click", () => {
  expenseForm.reset();
  document.getElementById("date").value = todayString();
  clearErrors();
});

clearAllButton.addEventListener("click", () => {
  if (expenses.length === 0) {
    return;
  }

  const shouldClear = window.confirm("Delete all saved expenses?");

  if (shouldClear) {
    expenses = [];
    lastSavedId = "";
    localStorage.removeItem(LAST_SAVED_KEY);
    saveExpenses();
    renderAll();
  }
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => navigate(button.dataset.go));
});

document.getElementById("date").value = todayString();
navigate(window.location.hash.replace("#", "") || "home");
