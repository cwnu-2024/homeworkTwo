
// Navigation
function goHome() {
  window.location.href = "index.html";
}

// FORM HANDLING
const form = document.getElementById("expenseForm");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const amount = document.getElementById("amount").value;
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const notes = document.getElementById("notes").value.trim();
    const error = document.getElementById("error");

    error.innerText = "";

    // VALIDATION
    if (!title || !amount || !date || !category) {
      error.innerText = "All required fields must be filled.";
      return;
    }

    if (title.length < 3) {
      error.innerText = "Title must be at least 3 characters.";
      return;
    }

    if (amount <= 0) {
      error.innerText = "Amount must be greater than 0.";
      return;
    }

    // DATA OBJECT
    const expense = {
      title,
      amount,
      date,
      category,
      notes
    };

    // GET OLD DATA
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    // ADD NEW
    expenses.push(expense);

    // SAVE
    localStorage.setItem("expenses", JSON.stringify(expenses));

    window.location.href = "summary.html";
  });
}


const display = document.getElementById("dataDisplay");
const totalDisplay = document.getElementById("total");

if (display) {
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  let total = 0;

  if (expenses.length === 0) {
    display.innerHTML = "<p>No expenses found.</p>";
    totalDisplay.innerText = "Total: 0";
  } else {
    display.innerHTML = expenses.map((exp, index) => {
      total += Number(exp.amount);

      return `
        <div class="card">
          <p><strong>Title:</strong> ${exp.title}</p>
          <p><strong>Amount:</strong> ${exp.amount}</p>
          <p><strong>Date:</strong> ${exp.date}</p>
          <p><strong>Category:</strong> ${exp.category}</p>
          <p><strong>Notes:</strong> ${exp.notes || "None"}</p>

          <button onclick="deleteExpense(${index})">Delete</button>
        </div>
      `;
    }).join("");

    totalDisplay.innerText = "Total: " + total;
  }
}

// DELETE FUNCTION
function deleteExpense(index) {
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  expenses.splice(index, 1);

  localStorage.setItem("expenses", JSON.stringify(expenses));

  location.reload();
}
function filterExpenses() {
  const filterValue = document.getElementById("filter").value;
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  let filtered = filterValue === "all"
    ? expenses
    : expenses.filter(e => e.category === filterValue);

  const display = document.getElementById("dataDisplay");
  const totalDisplay = document.getElementById("total");

  let total = 0;

  if (filtered.length === 0) {
    display.innerHTML = "<p>No matching expenses.</p>";
    totalDisplay.innerText = "Total: 0";
    return;
  }

  display.innerHTML = filtered.map((exp, index) => {
    total += Number(exp.amount);

    return `
      <div class="card">
        <p><strong>Title:</strong> ${exp.title}</p>
        <p><strong>Amount:</strong> ${exp.amount}</p>
        <p><strong>Date:</strong> ${exp.date}</p>
        <p><strong>Category:</strong> ${exp.category}</p>
        <p><strong>Notes:</strong> ${exp.notes || "None"}</p>
      </div>
    `;
  }).join("");

  totalDisplay.innerText = "Total: " + total;
}

function renderChart(expenses) {
  const ctx = document.getElementById("expenseChart");

  let categories = {};

  expenses.forEach(exp => {
    if (!categories[exp.category]) {
      categories[exp.category] = 0;
    }
    categories[exp.category] += Number(exp.amount);
  });

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(categories),
      datasets: [{
        label: 'Expenses by Category',
        data: Object.values(categories)
      }]
    }
  });
}
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
renderChart(expenses);

function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  doc.setFontSize(16);
  doc.text("Expense Report", 10, 10);

  let y = 20;

  expenses.forEach((exp, index) => {
    doc.setFontSize(12);
    doc.text(
      `${index + 1}. ${exp.title} | ${exp.amount} | ${exp.date} | ${exp.category}`,
      10,
      y
    );
    y += 10;
  });

  doc.save("expenses.pdf");
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");

  // save preference
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("mode", "dark");
  } else {
    localStorage.setItem("mode", "light");
  }
}

// load saved mode
window.onload = function () {
  const mode = localStorage.getItem("mode");

  if (mode === "dark") {
    document.body.classList.add("dark");
  }
};