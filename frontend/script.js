const API_URL = "https://sales-tracker-api.onrender.com";

let editId = null;

async function loadData() {
  const res = await fetch(`${API_URL}/api/data`);
  let data = await res.json();

  const sales = data.map(d => d.sales);
  const expenses = data.map(d => d.expenses);
  const labels = data.map(d => new Date(d.date).toLocaleDateString());

  if (window.myChart) window.myChart.destroy();
  const ctx = document.getElementById("chart").getContext("2d");
  window.myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Sales", data: sales, backgroundColor: "#4caf50" },
        { label: "Expenses", data: expenses, backgroundColor: "#f44336" }
      ]
    }
  });

  const totalSales = sales.reduce((a, b) => a + b, 0);
  const totalExpenses = expenses.reduce((a, b) => a + b, 0);
  const profitTotal = totalSales - totalExpenses;
  const avgSales = (totalSales / sales.length || 0).toFixed(2);
  const avgExpenses = (totalExpenses / expenses.length || 0).toFixed(2);

  document.getElementById("summary").innerHTML = `
    <p><strong>Total Sales:</strong> ₱${totalSales.toFixed(2)}</p>
    <p><strong>Total Expenses:</strong> ₱${totalExpenses.toFixed(2)}</p>
    <p><strong>Profit:</strong> ₱${profitTotal.toFixed(2)}</p>
    <p><strong>Average Sales:</strong> ₱${avgSales}</p>
    <p><strong>Average Expenses:</strong> ₱${avgExpenses}</p>
  `;

  const gauge = document.getElementById("gauge");
  gauge.style.backgroundColor = profitTotal > 0 ? "lightgreen" : profitTotal < 0 ? "lightcoral" : "lightgray";

  const tableBody = document.getElementById("records");
  tableBody.innerHTML = "";
  data.forEach(item => {
    const profit = item.sales - item.expenses;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${new Date(item.date).toLocaleDateString()}</td>
      <td>₱${item.sales}</td>
      <td>₱${item.expenses}</td>
      <td>₱${profit}</td>
      <td>
        <button onclick="editEntry('${item._id}')">✏️</button>
        <button onclick="deleteEntry('${item._id}')">🗑️</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

async function addData() {
  const date = document.getElementById("date").value;
  const sales = document.getElementById("sales").value;
  const expenses = document.getElementById("expenses").value;

  await fetch(`${API_URL}/api/data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, sales, expenses })
  });

  document.getElementById("data-form").reset();
  loadData();
}

async function deleteEntry(id) {
  if (confirm("Delete this record?")) {
    await fetch(`${API_URL}/api/data/${id}`, { method: "DELETE" });
    loadData();
  }
}

async function editEntry(id) {
  const res = await fetch(`${API_URL}/api/data`);
  const data = await res.json();
  const entry = data.find(d => d._id === id);

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

  await fetch(`${API_URL}/api/data/${editId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, sales, expenses })
  });

  document.getElementById("data-form").reset();
  editId = null;
  document.getElementById("submit-btn").style.display = "inline";
  document.getElementById("update-btn").style.display = "none";
  loadData();
}

loadData();
