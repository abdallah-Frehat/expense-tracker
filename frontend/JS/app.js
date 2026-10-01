// fetch('http://localhost:3000/api/test-db')
//     .then(response => response.json())
//     .then(data => {
//         const box = document.getElementById('result-box'); 
//         if (!box) return;

//         if (data.success) {
//             box.className = 'alert alert-success';
//             box.innerHTML = `<strong>Connection successful</strong><br>${data.message}<br><small>الوقت: ${data.time}</small>`;
//         } else {
//             box.className = 'alert alert-danger';
//             box.innerHTML = `<strong>Failed to connect to the database</strong><br><small>${data.error}</small>`;
//         }
//     })
//     .catch(error => {
//         const box = document.getElementById('result-box');
//         if (!box) return;
//         box.className = 'alert alert-danger';
//         box.innerHTML = `<strong>Error connecting to the server</strong><br><small>${error.message}</small>`;
//         console.error('Error:', error);
//     });

const API_URL = 'http://localhost:3000/api/expenses';

const expenseForm = document.getElementById('expenseForm');
const expensesTableBody = document.getElementById('expensesTableBody');
const filterCategory = document.getElementById('filterCategory');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorAlert = document.getElementById('errorAlert');

const totalAmountEl = document.getElementById('totalAmount');
const totalCountEl = document.getElementById('totalCount');
const highestExpenseEl = document.getElementById('highestExpense');


function showToast(message, type = 'success') {
    const toastElement = document.getElementById('liveToast');
    const toastMessage = document.getElementById('toastMessage');

    if (!toastElement || !toastMessage) return;

    toastMessage.textContent = message;

    toastElement.className = `toast align-items-center text-white border-0 shadow-lg rounded-4 ${type === 'success' ? 'bg-success' : 'bg-danger'}`;

    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
}

function showError(message) {
    if (errorAlert) {
        errorAlert.textContent = message;
        errorAlert.classList.remove('d-none');
        setTimeout(() => {
            errorAlert.classList.add('d-none');
        }, 5000);
    }

    showToast(message, 'error');
}
function updateStatistics(expenses) {
    if (!expenses || expenses.length === 0) {
        if (totalAmountEl) totalAmountEl.textContent = '0.00';
        if (totalCountEl) totalCountEl.textContent = '0';
        if (highestExpenseEl) {
            highestExpenseEl.innerHTML = `0.00 <div class="text-muted fw-normal fs-6 mt-1">-</div>`;
        }
        return;
    }
    const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
    if (totalAmountEl) totalAmountEl.textContent = total.toFixed(2);

    if (totalCountEl) totalCountEl.textContent = expenses.length;

    let highest = expenses[0];
    expenses.forEach(item => {
        if (Number(item.amount) > Number(highest.amount)) {
            highest = item;
        }
    });

    if (highestExpenseEl) {
        highestExpenseEl.innerHTML = `
            ${Number(highest.amount).toFixed(2)}
            <div class="text-muted fw-normal fs-6 mt-1">${highest.title}</div>
        `;
    }
}

async function fetchExpenses() {
    try {
        if (loadingSpinner) loadingSpinner.classList.remove('d-none');

        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch expenses from server.');
        }

        allExpenses = await response.json();
        renderExpenses(allExpenses);
        updateStatistics(allExpenses);
    } catch (error) {
        console.error('Error:', error);
        showError('Could not connect to the server. Please make sure the backend is running.');
    } finally {
        if (loadingSpinner) loadingSpinner.classList.add('d-none');
    }
}

function renderExpenses(expenses) {
    if (!expensesTableBody) return;

    expensesTableBody.innerHTML = '';

    if (expenses.length === 0) {
        expensesTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No expenses found.</td></tr>`;
        return;
    }

    expenses.forEach(expense => {
        let badgeBg = 'bg-secondary';
        if (expense.category === 'Food') badgeBg = 'bg-success';
        else if (expense.category === 'Transport') badgeBg = 'bg-primary';
        else if (expense.category === 'Bills') badgeBg = 'bg-warning text-dark';
        else if (expense.category === 'Entertainment') badgeBg = 'bg-info text-dark';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="fw-semibold text-dark">${expense.title}</td>
            <td class="fw-bold text-success">$${Number(expense.amount).toFixed(2)}</td>
            <td><span class="badge ${badgeBg} px-3 py-2">${expense.category}</span></td>
            <td class="text-secondary">${expense.date ? expense.date.split('T')[0] : ''}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editExpense(${expense.id})">Edit</button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteExpense(${expense.id})">Delete</button>
            </td>
        `;
        expensesTableBody.appendChild(row);
    });
}

