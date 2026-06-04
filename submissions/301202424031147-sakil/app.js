const STORAGE_KEY = "campusfix_requests";

const app = document.querySelector("#app");
const navLinks = document.querySelectorAll("[data-link]");

const categories = {
  maintenance: "Maintenance",
  technology: "Technology",
  cleaning: "Cleaning",
  safety: "Safety",
};

function getRequests() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveRequests(requests) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function createRequestId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `request-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function setActiveNav(route) {
  const section = (route.split("?")[0].split("/")[1] || "home");
  navLinks.forEach((link) => {
    const isActive = link.dataset.link === section || (section === "" && link.dataset.link === "home");
    link.classList.toggle("active", isActive);
  });
}

function renderHome() {
  const requestCount = getRequests().length;

  app.innerHTML = `
    <section class="screen" aria-labelledby="home-title">
      <div class="hero">
        <h1 id="home-title">Campus service requests</h1>
        <p>Report small campus issues and keep a local record of what you submitted.</p>
      </div>

      <div class="section">
        <h2>What you can submit</h2>
        <ul class="quick-list">
          <li><strong>Maintenance</strong><span>Broken lights, doors, desks, or room equipment.</span></li>
          <li><strong>Technology</strong><span>Projector, computer lab, Wi-Fi, or printer issues.</span></li>
          <li><strong>Cleaning</strong><span>Overflowing bins, spills, or restroom supply problems.</span></li>
        </ul>
      </div>

      <div class="button-row">
        <a class="btn" href="#/new">Create request</a>
        <a class="btn secondary" href="#/summary">${requestCount} saved</a>
      </div>
    </section>
  `;
}

function renderNewRequest() {
  app.innerHTML = `
    <section class="screen" aria-labelledby="form-title">
      <div class="summary-title">
        <h1 id="form-title">New request</h1>
        <p class="summary-meta">Fill in the details so campus staff can understand the issue.</p>
      </div>

      <form id="request-form" novalidate>
        <div class="field">
          <label for="studentName">Your name</label>
          <input id="studentName" name="studentName" autocomplete="name" required />
          <span class="error" id="studentNameError"></span>
        </div>

        <div class="field">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" autocomplete="email" required />
          <span class="error" id="emailError"></span>
        </div>

        <div class="field">
          <label for="category">Category</label>
          <select id="category" name="category" required>
            <option value="">Choose a category</option>
            <option value="maintenance">Maintenance</option>
            <option value="technology">Technology</option>
            <option value="cleaning">Cleaning</option>
            <option value="safety">Safety</option>
          </select>
          <span class="error" id="categoryError"></span>
        </div>

        <div class="field">
          <label for="location">Campus location</label>
          <input id="location" name="location" placeholder="Example: Library 2F" required />
          <span class="error" id="locationError"></span>
        </div>

        <fieldset class="field">
          <legend class="fieldset-label">Priority</legend>
          <div class="radio-group">
            <label class="radio-option"><input type="radio" name="priority" value="Low" checked /> Low</label>
            <label class="radio-option"><input type="radio" name="priority" value="Medium" /> Medium</label>
            <label class="radio-option"><input type="radio" name="priority" value="High" /> High</label>
          </div>
        </fieldset>

        <div class="field">
          <label for="neededBy">Needed by</label>
          <input id="neededBy" name="neededBy" type="date" min="${todayString()}" required />
          <span class="error" id="neededByError"></span>
        </div>

        <div class="field">
          <label for="description">Problem description</label>
          <textarea id="description" name="description" minlength="12" required></textarea>
          <span class="error" id="descriptionError"></span>
        </div>

        <label class="checkbox-line">
          <input id="permission" name="permission" type="checkbox" />
          Staff may contact me for more details
        </label>

        <button class="btn" type="submit">Submit request</button>
      </form>
    </section>
  `;

  document.querySelector("#request-form").addEventListener("submit", handleSubmit);
}

function clearErrors() {
  document.querySelectorAll(".error").forEach((element) => {
    element.textContent = "";
  });
}

function showError(field, message) {
  document.querySelector(`#${field}Error`).textContent = message;
}

