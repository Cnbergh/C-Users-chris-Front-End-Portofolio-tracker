// import { addToLocalStorage } from "./localStorage.js";
const apiKey = "8JXGIY17U402Y1XQ";
const watchListContainer = document.querySelector(".watch-list-container");
const listContainer = document.querySelector(".list-container");
const item = document.getElementById("registration-entry-item");
const form = document.getElementById("registration-form");
let stockPriceData;

const stockWatchList = [
  {
    id: "Alphabet",
    symbol: "GOOGL",
    quantity: 100,
    buyPrice: 150,
    lastPrice: 0,
    lastPL: 0,
    isProfitable: false,
  },
  {
    id: "Microsoft",
    symbol: "MSFT",
    quantity: 100,
    buyPrice: 150,
    lastPrice: 0,
    lastPL: 0,
    isProfitable: false,
  },
  {
    id: "Apple",
    symbol: "AAPL",
    quantity: 100,
    buyPrice: 150,
    lastPrice: 0,
    lastPL: 0,
    isProfitable: false,
  },
];

async function getWatchList() {
  for (var i = 0; i < stockWatchList.length; i++) {
    if ("symbol" in stockWatchList[i]) {
      let apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockWatchList[i].symbol}&interval=5min&outputsize=compact&apikey=${apiKey}`;
      try {
        const stockData = await fetch(apiUrl);
        const res = await stockData.json();

        console.log("stockData", res);

        stockPriceData = res;

        const series = Object.values(stockPriceData)[1];
        const metaData = Object.values(stockPriceData)[0];
        const stockSymbol = Object.values(metaData)[1];
        const lastRefreshed = Object.values(metaData)[2];
        const lastPrice =
          Object.values(series)[Object.values(series).length - 1];
        const closedPrice = Object.values(lastPrice)[3];

        console.log("buyPrice", stockPriceData);
        console.log("series", series);
        console.log("stockSymbol", stockSymbol);
        console.log("lastPrice", lastPrice);
        console.log("closedPrice", closedPrice);
        console.log("metaData", metaData);
        console.log("lastRefreshed", lastRefreshed);

        let html = "";

        html += `<div class="watch-list-item">
          <table>
            <tr>
              <td><span>${stockWatchList[i].symbol}</span></td>
              <td><span>${closedPrice}</span></td>
            </tr>
            <tr>
              <td id="colspan2" colspan="2"><div>Last refresh: ${lastRefreshed}</div></td>
            </tr>
          </table>
        </div>`;

        watchListContainer.innerHTML += html;
      } catch (error) {
        console.log("error fetchdata", error);
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getWatchList();
});

async function updateStockPrice(symbol) {
  console.log("updateStockPrice symbol", symbol);
  const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&outputsize=compact&apikey=${apiKey}`;

  try {
    const stockData = await fetch(apiUrl);
    const res = await stockData.json();

    console.log("stockData", res);

    stockPriceData = res;

    return res;
  } catch (error) {
    console.log("error fetchdata", error);
  }
}

function onGetPrice(symbol) {
  return updateStockPrice(symbol);
}

function getDataFromLocalStorage() {
  return JSON.parse(localStorage.getItem("trades")) || [];
}

function addToLocalStorage(data) {
  let trades = getDataFromLocalStorage();
  trades.push(data);
  console.log("addToLocalStorage trades", trades);
  localStorage.setItem("trades", JSON.stringify(trades));
  refreshTradeList();
}

function getDetails(symbol) {
  onGetPrice(symbol);

  const trades = getDataFromLocalStorage();
  const selectedTrade = trades.find((trade) => trade.security === symbol);

  localStorage.setItem("selectedTrade", JSON.stringify(selectedTrade));

  document.location.href = "details.html";
}

const searchInput = document.querySelector("#security");
const searchResults = document.querySelector("#search-results");

searchInput.addEventListener("input", debounce(searchStocks, 500));

function debounce(func, delay) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

async function searchStocks() {
  const searchTerm = searchInput.value;
  const response = await fetch(
    `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchTerm}&apikey=${apiKey}`
  );
  const data = await response.json();
  const searchResults = data.bestMatches.map((match) => ({
    symbol: match["1. symbol"],
    name: match["2. name"],
  }));
  updateSearchResults(searchResults);
}

function updateSearchResults(results) {
  const searchList = document.querySelector("#search-results");
  searchList.innerHTML = "";
  results.forEach((result) => {
    const li = document.createElement("li");
    li.textContent = `${result.symbol} - ${result.name}`;
    searchList.appendChild(li);
  });
}

document
  .querySelector("#security")
  .addEventListener("input", debounce(searchStocks));
document.querySelector("#security").addEventListener("focusout", () => {
  document.querySelector("#search-results").innerHTML = "";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const trades = getDataFromLocalStorage();

  console.log("event", event.target);

  const formData = new FormData(event.target);

  const data = {
    id: trades.length + 1,
    date: formData.get("date"),
    security: formData.get("security"),
    action: formData.get("action"),
    quantity: formData.get("quantity"),
    price: formData.get("price"),
    total: formData.get("total"),
    broker: formData.get("broker"),
  };

  if (data.id) {
    addToLocalStorage(data);
  }
  form.reset();
});

function refreshTradeList() {
  const trades = getDataFromLocalStorage();

  console.log("trades", trades);

  listContainer.innerHTML = "";

  trades.forEach((trade) => {
    let html = "";

    html += `<div class="registration-entry">
    <table>
    <tr id="registration-entry-item" onclick="getDetails('${trade.security}')">
      <td><span>${trade.date}</span></td>
      <td><h3>${trade.security}</h3></td>
      <td><span>${trade.action}</span></td>
      <td><span>${trade.quantity}</span></td>
      <td><span>${trade.price}</span></td>
      <td><span>${trade.total}</span></td>
      <td><h3>${trade.broker}</h3></td>
      </tr>
      </table>
    </div>`;

    listContainer.innerHTML += html;
  });
}
