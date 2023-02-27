import axios from "axios";
import onChange from "on-change";
import state from './state.js';
import arrowDown from "./icons8-down-arrow-32.png";
import arrowUp from "./icons8-up-arrow-32.png";
import renderPagination from "./renderPagination.js";
import renderTable from "./renderTable.js";
import renderLoaderSpinner from "./renderLoaderSpinner.js";
import processingData from "./processingData.js";
import paginationHandler from "./paginationHandler.js";
import renderArrow from "./renderArrow.js";
import filter from './filter.js';
import renderWorkedBtn from "./renderWorkedBtn.js";

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
    table: document.querySelector('table'),
    tBody: document.getElementById("table-body"),
    sortableEls: document.getElementsByClassName("sortable"),
    filterForm: document.querySelector('form'),
    filterInput: document.getElementById('filterText'),
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
  
    if (path === 'uiState.clicks') {
      if (value === 1) {
        const id = watchedState.uiState.sortedColumnId;
        watchedState.workData.sort((a, b) => {
          let valueA = a.adress?.[id] ?? a[id];
          let valueB = b.adress?.[id] ?? b[id];
          if (!isNaN(valueA)) {
            valueA = Number(valueA);
            valueB = Number(valueB);
          }
          if (valueA > valueB) {
            return 1;
          }
          if (valueA < valueB) {
            return -1;
          }
  
          return 0;
        });
        processingData(watchedState);
      }
      if (value > 1) {
        watchedState.workData.reverse();
        processingData(watchedState);
      }
    }
  
    if (path === 'uiState.sortingState') {
      if (value) {
        const parentEl = document.getElementById(watchedState.uiState.sortedColumnId);
        let arrow;
        switch (value) {
          case 'firstCreation':
            arrow = renderArrow('ascending');
            parentEl.appendChild(arrow);
            break;
  
          case "changingColumn":
            const elToDel = document.getElementById("arrow");
            elToDel.remove();
            arrow = renderArrow('ascending');
            parentEl.appendChild(arrow);
            break;
          
          case 'changingToDescending': 
            arrow = document.getElementById("arrow");
            arrow.src = arrowUp;
            break;
          
          case 'changingToAscending': 
            arrow = document.getElementById("arrow");
            arrow.src = arrowDown;
            break;
          
          case 'delExisting':
            arrow = document.getElementById("arrow");
            arrow.remove();
            break;
          
          default:
            throw new Error(`Unknown process state: ${path}`);
        }
      }
    }
        
    if (path === 'uiState.filteringState') {
      if (value) {
        filter(watchedState);
        watchedState.uiState.filteringState = 'false';
      }
    }
  
  });

  elements.btnShort.addEventListener("click", async (e) => {
    watchedState.uiState.processState = 'loading';
    try {
      const response = await axios.get(urlForShort);
      watchedState.data = await response.data;
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
    watchedState.uiState.processState = 'filling';
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
};

app();
