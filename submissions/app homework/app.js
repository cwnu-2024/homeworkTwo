function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(screenId).style.display = 'block';
    if(screenId === 'summary-screen') renderHistory();
    if(screenId === 'home-screen') updateHomeTotal();
}

const form = document.getElementById('expense-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) {
        const expense = {
            name: document.getElementById('itemName').value,
            amount: parseFloat(document.getElementById('amount').value),
            category: document.getElementById('category').value,
            date: document.getElementById('date').value
        };
        const data = JSON.parse(localStorage.getItem('expenses') || '[]');
        data.push(expense);
        localStorage.setItem('expenses', JSON.stringify(data));
        form.reset();
        showScreen('summary-screen');
    }
});

function validateForm() {
    let isValid = true;
    const name = document.getElementById('itemName').value;
    const amount = document.getElementById('amount').value;
    const cat = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const today = new Date().toISOString().split('T')[0];

    document.querySelectorAll('.error').forEach(e => e.innerText = "");

    if (!name) { document.getElementById('name-err').innerText = "Name is required"; isValid = false; }
    if (!amount || amount <= 0) { document.getElementById('amount-err').innerText = "Enter positive amount"; isValid = false; }
    if (!cat) { document.getElementById('cat-err').innerText = "Select a category"; isValid = false; }
    if (!date || date > today) { document.getElementById('date-err').innerText = "Date cannot be in future"; isValid = false; }
    
    return isValid;
}

function renderHistory() {
    const list = document.getElementById('history-list');
    const data = JSON.parse(localStorage.getItem('expenses') || '[]');
    list.innerHTML = data.map(item => `
        <div class="history-item">
            <span><strong>${item.name}</strong><br><small>${item.category}</small></span>
            <span>$${item.amount.toFixed(2)}</span>
        </div>
    `).join('') || "<p>No expenses logged.</p>";
}

function updateHomeTotal() {
    const data = JSON.parse(localStorage.getItem('expenses') || '[]');
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    document.getElementById('total-display').innerText = `$${total.toFixed(2)}`;
}

// Initialize
updateHomeTotal();