const STORAGE_KEYS = {
  transactions: "expenseTracker.transactions",
  budgets: "expenseTracker.budgets"
};

const EXPENSE_CATEGORIES = ["Food", "Transport", "Rent", "Utilities", "Shopping", "Health", "Entertainment", "Other"];
const INCOME_CATEGORIES = ["Salary", "Freelance", "Gift", "Investment", "Other"];
const MAX_AMOUNT = 999999;

const state = {
  transactions: loadFromStorage(STORAGE_KEYS.transactions, []),
  budgets: loadFromStorage(STORAGE_KEYS.budgets, defaultBudgets())
};

const elements = {
  clearAllButton: document.querySelector("#clearAllButton"),
  currentMonthLabel: document.querySelector("#currentMonthLabel"),
  dailyNet: document.querySelector("#dailyNet"),
  weeklyNet: document.querySelector("#weeklyNet"),
  monthlyNet: document.querySelector("#monthlyNet"),
  dailyBreakdown: document.querySelector("#dailyBreakdown"),
  weeklyBreakdown: document.querySelector("#weeklyBreakdown"),
  monthlyBreakdown: document.querySelector("#monthlyBreakdown"),
  transactionCount: document.querySelector("#transactionCount"),
  transactionList: document.querySelector("#transactionList"),
  transactionForm: document.querySelector("#transactionForm"),
  categoryInput: document.querySelector("#categoryInput"),
  amountInput: document.querySelector("#amountInput"),
  dateInput: document.querySelector("#dateInput"),
  notesInput: document.querySelector("#notesInput"),
  categoryError: document.querySelector("#categoryError"),
  amountError: document.querySelector("#amountError"),
  dateError: document.querySelector("#dateError"),
  notesError: document.querySelector("#notesError"),
  formMessage: document.querySelector("#formMessage"),
  budgetForm: document.querySelector("#budgetForm"),
  budgetCategoryInput: document.querySelector("#budgetCategoryInput"),
  budgetLimitInput: document.querySelector("#budgetLimitInput"),
  budgetCategoryError: document.querySelector("#budgetCategoryError"),
  budgetLimitError: document.querySelector("#budgetLimitError"),
  budgetList: document.querySelector("#budgetList")
};

function loadFromStorage(key, fallback) {
  try {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(state.transactions));
  localStorage.setItem(STORAGE_KEYS.budgets, JSON.stringify(state.budgets));
}