if (expenseForm) {
    expenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!expenseForm.checkValidity()) {
            e.stopPropagation();
            expenseForm.classList.add('was-validated');
            return;
        }

        expenseForm.classList.add('was-validated');

        const title = document.getElementById('title').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;

        if (isNaN(amount) || amount <= 0) {
            showError('Amount must be greater than 0.');
            return;
        }

        const newExpense = { title, amount, category, date };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newExpense)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to add expense.');
            }

            expenseForm.reset();
            expenseForm.classList.remove('was-validated');
            fetchExpenses();
            showToast('Expense added successfully ', 'success');
        } catch (error) {
            console.error('Error:', error);
            showError(error.message);
        }
    });
}

function searchExpenses() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();

    const filtered = allExpenses.filter(expense => {
        const title = (expense.title || '').toLowerCase();
        const category = (expense.category || '').toLowerCase();

        return title.includes(searchText) || category.includes(searchText);
    });

    renderExpenses(filtered);
}
// document.getElementById('searchInput').addEventListener('input', searchExpenses);

document.getElementById('searchBtn').addEventListener('click', searchExpenses);

document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchExpenses();
    }
})
function editExpense(id) {
    const expense = allExpenses.find(exp => exp.id === id);
    if (!expense) return;

    document.getElementById('editId').value = expense.id;
    document.getElementById('editTitle').value = expense.title;
    document.getElementById('editAmount').value = expense.amount;
    document.getElementById('editCategory').value = expense.category;
    document.getElementById('editDate').value = expense.date ? expense.date.split('T')[0] : '';

    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
}

const editExpenseForm = document.getElementById('editExpenseForm');
if (editExpenseForm) {
    editExpenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('editId').value;
        const title = document.getElementById('editTitle').value.trim();
        const amount = parseFloat(document.getElementById('editAmount').value);
        const category = document.getElementById('editCategory').value;
        const date = document.getElementById('editDate').value;

        if (!title || isNaN(amount) || amount <= 0 || !category || !date) {
            showError('Validation Error: Amount must be greater than 0.');
            return;
        }

        const updatedExpense = { title, amount, category, date };

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedExpense)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to update expense.');
            }

            const modalEl = document.getElementById('editModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();

            fetchExpenses();
            showToast('Expense updated successfully ', 'success');
        } catch (error) {
            console.error('Error:', error);
            showError(error.message);
        }
    });
}

async function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete expense.');
        }

        fetchExpenses();
        showToast('Expense deleted successfully ', 'success');
    } catch (error) {
        console.error('Error:', error);
        showError('Could not delete the expense.');
    }
}

if (filterCategory) {
    filterCategory.addEventListener('change', (e) => {
        const selectedCategory = e.target.value;
        if (selectedCategory === 'All') {
            renderExpenses(allExpenses);
            updateStatistics(allExpenses);
        } else {
            const filtered = allExpenses.filter(exp => exp.category === selectedCategory);
            renderExpenses(filtered);
            updateStatistics(filtered);
        }
    });
}



const darkModeToggle = document.getElementById('darkModeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');

function setTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);

    if (theme === 'dark') {
        if (themeText) themeText.textContent = 'Light Mode';
        if (themeIcon) themeIcon.className = 'fas fa-sun text-warning';
    } else {
        if (themeText) themeText.textContent = 'Dark Mode';
        if (themeIcon) themeIcon.className = 'fas fa-moon';
    }
}

const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);

        showToast(newTheme === 'dark' ? 'Dark mode enabled ' : 'Light mode enabled ', 'success');
    });
}

document.addEventListener('DOMContentLoaded', fetchExpenses);