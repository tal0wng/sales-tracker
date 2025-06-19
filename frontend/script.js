const ctx = document.getElementById('lineChart').getContext('2d');
let chart;

async function fetchRecords() {
  const start = document.getElementById('startDate').value;
  const end = document.getElementById('endDate').value;
  if (!start || !end) return;

  const res = await fetch(`http://localhost:5000/api/records?start=${start}&end=${end}`);
  const data = await res.json();

  const dates = data.map(r => new Date(r.date).toLocaleDateString());
  const sales = data.map(r => r.sales);
  const expenses = data.map(r => r.expenses);
  const profits = sales.map((s, i) => s - expenses[i]);

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        { label: 'Sales', data: sales, borderColor: 'green', fill: false },
        { label: 'Expenses', data: expenses, borderColor: 'red', fill: false }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // Totals
  const totalSales = sales.reduce((a, b) => a + b, 0);
  const totalExpenses = expenses.reduce((a, b) => a + b, 0);
  const profit = totalSales - totalExpenses;
  const count = sales.length || 1;
  const avgSales = totalSales / count;
  const avgExpenses = totalExpenses / count;

  document.getElementById('totalSales').textContent = totalSales.toFixed(2);
  document.getElementById('totalExpenses').textContent = totalExpenses.toFixed(2);
  document.getElementById('profit').textContent = profit.toFixed(2);
  document.getElementById('averageSales').textContent = avgSales.toFixed(2);
  document.getElementById('averageExpenses').textContent = avgExpenses.toFixed(2);

  // Table
  const tableBody = document.querySelector('#recordTable tbody');
  tableBody.innerHTML = '';
  data.forEach((r, i) => {
    const tr = document.createElement('tr');
    const profit = sales[i] - expenses[i];
    tr.innerHTML = `
      <td>${new Date(r.date).toLocaleDateString()}</td>
      <td>₱${r.sales.toFixed(2)}</td>
      <td>₱${r.expenses.toFixed(2)}</td>
      <td>₱${profit.toFixed(2)}</td>
      <td>
        <button onclick='editRecord(${JSON.stringify(r)})'>✏️</button>
        <button onclick='deleteRecord("${r._id}")'>🗑️</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

document.getElementById('recordForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const id = document.getElementById('recordId').value;
  const payload = {
    date: document.getElementById('date').value,
    sales: parseFloat(document.getElementById('sales').value),
    expenses: parseFloat(document.getElementById('expenses').value)
  };

  const method = id ? 'PUT' : 'POST';
  const url = id ? `http://localhost:5000/api/records/${id}` : 'http://localhost:5000/api/records';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  alert(id ? '✅ Record updated!' : '✅ Record added!');
  this.reset();
  document.getElementById('cancelEdit').style.display = 'none';
  fetchRecords();
});

function editRecord(record) {
  document.getElementById('recordId').value = record._id;
  document.getElementById('date').value = record.date.split('T')[0];
  document.getElementById('sales').value = record.sales;
  document.getElementById('expenses').value = record.expenses;
  document.getElementById('cancelEdit').style.display = 'inline';
}

function deleteRecord(id) {
  if (confirm('Are you sure you want to delete this record?')) {
    fetch(`http://localhost:5000/api/records/${id}`, { method: 'DELETE' })
      .then(() => {
        alert('🗑️ Record deleted');
        fetchRecords();
      });
  }
}

document.getElementById('cancelEdit').addEventListener('click', () => {
  document.getElementById('recordForm').reset();
  document.getElementById('recordId').value = '';
  document.getElementById('cancelEdit').style.display = 'none';
});
