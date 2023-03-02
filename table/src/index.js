import axios from "axios";
import onChange from "on-change";
import state from './state.js';
import renderPagination from "./renderPagination.js";
import renderTable from "./renderTable.js";
import renderLoaderSpinner from "./renderLoaderSpinner.js";
import paginationHandler from "./paginationHandler.js";
import filter from './filter.js';
import renderWorkedBtn from "./renderWorkedBtn.js";
import handlerSortingClicks from "./handlerSortingClicks.js";
import handlerSortingState from "./handlerSortingState.js";
import renderSmallTable from "./renderSmallTable.js";

const urlForShort = 'http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&adress=%7BaddressObject%7D&description=%7Blorem%7C32%7D';
const urlForBig = 'http://www.filltext.com/?rows=1000&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&delay=3&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&adress=%7BaddressObject%7D&description=%7Blorem%7C32%7D';

const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

const app = async () => {
  const elements = {
    btnShort: document.getElementById("short-table"),
    btnLong: document.getElementById("long-table"),
    btnClear: document.getElementById("clear-data"),
    table: document.getElementById('main-table'),
    tBody: document.getElementById("table-body"),
    paginationContainer: document.querySelector("nav"),
    sortableEls: document.getElementsByClassName("sortable"),
    filterForm: document.querySelector('form'),
    filterInput: document.getElementById('filterText'),
    stockContainer: document.getElementById("stock"),
  };

  const watchedState = onChange(state, async (path, value) => {
    if (path === "uiState.tableData") {
      elements.tBody.innerHTML = await renderTable(value);
      watchedState.uiState.processState = 'filling';
    }
  
    if (path === 'uiState.activePage') {
      if (value) {
        const pagination = renderPagination(watchedState);
        pagination.addEventListener('click', paginationHandler(watchedState));
        elements.paginationContainer.replaceChildren(pagination);
      } else {
        elements.paginationContainer.innerHTML = '';
      }
    }
  
    if (path === 'uiState.processState') {
      switch (value) {
        case 'loading':
          renderLoaderSpinner(elements);
          break;
  
        case 'filling':
          elements.stockContainer.innerHTML = '';
          break;

        case 'waiting':
          renderWorkedBtn(elements);
          break;
  
        case 'error':
          renderWorkedBtn(elements);
          elements.stockContainer.innerHTML = `<p class="text-warning h4">${errorMessages.network.error}</p>`
          break;
  
        default:
          throw new Error(`Unknown process state: ${path}`);
      }
    }
  
    if (path === 'uiState.clicks') {
      handlerSortingClicks(value, watchedState);
    }
  
    if (path === 'uiState.sortingState') {
      const id = watchedState.uiState.sortedColumnId;
      handlerSortingState(value, id);
    }
        
    if (path === 'uiState.filteringState') {
      if (value) {
        filter(watchedState);
        watchedState.uiState.filteringState = 'false';
      }
    }
    
    if (path === 'uiState.targetRow') {
      if (value) {
        console.log(elements.tBody.childElementCount);
        const smallTable = renderSmallTable(value);
        elements.stockContainer.replaceChildren(smallTable);
      } else {
        elements.stockContainer.innerHTML = '';
      }
    }
  });

  elements.btnShort.addEventListener("click", async (e) => {
    watchedState.uiState.processState = 'loading';
    try {
      const response = await axios.get(urlForShort);
      watchedState.data = await response.data;
      watchedState.workData = new Array(...watchedState.data);
      watchedState.uiState.tableData = await watchedState.data;
    } catch (error) {
      watchedState.uiState.processState = 'error';
    }
  });

  elements.btnLong.addEventListener("click", async () => {
    watchedState.uiState.processState = 'loading';
    try {
      const response = await axios.get(urlForBig);
      watchedState.data = await response.data;
      watchedState.workData = new Array(...watchedState.data);
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
    watchedState.uiState.processState = 'waiting';
    watchedState.uiState.tableData = [];
    watchedState.uiState.activePage = null;
    watchedState.uiState.pagination = false;
    watchedState.uiState.sortedColumnId = null;
    watchedState.uiState.clicks = 0;
    if (watchedState.uiState.sortingState) {
      watchedState.uiState.sortingState = 'delExisting';
    }
    watchedState.workData = [];
    watchedState.uiState.filtertext = '';
    watchedState.uiState.filteringState = false;
    watchedState.uiState.targetRow = null;
  })

  for (let i = 0; i < elements.sortableEls.length; i += 1) {
    elements.sortableEls[i].addEventListener("click", (e) => {
      const el = e.target;
      switch (watchedState.uiState.sortedColumnId) {
        case null:
          watchedState.uiState.sortedColumnId = elements.sortableEls[i].id;
          watchedState.uiState.sortingState = 'firstCreation';
          el.clicks = 1;
          break;

        case elements.sortableEls[i].id:
          el.clicks += 1;
          if (el.clicks % 2 === 0) {
            watchedState.uiState.sortingState = "changingToDescending";
          } else {
            watchedState.uiState.sortingState = "changingToAscending";
          }
          break;

        default:
          watchedState.uiState.clicks = 0;
          watchedState.uiState.sortingState = null;
          el.clicks = 1;
          watchedState.uiState.sortedColumnId = elements.sortableEls[i].id;
          watchedState.uiState.sortingState = 'changingColumn';
      }
      watchedState.uiState.clicks = el.clicks;      
    })
  };

  elements.filterForm.addEventListener('submit', (e) => {
    watchedState.uiState.filteringState = 'false';
    e.preventDefault();
    watchedState.uiState.filtertext = elements.filterInput.value;
    watchedState.uiState.filteringState = 'true';
  });

  elements.tBody.addEventListener('click', (e) => {
    watchedState.uiState.targetRow = null;
    const el = e.target.parentElement;
    console.log(el.outerHTML);
    watchedState.uiState.targetRow = el.outerHTML;
  })
};

app();
