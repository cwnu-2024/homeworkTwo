const form = document.getElementById('expenseForm');

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('itemName').value;
        const amount = document.getElementById('amount').value;
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;

        // Validation Rules
        let isValid = true;
        if (name.length < 3) {
            document.getElementById('nameError').innerText = "Min 3 characters required!";
            isValid = false;
        } else {
            document.getElementById('nameError').innerText = "";
        }

        if (amount <= 0) {
            document.getElementById('amountError').innerText = "Amount must be positive!";
            isValid = false;
        }

        if (isValid) {
            const expense = { name, amount, category, date };
            let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
            expenses.push(expense);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            
            alert("Expense Saved!");
            window.location.href = 'summary.html';
        }
    });
}

function displayExpenses() {
    const container = document.getElementById('summaryContainer');
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    
    if (expenses.length === 0) {
        container.innerHTML = "<p>No expenses recorded yet.</p>";
        return;
    }

    container.innerHTML = expenses.map(item => `
        <div class="expense-item">
            <strong>${item.name}</strong> - $${item.amount}<br>
            <small>${item.category} | ${item.date}</small>
        </div>
    `).join('');
}

function clearData() {
    localStorage.removeItem('expenses');
    location.reload();
}