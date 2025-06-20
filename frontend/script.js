const API_URL = "https://sales-tracker-api.onrender.com";
let editId = null;

async function loadData() {
  const res = await fetch(`${API_URL}/api/data`);
  let data = await res.json();

  const sortBy = document.getElementById("sortBy").value;
  if (sortBy === "sales") data.sort((a, b) => b.sales - a.sales);
  else if (sortBy === "expenses") data.sort((a, b) => b.expenses - a.expenses);
  else if (sortBy === "profit") data.sort((a, b) => (b.sales - b.expenses) - (a.sales - a.expenses));

  const sales = data.map(d => d.sales);
  const expenses = data.map(d => d.expenses);
  const profit = data.map(d => d.sales - d.expenses);
  const labels = data.map(d => new Date(d.date).toLocaleDateString());

  if (window.myChart) window.myChart.destroy();
  const ctx = document.getElementById("chart").getContext("2d");
  window.myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "Sales", data: sales, borderColor: "green", backgroundColor: "transparent" },
        { label: "Expenses", data: expenses, borderColor: "red", backgroundColor: "transparent" }
      ]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });

  const totalSales = sales.reduce((a, b) => a + b, 0);
  const totalExpenses = expenses.reduce((a, b) => a + b, 0);
  const profitTotal = totalSales - totalExpenses;

  document.getElementById("summary").innerHTML = `
    <p><strong>Total Sales:</strong> ₱${totalSales.toFixed(2)}</p>
    <p><strong>Total Expenses:</strong> ₱${totalExpenses.toFixed(2)}</p>
    <p><strong>Profit:</strong> ₱${profitTotal.toFixed(2)}</p>
    <p><strong>Average Sales:</strong> ₱${(totalSales / sales.length || 0).toFixed(2)}</p>
    <p><strong>Average Expenses:</strong> ₱${(totalExpenses / expenses.length || 0).toFixed(2)}</p>
  `;

  document.getElementById("gauge").style.backgroundColor =
    profitTotal > 0 ? "lightgreen" : profitTotal < 0 ? "lightcoral" : "lightgray";

  const tableBody = document.getElementById("records");
  tableBody.innerHTML = "";
  data.forEach(item => {
    const profit = item.sales - item.expenses;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td title="${item.remarks || ''}">
        ${new Date(item.date).toLocaleDateString()}
        ${item.collectable ? ' <span style="color: orange;">🟡 Unpaid</span>' : ''}
      </td>
      <td>₱${item.sales.toFixed(2)}</td>
      <td>₱${item.expenses.toFixed(2)}</td>
      <td>₱${profit.toFixed(2)}</td>
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
  const sales = parseFloat(document.getElementById("sales").value);
  const expenses = parseFloat(document.getElementById("expenses").value);
  const collectable = document.getElementById("collectable").checked;
  const remarks = document.getElementById("remarks").value;

  await fetch(`${API_URL}/api/data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, sales, expenses, collectable, remarks })
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
  document.getElementById("collectable").checked = entry.collectable || false;
  document.getElementById("remarks").value = entry.remarks || '';
  editId = id;

  document.getElementById("submit-btn").style.display = "none";
  document.getElementById("update-btn").style.display = "inline";
}

async function updateData() {
  const date = document.getElementById("date").value;
  const sales = parseFloat(document.getElementById("sales").value);
  const expenses = parseFloat(document.getElementById("expenses").value);
  const collectable = document.getElementById("collectable").checked;
  const remarks = document.getElementById("remarks").value;

  await fetch(`${API_URL}/api/data/${editId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, sales, expenses, collectable, remarks })
  });

  document.getElementById("data-form").reset();
  editId = null;
  document.getElementById("submit-btn").style.display = "inline";
  document.getElementById("update-btn").style.display = "none";
  loadData();
}

loadData();
