const screens = {
  home: document.querySelector("#homeScreen"),
  form: document.querySelector("#formScreen"),
  summary: document.querySelector("#summaryScreen"),
};

const storageKey = "campusFix.latestRequest";
const screenTitle = document.querySelector("#screenTitle");
const backButton = document.querySelector("#backButton");
const navButtons = document.querySelectorAll("[data-go]");
const form = document.querySelector("#requestForm");

function todayString() {
  return new Date().toISOString().split("T")[0];
}

function getSavedRequest() {
  const raw = localStorage.getItem(storageKey);
  return raw ? JSON.parse(raw) : null;
}

function saveRequest(data) {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function navigate(screenName, updateHistory = true) {
  Object.entries(screens).forEach(([name, screen]) => {
    screen.classList.toggle("active", name === screenName);
  });

  screenTitle.textContent = screens[screenName].dataset.title;
  backButton.hidden = screenName === "home";
  document.querySelectorAll(".bottom-nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.go === screenName);
  });

  if (screenName === "home") {
    renderHome();
  }

  if (screenName === "summary") {
    renderSummary();
  }

  if (updateHistory) {
    history.pushState({ screenName }, "", `#${screenName}`);
  }
}

function showError(field, message) {
  const target = document.querySelector(`#${field}Error`);
  target.textContent = message || "";
}

function validateForm(data) {
  const errors = {};
  const phonePattern = /^[0-9+\-\s]{8,15}$/;

  if (!data.studentName.trim()) {
    errors.studentName = "Student name is required.";
  } else if (data.studentName.trim().length < 3) {
    errors.studentName = "Name must be at least 3 characters.";
  }

  if (!data.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!phonePattern.test(data.phone.trim())) {
    errors.phone = "Use 8 to 15 digits, spaces, +, or - only.";
  }

  if (!data.location.trim()) {
    errors.location = "Location is required.";
  }

  if (!data.issueType) {
    errors.issueType = "Choose an issue type.";
  }

  if (!data.neededBy) {
    errors.neededBy = "Choose a date.";
  } else if (data.neededBy < todayString()) {
    errors.neededBy = "Date cannot be in the past.";
  }

  if (!data.description.trim()) {
    errors.description = "Description is required.";
  } else if (data.description.trim().length < 12) {
    errors.description = "Description must be at least 12 characters.";
  }

  if (!data.permission) {
    errors.permission = "Permission is required so staff can follow up.";
  }

  return errors;
}

function getFormData() {
  const formData = new FormData(form);
  return {
    studentName: formData.get("studentName") || "",
    phone: formData.get("phone") || "",
    location: formData.get("location") || "",
    issueType: formData.get("issueType") || "",
    priority: formData.get("priority") || "Normal",
    neededBy: formData.get("neededBy") || "",
    description: formData.get("description") || "",
    permission: formData.get("permission") === "on",
    submittedAt: new Date().toLocaleString(),
  };
}

function fillForm(data) {
  if (!data) {
    return;
  }

  form.studentName.value = data.studentName;
  form.phone.value = data.phone;
  form.location.value = data.location;
  form.issueType.value = data.issueType;
  form.priority.value = data.priority;
  form.neededBy.value = data.neededBy;
  form.description.value = data.description;
  form.permission.checked = data.permission;
}

function clearErrors() {
  [
    "studentName",
    "phone",
    "location",
    "issueType",
    "neededBy",
    "description",
    "permission",
  ].forEach((field) => showError(field, ""));
}

function renderHome() {
  const saved = getSavedRequest();
  document.querySelector("#requestCount").textContent = saved ? "1" : "0";
  const latestRequest = document.querySelector("#latestRequest");

  if (!saved) {
    latestRequest.className = "empty-state";
    latestRequest.textContent = "No request submitted yet.";
    return;
  }

  latestRequest.className = "summary-list";
  latestRequest.innerHTML = `
    <div class="summary-row">
      <span class="summary-label">${saved.issueType}</span>
      <span class="summary-value">${saved.location}</span>
    </div>
    <div class="summary-row">
      <span class="summary-label">Priority</span>
      <span class="summary-value">${saved.priority}, needed by ${saved.neededBy}</span>
    </div>
  `;
}

function renderSummary() {
  const saved = getSavedRequest();
  const summary = document.querySelector("#summaryContent");

  if (!saved) {
    summary.className = "summary-card empty-state";
    summary.textContent = "Submit a request to see the summary here.";
    return;
  }

  summary.className = "summary-card";
  summary.innerHTML = `
    <div class="summary-list">
      ${summaryRow("Student", saved.studentName)}
      ${summaryRow("Phone", saved.phone)}
      ${summaryRow("Location", saved.location)}
      ${summaryRow("Issue type", saved.issueType)}
      ${summaryRow("Priority", saved.priority)}
      ${summaryRow("Needed by", saved.neededBy)}
      ${summaryRow("Description", saved.description)}
      ${summaryRow("Submitted", saved.submittedAt)}
    </div>
  `;
}

function summaryRow(label, value) {
  return `
    <div class="summary-row">
      <span class="summary-label">${label}</span>
      <span class="summary-value">${value}</span>
    </div>
  `;
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.go === "form") {
      fillForm(getSavedRequest());
    }
    navigate(button.dataset.go);
  });
});

backButton.addEventListener("click", () => history.back());

window.addEventListener("popstate", (event) => {
  navigate(event.state?.screenName || "home", false);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  const data = getFormData();
  const errors = validateForm(data);

  Object.entries(errors).forEach(([field, message]) => showError(field, message));

  if (Object.keys(errors).length > 0) {
    return;
  }

  saveRequest(data);
  navigate("summary");
});

form.neededBy.min = todayString();

const initialScreen = screens[location.hash.replace("#", "")]
  ? location.hash.replace("#", "")
  : "home";

history.replaceState({ screenName: initialScreen }, "", `#${initialScreen}`);
navigate(initialScreen, false);
