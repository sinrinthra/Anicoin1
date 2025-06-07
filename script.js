let balance = 10000;
let stock = {
  price: 100,
  buys: 0,
  sells: 0,
  priceHistory: Array(30).fill(100)
};

const priceDisplay = document.getElementById("price");
const balanceEl = document.getElementById("balance");
const actionLog = document.getElementById("actionLog");

function buy() {
  if (balance < stock.price) {
    actionLog.textContent = "Not enough balance.";
    return;
  }
  balance -= stock.price;
  stock.buys++;
  balanceEl.textContent = balance.toFixed(2);
  actionLog.textContent = "Bought 1 share";
}

function sell() {
  balance += stock.price;
  stock.sells++;
  balanceEl.textContent = balance.toFixed(2);
  actionLog.textContent = "Sold 1 share";
}

// Chart.js setup
const ctx = document.getElementById('priceChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: Array.from({length: 30}, (_, i) => i + ":00"),
    datasets: [{
      label: 'ANIC Price',
      data: stock.priceHistory,
      borderColor: 'rgb(255, 205, 86)',
      tension: 0.2
    }]
  },
  options: {
    responsive: true,
    animation: false
  }
});

// Update price based on buys/sells every 10 seconds
setInterval(() => {
  const delta = stock.buys - stock.sells;
  stock.price += delta * 0.5;
  stock.price = Math.max(stock.price, 1);
  stock.buys = 0;
  stock.sells = 0;

  stock.priceHistory.push(stock.price);
  if (stock.priceHistory.length > 30) stock.priceHistory.shift();

  priceDisplay.textContent = stock.price.toFixed(2);
  chart.data.datasets[0].data = stock.priceHistory;
  chart.update();
}, 10000);
