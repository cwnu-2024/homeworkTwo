const screens = document.querySelectorAll(".screen");
const form = document.querySelector("#expense-form");
const storageKey = "pocket-spend-expense";

const fields = {
  title: document.querySelector("#title"),
  category: document.querySelector("#category"),
  amount: document.querySelector("#amount"),
  date: document.querySelector("#date"),
  notes: document.querySelector("#notes"),
  reimbursable: document.querySelector("#reimbursable")
};

function showScreen(id) {
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === id);
  });
  if (id === "summary-screen" || id === "home-screen") {
    renderSavedExpense();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getSavedExpense() {
  const raw = localStorage.getItem(storageKey);
  return raw ? JSON.parse(raw) : null;
}

function getMethod() {
  const checked = document.querySelector("input[name='method']:checked");
  return checked ? checked.value : "";
}

function setError(name, message) {
  document.querySelector(`#${name}-error`).textContent = message;
}

function validateExpense() {
  let valid = true;
  const today = new Date().toISOString().split("T")[0];
  const amount = Number(fields.amount.value);

  ["title", "category", "amount", "date", "method"].forEach((name) => setError(name, ""));

  if (fields.title.value.trim().length < 3) {
    setError("title", "Title must be at least 3 characters.");
    valid = false;
  }

  if (!fields.category.value) {
    setError("category", "Choose a category.");
    valid = false;
  }

  if (!fields.amount.value || Number.isNaN(amount) || amount < 0.01 || amount > 5000) {
    setError("amount", "Amount must be between 0.01 and 5000.");
    valid = false;
  }

  if (!fields.date.value) {
    setError("date", "Choose a date.");
    valid = false;
  } else if (fields.date.value > today) {
    setError("date", "Date cannot be in the future.");
    valid = false;
  }

  if (!getMethod()) {
    setError("method", "Select a payment method.");
    valid = false;
  }

  return valid;
}

function fillForm(expense) {
  fields.title.value = expense.title;
  fields.category.value = expense.category;
  fields.amount.value = expense.amount;
  fields.date.value = expense.date;
  fields.notes.value = expense.notes;
  fields.reimbursable.checked = expense.reimbursable;
  document.querySelectorAll("input[name='method']").forEach((input) => {
    input.checked = input.value === expense.method;
  });
}

function renderSavedExpense() {
  const expense = getSavedExpense();
  const homeAmount = document.querySelector("#home-amount");
  const homeSummary = document.querySelector("#home-summary");
  const emptyState = document.querySelector("#empty-state");
  const summaryCard = document.querySelector("#summary-card");

  if (!expense) {
    homeAmount.textContent = "$0.00";
    homeSummary.textContent = "Add an expense to see the summary here.";
    emptyState.classList.remove("hidden");
    summaryCard.classList.add("hidden");
    return;
  }

  const formattedAmount = `$${Number(expense.amount).toFixed(2)}`;
  homeAmount.textContent = formattedAmount;
  homeSummary.textContent = `${expense.title} in ${expense.category} on ${expense.date}`;
  emptyState.classList.add("hidden");
  summaryCard.classList.remove("hidden");

  document.querySelector("#summary-category").textContent = expense.category;
  document.querySelector("#summary-amount").textContent = formattedAmount;
  document.querySelector("#summary-title-value").textContent = expense.title;
  document.querySelector("#summary-date").textContent = expense.date;
  document.querySelector("#summary-method").textContent = expense.method;
  document.querySelector("#summary-reimbursable").textContent = expense.reimbursable ? "Yes" : "No";
  document.querySelector("#summary-notes").textContent = expense.notes || "No notes";
}

function loadReviewState() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("demo") === "1" && !getSavedExpense()) {
    localStorage.setItem(storageKey, JSON.stringify({
      title: "Campus lunch",
      category: "Food",
      amount: "18.50",
      date: "2026-05-20",
      method: "Mobile Pay",
      reimbursable: false,
      notes: "Meal after group study"
    }));
  }

  const requestedScreen = params.get("screen");
  if (requestedScreen === "form") {
    showScreen("form-screen");
  } else if (requestedScreen === "summary") {
    showScreen("summary-screen");
  }
}

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.go;
    const saved = getSavedExpense();
    if (target === "form-screen" && saved) {
      fillForm(saved);
    }
    showScreen(target);
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateExpense()) {
    return;
  }

  const expense = {
    title: fields.title.value.trim(),
    category: fields.category.value,
    amount: Number(fields.amount.value).toFixed(2),
    date: fields.date.value,
    method: getMethod(),
    reimbursable: fields.reimbursable.checked,
    notes: fields.notes.value.trim()
  };

  localStorage.setItem(storageKey, JSON.stringify(expense));
  showScreen("summary-screen");
});

document.querySelector("#clear-data").addEventListener("click", () => {
  localStorage.removeItem(storageKey);
  form.reset();
  renderSavedExpense();
});

renderSavedExpense();
loadReviewState();
