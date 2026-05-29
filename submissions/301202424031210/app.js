const STORAGE_KEY = "campusfix.latestRequest";

const screens = {
  home: document.querySelector("#home-screen"),
  form: document.querySelector("#form-screen"),
  summary: document.querySelector("#summary-screen")
};

const form = document.querySelector("#request-form");
const fields = {
  studentName: document.querySelector("#student-name"),
  phone: document.querySelector("#phone"),
  category: document.querySelector("#category"),
  location: document.querySelector("#location"),
  serviceDate: document.querySelector("#service-date"),
  description: document.querySelector("#description"),
  permission: document.querySelector("#permission")
};

function todayISO() {
  const today = new Date();
  return today.toISOString().slice(0, 10);
}

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
  if (name === "summary") {
    renderSummary();
  }
  window.location.hash = name;
}

function setError(fieldName, message) {
  const field = fields[fieldName];
  const error = document.querySelector(`#${field.id}-error`);
  field.classList.toggle("invalid", Boolean(message));
  error.textContent = message;
}

function validateForm() {
  const data = getFormData();
  let isValid = true;
  const phonePattern = /^1[3-9]\d{9}$/;

  Object.keys(fields).forEach((fieldName) => {
    if (fieldName !== "permission") {
      setError(fieldName, "");
    }
  });
  document.querySelector("#permission-error").textContent = "";

  if (data.studentName.length < 2) {
    setError("studentName", "Name must be at least 2 characters.");
    isValid = false;
  }

  if (!phonePattern.test(data.phone)) {
    setError("phone", "Enter an 11-digit mainland China phone number.");
    isValid = false;
  }

  if (!data.category) {
    setError("category", "Choose a problem category.");
    isValid = false;
  }

  if (data.location.length < 5) {
    setError("location", "Location must include at least 5 characters.");
    isValid = false;
  }

  if (!data.serviceDate) {
    setError("serviceDate", "Choose a service date.");
    isValid = false;
  } else if (data.serviceDate < todayISO()) {
    setError("serviceDate", "Service date cannot be in the past.");
    isValid = false;
  }

  if (data.description.length < 10) {
    setError("description", "Description must be at least 10 characters.");
    isValid = false;
  }

  if (!data.permission) {
    document.querySelector("#permission-error").textContent = "Please allow staff to contact you.";
    isValid = false;
  }

  return isValid;
}

function getFormData() {
  const urgency = document.querySelector("input[name='urgency']:checked").value;
  return {
    studentName: fields.studentName.value.trim(),
    phone: fields.phone.value.trim(),
    category: fields.category.value,
    location: fields.location.value.trim(),
    serviceDate: fields.serviceDate.value,
    urgency,
    description: fields.description.value.trim(),
    permission: fields.permission.checked
  };
}

function fillForm(data) {
  fields.studentName.value = data.studentName || "";
  fields.phone.value = data.phone || "";
  fields.category.value = data.category || "";
  fields.location.value = data.location || "";
  fields.serviceDate.value = data.serviceDate || "";
  fields.description.value = data.description || "";
  fields.permission.checked = Boolean(data.permission);

  const urgency = data.urgency || "Normal";
  document.querySelectorAll("input[name='urgency']").forEach((input) => {
    input.checked = input.value === urgency;
  });
}

function loadSavedRequest() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

function renderSummary() {
  const saved = loadSavedRequest();
  const empty = document.querySelector("#empty-summary");
  const card = document.querySelector("#summary-card");

  empty.classList.toggle("hidden", Boolean(saved));
  card.classList.toggle("hidden", !saved);

  if (!saved) {
    return;
  }

  document.querySelector("#summary-category").textContent = saved.category;
  document.querySelector("#summary-urgency").textContent = saved.urgency;
  document.querySelector("#summary-name").textContent = saved.studentName;
  document.querySelector("#summary-phone").textContent = saved.phone;
  document.querySelector("#summary-location").textContent = saved.location;
  document.querySelector("#summary-date").textContent = saved.serviceDate;
  document.querySelector("#summary-description").textContent = saved.description;
}

document.querySelectorAll("[data-nav]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.nav;
    if (target === "form") {
      const saved = loadSavedRequest();
      if (saved) {
        fillForm(saved);
      }
    }
    showScreen(target);
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateForm()) {
    return;
  }

  const data = getFormData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  showScreen("summary");
});

document.querySelector("#clear-request").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  form.reset();
  renderSummary();
});

fields.serviceDate.min = todayISO();
if (new URLSearchParams(window.location.search).get("sample") === "1") {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    studentName: "Li Ming",
    phone: "13812345678",
    category: "Network",
    location: "Library 2F study room",
    serviceDate: todayISO(),
    urgency: "Urgent",
    description: "The Wi-Fi connection drops every few minutes near the west study tables.",
    permission: true
  }));
}

const initialScreen = window.location.hash.replace("#", "");
if (screens[initialScreen]) {
  showScreen(initialScreen);
} else {
  showScreen("home");
}
