// Get HTML elements

const transactionForm = document.getElementById("transactionForm");

const transactionTable = document.getElementById("transactionTable");

const filterType = document.getElementById("filterType");

const searchInput = document.getElementById("searchInput");


// Load transactions from localStorage

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];


// Add transaction

transactionForm.addEventListener("submit", function(event) {

    event.preventDefault();


    // Get form values

    const type = document.getElementById("type").value;

    const amount = Number(document.getElementById("amount").value);

    const category = document.getElementById("category").value.trim();

    const description = document.getElementById("description").value.trim();

    const date = document.getElementById("date").value;


    // Validate form

    if (!type || !category || !description || !date || amount <= 0 || !Number.isFinite(amount)) {

        alert("Please fill in all fields correctly!");

        return;

    }


    // Create transaction object

    const transaction = {

        id: Date.now(),

        type: type,

        amount: amount,

        category: category,

        description: description,

        date: date

    };


    // Add transaction to array

    transactions.push(transaction);


    // Save transactions

    saveTransactions();


    // Update table and totals

    displayTransactions();

    calculateTotals();


    // Clear form

    transactionForm.reset();

});


// Save transactions in localStorage

function saveTransactions() {

    localStorage.setItem("transactions", JSON.stringify(transactions));

}


// Display transactions in the table

function displayTransactions() {

    transactionTable.innerHTML = "";


    // Get selected filter

    const selectedType = filterType.value;


    // Get search value

    const searchValue = searchInput.value.toLowerCase().trim();


    // Filter and search transactions

    const filteredTransactions = transactions.filter(function(transaction) {

        const matchesType =

            selectedType === "All" || transaction.type === selectedType;


        const matchesSearch =

            transaction.description.toLowerCase().includes(searchValue) ||

            transaction.category.toLowerCase().includes(searchValue);


        return matchesType && matchesSearch;

    });


    // Check whether transactions are available

    if (filteredTransactions.length === 0) {

        const row = document.createElement("tr");

        const cell = document.createElement("td");

        cell.colSpan = 6;

        cell.className = "empty-message";

        cell.textContent = "No transactions found.";

        row.appendChild(cell);

        transactionTable.appendChild(row);

        return;

    }


    // Display each transaction

    filteredTransactions.forEach(function(transaction) {

        const row = document.createElement("tr");


        // Date

        const dateCell = document.createElement("td");

        dateCell.textContent = transaction.date;


        // Description

        const descriptionCell = document.createElement("td");

        descriptionCell.textContent = transaction.description;


        // Type

        const typeCell = document.createElement("td");

        typeCell.textContent = transaction.type;


        if (transaction.type === "Income") {

            typeCell.className = "income-text";

        }

        else {

            typeCell.className = "expense-text";

        }


        // Category

        const categoryCell = document.createElement("td");

        categoryCell.textContent = transaction.category;


        // Amount

        const amountCell = document.createElement("td");

        amountCell.textContent = "LKR " + transaction.amount.toFixed(2);


        // Action button

        const actionCell = document.createElement("td");

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.className = "btn btn-danger btn-sm";


        deleteButton.addEventListener("click", function() {

            deleteTransaction(transaction.id);

        });


        actionCell.appendChild(deleteButton);


        // Add cells to row

        row.appendChild(dateCell);

        row.appendChild(descriptionCell);

        row.appendChild(typeCell);

        row.appendChild(categoryCell);

        row.appendChild(amountCell);

        row.appendChild(actionCell);


        // Add row to table

        transactionTable.appendChild(row);

    });

}


// Calculate totals

function calculateTotals() {

    let totalIncome = 0;

    let totalExpenses = 0;


    transactions.forEach(function(transaction) {

        if (transaction.type === "Income") {

            totalIncome += transaction.amount;

        }

        else if (transaction.type === "Expense") {

            totalExpenses += transaction.amount;

        }

    });


    // Calculate balance

    let balance = totalIncome - totalExpenses;


    // Update summary cards

    document.getElementById("totalIncome").innerText =

        "LKR " + totalIncome.toFixed(2);


    document.getElementById("totalExpenses").innerText =

        "LKR " + totalExpenses.toFixed(2);


    document.getElementById("balance").innerText =

        "LKR " + balance.toFixed(2);

}


// Delete a transaction

function deleteTransaction(id) {

    transactions = transactions.filter(function(transaction) {

        return transaction.id !== id;

    });


    // Save updated transactions

    saveTransactions();


    // Update table and totals

    displayTransactions();

    calculateTotals();

}


// Filter transactions

filterType.addEventListener("change", function() {

    displayTransactions();

});


// Search transactions

searchInput.addEventListener("input", function() {

    displayTransactions();

});


// Display saved transactions when page loads

displayTransactions();

calculateTotals();