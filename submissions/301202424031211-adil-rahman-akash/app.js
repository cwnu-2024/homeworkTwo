const STORAGE_KEY = "campusCoursePlannerRequests";

const screen = document.querySelector("#screen");
const savedCount = document.querySelector("#savedCount");
const navLinks = [...document.querySelectorAll(".tabs a")];

const templates = {
  home: document.querySelector("#homeTemplate"),
  register: document.querySelector("#registerTemplate"),
  summary: document.querySelector("#summaryTemplate"),
  saved: document.querySelector("#savedTemplate"),
};

let latestRequest = null;

function getRequests() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveRequest(request) {
  const requests = getRequests();
  requests.unshift(request);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests.slice(0, 5)));
  updateSavedCount();
}

function updateSavedCount() {
  const count = getRequests().length;
  savedCount.textContent = `${count} saved`;
}

function routeName() {
  return window.location.hash.replace("#", "") || "home";
}

function render() {
  const route = templates[routeName()] ? routeName() : "home";
  screen.replaceChildren(templates[route].content.cloneNode(true));
  window.scrollTo({ top: 0, behavior: "smooth" });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.route === route);
  });

  if (route === "register") setupForm();
  if (route === "summary") renderSummary();
  if (route === "saved") renderSaved();
  updateSavedCount();
}

function setupForm() {
  const form = document.querySelector("#courseForm");
  const today = new Date().toISOString().split("T")[0];
  form.elements.startDate.min = today;

  form.elements.fullName.value = latestRequest?.fullName || "Adil Rahman Akash";
  form.elements.studentId.value = latestRequest?.studentId || "301202424031211";

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();

    const formData = new FormData(form);
    const request = {
      fullName: formData.get("fullName").trim(),
      studentId: formData.get("studentId").trim(),
      course: formData.get("course"),
      credits: formData.get("credits"),
      startDate: formData.get("startDate"),
      studyMode: formData.get("studyMode"),
      notes: formData.get("notes").trim() || "No extra notes.",
      createdAt: new Date().toLocaleString(),
    };

    const errors = validate(request, form.elements.agreement.checked);
    if (Object.keys(errors).length > 0) {
      showErrors(errors);
      return;
    }

    latestRequest = request;
    saveRequest(request);
    window.location.hash = "summary";
  });
}

function validate(request, agreed) {
  const errors = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = request.startDate ? new Date(`${request.startDate}T00:00:00`) : null;

  if (!request.fullName) errors.fullName = "Full name is required.";
  if (!/^\d{12,18}$/.test(request.studentId)) {
    errors.studentId = "Student ID must be 12 to 18 digits.";
  }
  if (!request.course) errors.course = "Please select a course.";

  const credits = Number(request.credits);
  if (!request.credits) {
    errors.credits = "Credits are required.";
  } else if (!Number.isInteger(credits) || credits < 1 || credits > 6) {
    errors.credits = "Credits must be a whole number from 1 to 6.";
  }

  if (!request.startDate) {
    errors.startDate = "Start date is required.";
  } else if (selectedDate < today) {
    errors.startDate = "Start date cannot be in the past.";
  }

  if (!agreed) errors.agreement = "Please confirm the information is correct.";
  return errors;
}

function clearErrors() {
  document.querySelectorAll("[data-error]").forEach((item) => {
    item.textContent = "";
  });
}

function showErrors(errors) {
  Object.entries(errors).forEach(([field, message]) => {
    document.querySelector(`[data-error="${field}"]`).textContent = message;
  });
}

function renderSummary() {
  const summaryCard = document.querySelector("#summaryCard");
  const request = latestRequest || getRequests()[0];

  if (!request) {
    summaryCard.innerHTML = `<p>No request has been submitted yet.</p>`;
    return;
  }

  summaryCard.innerHTML = [
    ["Name", request.fullName],
    ["Student ID", request.studentId],
    ["Course", request.course],
    ["Credits", request.credits],
    ["Start Date", request.startDate],
    ["Study Mode", request.studyMode],
    ["Notes", request.notes],
  ]
    .map(([label, value]) => `<div class="summary-row"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
}

function renderSaved() {
  const list = document.querySelector("#savedList");
  const requests = getRequests();

  if (requests.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <p>No saved course requests yet. Submit the form to save one locally.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = requests
    .map(
      (request) => `
        <article class="saved-item">
          <h3>${request.course}</h3>
          <p>${request.fullName} requested ${request.credits} credits for ${request.startDate}.</p>
          <p>${request.studyMode} - saved ${request.createdAt}</p>
        </article>
      `,
    )
    .join("");
}

window.addEventListener("hashchange", render);
render();
