const views = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll("[data-view]");
const form = document.querySelector("#plan-form");
const summary = document.querySelector("#summary-content");
const homeCourse = document.querySelector("#home-course");
const homeBudget = document.querySelector("#home-budget");

let savedPlan = JSON.parse(localStorage.getItem("campusPlan") || "null");

function showView(viewId) {
  views.forEach((view) => view.classList.toggle("active", view.id === viewId));
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewId);
  });

  if (window.location.hash !== `#${viewId}`) {
    window.location.hash = viewId;
  }
}

function setError(field, message) {
  document.querySelector(`#${field}-error`).textContent = message;
}

function validate(values) {
  let valid = true;
  ["activity", "date", "time", "budget"].forEach((field) => setError(field, ""));

  if (values.activity.trim().length < 3) {
    setError("activity", "Enter at least 3 characters.");
    valid = false;
  }

  if (!values.date) {
    setError("date", "Choose a date.");
    valid = false;
  }

  if (!values.time) {
    setError("time", "Choose a time block.");
    valid = false;
  }

  const budget = Number(values.budget);
  if (!values.budget || Number.isNaN(budget) || budget < 0 || budget > 50) {
    setError("budget", "Budget must be between 0 and 50.");
    valid = false;
  }

  return valid;
}

function renderPlan() {
  if (!savedPlan) {
    summary.innerHTML = '<p class="empty-state">No plan saved yet. Create one from the Plan page.</p>';
    homeCourse.textContent = "No plan yet";
    homeBudget.textContent = "$0";
    return;
  }

  homeCourse.textContent = savedPlan.activity;
  homeBudget.textContent = `$${savedPlan.budget}`;
  summary.innerHTML = `
    <div class="summary-item"><strong>Activity</strong><span>${savedPlan.activity}</span></div>
    <div class="summary-item"><strong>Date and time</strong><span>${savedPlan.date} · ${savedPlan.time}</span></div>
    <div class="summary-item"><strong>Food budget</strong><span>$${savedPlan.budget}</span></div>
    <div class="summary-item"><strong>Reminder</strong><span>${savedPlan.reminder ? "Yes" : "No"}</span></div>
    <div class="summary-item"><strong>Notes</strong><span>${savedPlan.notes || "No notes added."}</span></div>
  `;
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

window.addEventListener("hashchange", () => {
  const viewId = window.location.hash.replace("#", "") || "home";
  showView(document.querySelector(`#${viewId}`) ? viewId : "home");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const values = {
    activity: form.activity.value,
    date: form.date.value,
    time: form.time.value,
    budget: form.budget.value,
    notes: form.notes.value,
    reminder: form.reminder.checked,
  };

  if (!validate(values)) return;

  savedPlan = values;
  localStorage.setItem("campusPlan", JSON.stringify(savedPlan));
  renderPlan();
  showView("summary");
});

renderPlan();
showView(window.location.hash.replace("#", "") || "home");