function defaultBudgets() {
  return EXPENSE_CATEGORIES.reduce((budgets, category) => {
    budgets[category] = 0;
    return budgets;
  }, {});
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function parseLocalDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const matchesInput =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  return matchesInput ? date : null;
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSameDay(date, comparison) {
  return date.getFullYear() === comparison.getFullYear() &&
    date.getMonth() === comparison.getMonth() &&
    date.getDate() === comparison.getDate();
}

function isSameWeek(date, comparison) {
  const start = new Date(comparison);
  start.setHours(0, 0, 0, 0);
  start.setDate(comparison.getDate() - comparison.getDay());

  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return date >= start && date < end;
}

function isSameMonth(date, comparison) {
  return date.getFullYear() === comparison.getFullYear() && date.getMonth() === comparison.getMonth();
}

function calculateSummary(filterFn) {
  return state.transactions.reduce(
    (summary, transaction) => {
      const transactionDate = parseLocalDate(transaction.date);
      if (!transactionDate || !filterFn(transactionDate)) {
        return summary;
      }

      summary[transaction.type] += transaction.amount;
      return summary;
    },
    { income: 0, expense: 0 }
  );
}

function renderSummary() {
  const now = new Date();
  const daily = calculateSummary(date => isSameDay(date, now));
  const weekly = calculateSummary(date => isSameWeek(date, now));
  const monthly = calculateSummary(date => isSameMonth(date, now));

  elements.currentMonthLabel.textContent = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  updateSummaryCard("daily", daily);
  updateSummaryCard("weekly", weekly);
  updateSummaryCard("monthly", monthly);
}

function updateSummaryCard(period, summary) {
  const net = summary.income - summary.expense;
  elements[`${period}Net`].textContent = formatCurrency(net);
  elements[`${period}Breakdown`].textContent = `Income ${formatCurrency(summary.income)} - Expense ${formatCurrency(summary.expense)}`;
}

function renderTransactions() {
  const transactions = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  elements.transactionCount.textContent = `${transactions.length} ${transactions.length === 1 ? "item" : "items"}`;

  if (!transactions.length) {
    elements.transactionList.innerHTML = '<p class="empty-state">No transactions yet. Add one to start tracking.</p>';
    return;
  }

  elements.transactionList.innerHTML = transactions.map(transaction => {
    const sign = transaction.type === "income" ? "+" : "-";
    const date = parseLocalDate(transaction.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    return `
      <article class="transaction-item">
        <div>
          <p class="transaction-title">${escapeHtml(transaction.category)}</p>
          <p class="transaction-meta">${date} - ${escapeHtml(transaction.notes)}</p>
        </div>
        <div class="amount ${transaction.type}">${sign}${formatCurrency(transaction.amount)}</div>
      </article>
    `;
  }).join("");
}

function renderBudgets() {
  const monthlyExpenses = state.transactions.reduce((totals, transaction) => {
    const transactionDate = parseLocalDate(transaction.date);
    if (transaction.type === "expense" && transactionDate && isSameMonth(transactionDate, new Date())) {
      totals[transaction.category] = (totals[transaction.category] || 0) + transaction.amount;
    }
    return totals;
  }, {});

  elements.budgetList.innerHTML = EXPENSE_CATEGORIES.map(category => {
    const limit = Number(state.budgets[category] || 0);
    const spent = monthlyExpenses[category] || 0;
    const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
    const statusClass = limit > 0 && spent > limit ? "over" : percent >= 80 ? "warning" : "";
    const alert = limit > 0 && spent > limit
      ? `<p class="budget-alert">Limit exceeded by ${formatCurrency(spent - limit)}</p>`
      : "";
    const limitText = limit > 0 ? formatCurrency(limit) : "No limit";

    return `
      <article class="budget-card">
        <div class="budget-row">
          <strong>${category}</strong>
          <span>${formatCurrency(spent)} / ${limitText}</span>
        </div>
        <div class="progress-track" aria-label="${category} budget progress">
          <div class="progress-fill ${statusClass}" style="width: ${percent}%"></div>
        </div>
        ${alert}
      </article>
    `;
  }).join("");
}

function populateCategoryOptions(type = "expense") {
  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  elements.categoryInput.innerHTML = '<option value="">Choose category</option>' +
    categories.map(category => `<option value="${category}">${category}</option>`).join("");
}

function populateBudgetOptions() {
  elements.budgetCategoryInput.innerHTML = EXPENSE_CATEGORIES
    .map(category => `<option value="${category}">${category}</option>`)
    .join("");
}

function setError(name, message) {
  elements[`${name}Error`].textContent = message;
}

function clearTransactionErrors() {
  ["category", "amount", "date", "notes"].forEach(name => setError(name, ""));
}

function validateTransactionForm() {
  clearTransactionErrors();
  const type = new FormData(elements.transactionForm).get("type");
  const category = elements.categoryInput.value;
  const amount = Number(elements.amountInput.value);
  const date = elements.dateInput.value;
  const notes = elements.notesInput.value.trim();
  let valid = true;

  if (!category) {
    setError("category", "Category is required.");
    valid = false;
  }

  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
    setError("amount", "Enter an amount from 0.01 to 999,999.");
    valid = false;
  }

  if (!parseLocalDate(date)) {
    setError("date", "Enter a valid date.");
    valid = false;
  }

  if (!notes) {
    setError("notes", "Notes are required.");
    valid = false;
  }

  return valid ? { type, category, amount: roundMoney(amount), date, notes } : null;
}

function validateBudgetForm() {
  elements.budgetCategoryError.textContent = "";
  elements.budgetLimitError.textContent = "";
  const category = elements.budgetCategoryInput.value;
  const limit = Number(elements.budgetLimitInput.value);
  let valid = true;

  if (!category) {
    elements.budgetCategoryError.textContent = "Category is required.";
    valid = false;
  }

  if (!Number.isFinite(limit) || limit < 0 || limit > MAX_AMOUNT) {
    elements.budgetLimitError.textContent = "Enter a limit from 0 to 999,999.";
    valid = false;
  }

  return valid ? { category, limit: roundMoney(limit) } : null;
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `transaction-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.toggle("active", screen.id === screenId);
  });

  document.querySelectorAll(".nav-button").forEach(button => {
    const isActive = button.dataset.screen === screenId;
    button.classList.toggle("active", isActive);
    if (isActive) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });
}

function renderAll() {
  renderSummary();
  renderTransactions();
  renderBudgets();
}

document.querySelectorAll(".nav-button").forEach(button => {
  button.addEventListener("click", () => showScreen(button.dataset.screen));
});

elements.transactionForm.addEventListener("change", event => {
  if (event.target.name === "type") {
    populateCategoryOptions(event.target.value);
  }
});

elements.transactionForm.addEventListener("submit", event => {
  event.preventDefault();
  const transaction = validateTransactionForm();
  if (!transaction) {
    elements.formMessage.textContent = "";
    return;
  }

  state.transactions.push({
    id: createId(),
    createdAt: Date.now(),
    ...transaction
  });
  saveToStorage();
  elements.transactionForm.reset();
  elements.dateInput.value = toDateInputValue(new Date());
  populateCategoryOptions("expense");
  elements.formMessage.textContent = "Transaction saved.";
  renderAll();
});

elements.budgetForm.addEventListener("submit", event => {
  event.preventDefault();
  const budget = validateBudgetForm();
  if (!budget) {
    return;
  }

  state.budgets[budget.category] = budget.limit;
  saveToStorage();
  elements.budgetLimitInput.value = "";
  renderBudgets();
});

elements.budgetCategoryInput.addEventListener("change", () => {
  const limit = state.budgets[elements.budgetCategoryInput.value] || "";
  elements.budgetLimitInput.value = limit;
});

elements.clearAllButton.addEventListener("click", () => {
  const confirmed = window.confirm("Clear every transaction and budget limit?");
  if (!confirmed) {
    return;
  }

  state.transactions = [];
  state.budgets = defaultBudgets();
  saveToStorage();
  elements.budgetLimitInput.value = "";
  elements.formMessage.textContent = "";
  renderAll();
});

populateCategoryOptions();
populateBudgetOptions();
elements.dateInput.value = toDateInputValue(new Date());
renderAll();
