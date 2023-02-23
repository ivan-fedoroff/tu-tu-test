import onChange from "on-change";
import axios from "axios";
import renderPagination from "./renderPagination.js";

const renderTable = (data) => {
  const htmlRows = data.map(
    (client) => `<tr>
    <td>${client.id}</td>
    <td>${client.firstName}</td>
    <td>${client.lastName}</td>
    <td>${client.email}</td>
    <td>${client.phone}</td>
    <td>${client.adress.streetAddress}</td>
    <td>${client.adress.city}</td>
    <td>${client.adress.state}</td>
    <td>${client.adress.zip}</td>
    <td>${client.description}</td>
  </tr>`
  );
  return htmlRows.join("\n");
};

const urlForShort = 'http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&adress=%7BaddressObject%7D&description=%7Blorem%7C32%7D';
const urlForBig = 'http://www.filltext.com/?rows=1000&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&delay=3&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&adress=%7BaddressObject%7D&description=%7Blorem%7C32%7D';

const renderLoaderSpinner = (elements) => {
  elements.tBody.innerHTML = `<div class="d-flex align-items-center">
  <strong>Loading...</strong>
  <div class="spinner-border text-light ms-auto" role="status" aria-hidden="true"></div>
</div>`;
  elements.btnShort.disabled = true;
  elements.btnLong.disabled = true;
};

const renderWorkedBtn = (elements) => {
  elements.btnShort.disabled = false;
  elements.btnLong.disabled = false;
};

const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

const processingData = (state) => {
  const { data } = state;
  const lastIndex = state.uiState.activePage * 50;
  const firstIndex = lastIndex - 50;
  state.uiState.tableData = data.slice(firstIndex, lastIndex);
};

const paginationHandler = (state) => (e) => {
  const el = e.target.parentElement;
    switch (el.id) {
      case 'first':
        state.uiState.activePage = 1;
        break;

      case 'next':
        state.uiState.activePage = state.uiState.activePage + 1;
        break;
      
      case 'previous':
        state.uiState.activePage = state.uiState.activePage - 1;
        break;

      case 'last':
        state.uiState.activePage = state.uiState.lastPage;
        break;
      
      default:
        state.uiState.activePage = Number(el.id);
    }
    processingData(state);
}



const app = async () => {
  const state = {
    data: [],
    uiState: {
      processState: null,
      tableData: [],
      activePage: null,
      lastPage: null,
      pagination: false,
    }
  };

  const elements = {
    btnShort: document.getElementById("short-table"),
    btnLong: document.getElementById("long-table"),
    btnClear: document.getElementById("clear-data"),
    table: document.querySelector('table'),
    tBody: document.getElementById("table-body")
  };

  const watchedState = onChange(state, async (path, value) => {
    if (path === "uiState.tableData") {
      elements.tBody.innerHTML = await renderTable(value);
    }

    if (path === 'uiState.activePage') {
      const pagination = elements.table.nextElementSibling;
      if (value) {
        if (state.uiState.pagination) {
          pagination.remove();
        }
        console.log(value);
        const newPagination = renderPagination(watchedState);
        newPagination.addEventListener('click', paginationHandler(watchedState));
        elements.table.after(newPagination);
      } else {
        pagination.remove();
      }
    }

    if (path === 'uiState.processState') {
      switch (value) {
        case 'loading':
          renderLoaderSpinner(elements);
          break;

        case 'filling':
          renderWorkedBtn(elements);
          break;

        case 'error':
          renderWorkedBtn(elements);
          elements.tBody.innerHTML = `<p class="text-warning h4">${errorMessages.network.error}</p>`
        break;

        default:
          throw new Error(`Unknown process state: ${path}`);
      }
    }
  });

  elements.btnShort.addEventListener("click", async (e) => {
    watchedState.uiState.processState = 'loading';
    try {
      const response = await axios.get(urlForShort);
      watchedState.data = await response.data;
      watchedState.uiState.tableData = await watchedState.data;
      watchedState.uiState.activePage = null;
      watchedState.uiState.pagination = false;
    } catch (error) {
      watchedState.uiState.processState = 'error';
    }
  });

  elements.btnLong.addEventListener("click", async () => {
    watchedState.uiState.processState = 'loading';
    try {
      const response = await axios.get(urlForBig);
      watchedState.data = await response.data;
      const uiData = await watchedState.data.slice(0, 50);
      watchedState.uiState.tableData = await uiData;
      watchedState.uiState.lastPage = await Math.ceil(watchedState.data.length / 50);
      
    } catch (error) {
      watchedState.uiState.processState = 'error';
    }
    if (watchedState.uiState.lastPage) {
      watchedState.uiState.activePage = 1;
    }
  });

  elements.btnClear.addEventListener("click", async () => {
    watchedState.uiState.processState = 'filling';
    watchedState.uiState.tableData = [];
    watchedState.uiState.activePage = null;
  })
};

app();
