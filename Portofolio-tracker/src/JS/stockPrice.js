async function getStockDetailsLatestPrice() {
  const selectedTrade = JSON.parse(localStorage.getItem("selectedTrade"));

  if (!selectedTrade) {
    console.error("No trade selected.");
    return;
  }

  const symbol = selectedTrade.security;

  const apiKey = "8JXGIY17U402Y1XQ";
  const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&outputsize=compact&apikey=${apiKey}`;

  try {
    const stockData = await fetch(apiUrl);
    const res = await stockData.json();

    console.log("stockData", res);

    stockPriceData = res;
    const series = Object.values(stockPriceData)[1];
    const metaData = Object.values(stockPriceData)[0];
    const stockSymbol = Object.values(metaData)[1];
    const lastRefreshed = Object.values(metaData)[2];
    const lastPrice = Object.values(series)[Object.values(series).length - 1];
    const closedPrice = Object.values(lastPrice)[3];

    console.log("buyPrice", selectedTrade.price);
    console.log("quantity", selectedTrade.quantity);
    console.log("total", selectedTrade.total);
    console.log("series", series);
    console.log("stockSymbol", stockSymbol);
    console.log("lastPrice", lastPrice);
    console.log("closedPrice", closedPrice);
    console.log("metaData", metaData);
    console.log("lastRefreshed", lastRefreshed);

    let profitLoss = closedPrice - selectedTrade.price;
    console.log("profit/loss:prShare", profitLoss);
    let totalProfitLoss =
      closedPrice * selectedTrade.quantity - selectedTrade.total;
    console.log("Total profit/loss:", totalProfitLoss, "$");

    const profitEl = document.querySelector("#widget-profit");

    if (profitEl !== null) {
      profitEl.textContent = totalProfitLoss;

      if (totalProfitLoss >= 0) {
        profitEl.style.color = "green";
      } else if (totalProfitLoss <= 0) {
        profitEl.style.color = "red";
      } else {
        profitEl.style.color = "";
      }
    }

    const widgetContainer = document.querySelector(".widget-container");
    if (widgetContainer !== null) {
      widgetContainer.innerHTML = "";

      let html = "";
      html += `<div class="widget-entry">
        <table>
          <tr>
            <th><h2 class=widget-title>${symbol}</h2></th>
            <th><span>Quantity:${selectedTrade.quantity}</span></th>
            <th>Last Price:<span id="widget-profit">${closedPrice}$</span></th>
            <th>
              <div>Total Profit/Loss: <span id="widget-profit">${totalProfitLoss}$</span></div>
            </th>
          </tr>
          <tr>
            <td><span id="colspan2" colspan="2">Last Refreshed: ${lastRefreshed}</span></td>
          </tr>
        </table>
      </div>`;

      widgetContainer.innerHTML += html;
    }
  } catch (error) {
    console.error("Error fetching stock data:", error);
  }
}

getStockDetailsLatestPrice();