function validateForm(formData) {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const selectedDate = formData.get("neededBy");

  if (!formData.get("studentName").trim()) {
    errors.studentName = "Name is required.";
  }

  if (!emailPattern.test(formData.get("email").trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!formData.get("category")) {
    errors.category = "Choose a category.";
  }

  if (!formData.get("location").trim()) {
    errors.location = "Location is required.";
  }

  if (!selectedDate) {
    errors.neededBy = "Choose a date.";
  } else if (selectedDate < todayString()) {
    errors.neededBy = "Date cannot be in the past.";
  }

  if (formData.get("description").trim().length < 12) {
    errors.description = "Description must be at least 12 characters.";
  }

  return errors;
}

function handleSubmit(event) {
  event.preventDefault();
  clearErrors();

  const form = event.currentTarget;
  const formData = new FormData(form);
  const errors = validateForm(formData);

  Object.entries(errors).forEach(([field, message]) => showError(field, message));

  if (Object.keys(errors).length > 0) {
    return;
  }

  const request = {
    id: createRequestId(),
    studentName: formData.get("studentName").trim(),
    email: formData.get("email").trim(),
    category: formData.get("category"),
    location: formData.get("location").trim(),
    priority: formData.get("priority"),
    neededBy: formData.get("neededBy"),
    description: formData.get("description").trim(),
    permission: formData.get("permission") === "on",
    createdAt: new Date().toISOString(),
  };

  const requests = [request, ...getRequests()];
  saveRequests(requests);
  window.location.hash = `#/summary?id=${request.id}`;
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${dateString}T00:00:00`));
}

function renderSummary() {
  const requests = getRequests();
  const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const currentId = params.get("id");
  const selectedRequest = requests.find((request) => request.id === currentId);

  if (requests.length === 0) {
    app.innerHTML = `
      <section class="screen" aria-labelledby="summary-title">
        <div class="summary-title">
          <h1 id="summary-title">Request summary</h1>
          <p class="summary-meta">No saved requests yet.</p>
        </div>
        <div class="empty-state">
          <p>Create your first campus service request and it will appear here.</p>
          <a class="btn" href="#/new">Create request</a>
        </div>
      </section>
    `;
    return;
  }

  const savedMessage = selectedRequest
    ? `<div class="status" role="status">Request saved for ${selectedRequest.location}.</div>`
    : "";

  app.innerHTML = `
    <section class="screen" aria-labelledby="summary-title">
      <div class="summary-title">
        <h1 id="summary-title">Request summary</h1>
        <p class="summary-meta">${requests.length} request${requests.length === 1 ? "" : "s"} saved on this device.</p>
      </div>

      ${savedMessage}

      <div class="request-list">
        ${requests.map(renderRequestCard).join("")}
      </div>

      <div class="button-row">
        <a class="btn" href="#/new">Add another</a>
        <button class="btn danger" id="clearRequests" type="button">Clear all</button>
      </div>
    </section>
  `;

  document.querySelector("#clearRequests").addEventListener("click", () => {
    saveRequests([]);
    renderSummary();
    setActiveNav("/summary");
  });
}

function renderRequestCard(request) {
  return `
    <article class="request-card">
      <span class="badge">${categories[request.category]} · ${request.priority}</span>
      <strong>${request.location}</strong>
      <dl>
        <dt>Name</dt>
        <dd>${escapeHtml(request.studentName)}</dd>
        <dt>Email</dt>
        <dd>${escapeHtml(request.email)}</dd>
        <dt>Needed</dt>
        <dd>${formatDate(request.neededBy)}</dd>
        <dt>Details</dt>
        <dd>${escapeHtml(request.description)}</dd>
        <dt>Contact</dt>
        <dd>${request.permission ? "Allowed" : "Not allowed"}</dd>
      </dl>
    </article>
  `;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function router() {
  const route = window.location.hash.replace("#", "") || "/";
  setActiveNav(route);

  if (route.startsWith("/new")) {
    renderNewRequest();
  } else if (route.startsWith("/summary")) {
    renderSummary();
  } else {
    renderHome();
  }

  app.focus();
}

window.addEventListener("hashchange", router);
router();
