const API_URL = "https://sales-tracker-api.onrender.com"; // your live backend URL

// Fetch and display data
async function loadData() {
  const res = await fetch(`${API_URL}/api/data`);
  const data = await res.json();

  const sales = data.map(item => item.sales);
  const expenses = data.map(item => item.expenses);
  const profit = data.map(item => item.sales - item.expenses);
  const labels = data.map(item => new Date(item.date).toLocaleDateString());

  // Render Bar Chart
  const ctx = document.getElementById("chart").getContext("2d");
  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Sales",
          data: sales,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
        {
          label: "Expenses",
          data: expenses,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    },
  });

  // Calculate and show summary
  const totalSales = sales.reduce((a, b) => a + b, 0);
  const totalExpenses = expenses.reduce((a, b) => a + b, 0);
  const averageSales = (totalSales / sales.length).toFixed(2);
  const averageExpenses = (totalExpenses / expenses.length).toFixed(2);
  const profitTotal = totalSales - totalExpenses;

  document.getElementById("summary").innerHTML = `
    <p><strong>Total Sales:</strong> ₱${totalSales}</p>
    <p><strong>Total Expenses:</strong> ₱${totalExpenses}</p>
    <p><strong>Average Sales:</strong> ₱${averageSales}</p>
    <p><strong>Average Expenses:</strong> ₱${averageExpenses}</p>
    <p><strong>Profit:</strong> ₱${profitTotal}</p>
  `;

  // Update Profit Gauge
  const gauge = document.getElementById("gauge");
  if (profitTotal > 0) {
    gauge.style.backgroundColor = "lightgreen";
  } else if (profitTotal < 0) {
    gauge.style.backgroundColor = "lightcoral";
  } else {
    gauge.style.backgroundColor = "lightgray";
  }

  // Populate records table
  const tableBody = document.getElementById("records");
  tableBody.innerHTML = "";
  data.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${new Date(item.date).toLocaleDateString()}</td>
      <td>₱${item.sales}</td>
      <td>₱${item.expenses}</td>
      <td>
        <button onclick="editEntry('${item._id}')">✏️</button>
        <button onclick="deleteEntry('${item._id}')">🗑️</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// Add new record
async function addData() {
  const date = document.getElementById("date").value;
  const sales = document.getElementById("sales").value;
  const expenses = document.getElementById("expenses").value;

  if (!date || !sales || !expenses) return alert("Please complete the form.");

  await fetch(`${API_URL}/api/data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, sales, expenses }),
  });

  document.getElementById("data-form").reset();
  loadData();
}

// Delete record
async function deleteEntry(id) {
  if (confirm("Are you sure you want to delete this entry?")) {
    await fetch(`${API_URL}/api/data/${id}`, { method: "DELETE" });
    loadData();
  }
}

// Edit record (prefill form and update)
let editId = null;

async function editEntry(id) {
  const res = await fetch(`${API_URL}/api/data`);
  const data = await res.json();
  const entry = data.find(d => d._id === id);
  if (!entry) return;

  document.getElementById("date").value = entry.date.split("T")[0];
  document.getElementById("sales").value = entry.sales;
  document.getElementById("expenses").value = entry.expenses;
  editId = id;

  document.getElementById("submit-btn").style.display = "none";
  document.getElementById("update-btn").style.display = "inline";
}

async function updateData() {
  const date = document.getElementById("date").value;
  const sales = document.getElementById("sales").value;
  const expenses = document.getElementById("expenses").value;

  if (!editId) return alert("No entry selected for update.");

  await fetch(`${API_URL}/api/data/${editId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, sales, expenses }),
  });

  document.getElementById("data-form").reset();
  editId = null;
  document.getElementById("submit-btn").style.display = "inline";
  document.getElementById("update-btn").style.display = "none";
  loadData();
}

loadData();
