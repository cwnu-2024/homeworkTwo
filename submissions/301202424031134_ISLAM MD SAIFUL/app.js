const STORAGE_KEY = "campusFixItRequests";

const screens = {
  home: document.querySelector("#homeScreen"),
  form: document.querySelector("#formScreen"),
  summary: document.querySelector("#summaryScreen"),
  history: document.querySelector("#historyScreen")
};

const form = document.querySelector("#requestForm");
const summaryList = document.querySelector("#summaryList");
const historyList = document.querySelector("#historyList");
const requestCount = document.querySelector("#requestCount");
const openCount = document.querySelector("#openCount");
const homeRecent = document.querySelector("#homeRecent");
const summaryTimestamp = document.querySelector("#summaryTimestamp");
const clearHistoryButton = document.querySelector("#clearHistoryButton");

const routeButtons = document.querySelectorAll("[data-route]");

let requests = loadRequests();
let latestRequest = requests[0] || null;

function createId() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function loadRequests() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveRequests() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value) {
  if (!value) {
    return "Not provided";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function setRoute(route) {
  const selectedRoute = screens[route] ? route : "home";

  Object.entries(screens).forEach(([name, screen]) => {
    screen.classList.toggle("active", name === selectedRoute);
  });

  routeButtons.forEach((button) => {
    const isCurrent = button.dataset.route === selectedRoute;
    if (isCurrent) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  if (selectedRoute === "summary") {
    renderSummary();
  }

  if (selectedRoute === "history") {
    renderHistory();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function navigate(route) {
  window.location.hash = route;
  setRoute(route);
}

function clearErrors() {
  document.querySelectorAll(".error-message").forEach((element) => {
    element.textContent = "";
  });
}

function showError(name, message) {
  const element = document.querySelector(`[data-error-for="${name}"]`);
  if (element) {
    element.textContent = message;
  }
}

function validateForm(data) {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!data.studentName.trim()) {
    errors.studentName = "Full name is required.";
  }

  if (!data.email.trim()) {
    errors.email = "Student email is required.";
  } else if (!emailPattern.test(data.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!data.area) {
    errors.area = "Choose a campus area.";
  }

  if (!data.category) {
    errors.category = "Choose a problem category.";
  }

  if (!data.dateNoticed) {
    errors.dateNoticed = "Date noticed is required.";
  } else if (data.dateNoticed > todayIsoDate()) {
    errors.dateNoticed = "Date noticed cannot be in the future.";
  }

  if (!data.priority) {
    errors.priority = "Choose a priority.";
  }

  if (!data.description.trim()) {
    errors.description = "Description is required.";
  } else if (data.description.trim().length < 12) {
    errors.description = "Description must be at least 12 characters.";
  }

  return errors;
}

function getFormData() {
  const data = new FormData(form);

  return {
    id: createId(),
    studentName: data.get("studentName").trim(),
    email: data.get("email").trim(),
    area: data.get("area"),
    category: data.get("category"),
    dateNoticed: data.get("dateNoticed"),
    priority: data.get("priority") || "",
    description: data.get("description").trim(),
    followUp: data.get("followUp") === "on",
    submittedAt: new Date().toISOString()
  };
}

function renderCounts() {
  const count = requests.length;
  requestCount.textContent = `${count} saved`;
  openCount.textContent = count;
}

function renderHomeRecent() {
  if (!latestRequest) {
    homeRecent.className = "empty-state";
    homeRecent.textContent = "No requests yet. Create one to see it here.";
    return;
  }

  homeRecent.className = "history-card";
  homeRecent.innerHTML = `
    <h3>${escapeHtml(latestRequest.category)} in ${escapeHtml(latestRequest.area)}</h3>
    <p>${escapeHtml(latestRequest.description)}</p>
    <button class="secondary-button" type="button" data-view-request="${escapeHtml(latestRequest.id)}">View summary</button>
  `;
}

function renderSummary() {
  if (!latestRequest) {
    summaryTimestamp.textContent = "No request has been submitted yet.";
    summaryList.innerHTML = `
      <div>
        <dt>Status</dt>
        <dd>Use the new request form to create a campus service request.</dd>
      </div>
    `;
    return;
  }

  summaryTimestamp.textContent = `Submitted ${formatDateTime(latestRequest.submittedAt)}`;

  const items = [
    ["Student", latestRequest.studentName],
    ["Email", latestRequest.email],
    ["Location", latestRequest.area],
    ["Category", latestRequest.category],
    ["Date noticed", formatDate(latestRequest.dateNoticed)],
    ["Priority", latestRequest.priority],
    ["Follow-up", latestRequest.followUp ? "Email follow-up requested" : "No follow-up requested"],
    ["Description", latestRequest.description]
  ];

  summaryList.innerHTML = items.map(([label, value]) => `
    <div>
      <dt>${escapeHtml(label)}</dt>
      <dd>${escapeHtml(value)}</dd>
    </div>
  `).join("");
}

function renderHistory() {
  if (requests.length === 0) {
    historyList.innerHTML = `
      <div class="empty-state">
        No saved requests yet. Submitted requests will appear here.
      </div>
    `;
    clearHistoryButton.hidden = true;
    return;
  }

  clearHistoryButton.hidden = false;
  historyList.innerHTML = requests.map((request) => `
    <article class="history-card">
      <h3>${escapeHtml(request.category)} in ${escapeHtml(request.area)}</h3>
      <p>${escapeHtml(formatDate(request.dateNoticed))} - ${escapeHtml(request.priority)}</p>
      <p>${escapeHtml(request.description)}</p>
      <button class="secondary-button" type="button" data-view-request="${escapeHtml(request.id)}">Open summary</button>
    </article>
  `).join("");
}

function refreshUi() {
  renderCounts();
  renderHomeRecent();
  renderSummary();
  renderHistory();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  const request = getFormData();
  const errors = validateForm(request);

  if (Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([name, message]) => showError(name, message));
    return;
  }

  latestRequest = request;
  requests = [request, ...requests].slice(0, 10);
  saveRequests();
  form.reset();
  refreshUi();
  navigate("summary");
});

document.addEventListener("click", (event) => {
  const routeButton = event.target.closest("[data-route]");
  const viewButton = event.target.closest("[data-view-request]");

  if (routeButton) {
    navigate(routeButton.dataset.route);
  }

  if (viewButton) {
    const request = requests.find((item) => item.id === viewButton.dataset.viewRequest);
    if (request) {
      latestRequest = request;
      renderSummary();
      navigate("summary");
    }
  }
});

clearHistoryButton.addEventListener("click", () => {
  requests = [];
  latestRequest = null;
  saveRequests();
  refreshUi();
});

window.addEventListener("hashchange", () => {
  setRoute(window.location.hash.replace("#", ""));
});

document.querySelector("#dateNoticed").max = todayIsoDate();
refreshUi();
setRoute(window.location.hash.replace("#", "") || "home");
