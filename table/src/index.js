import onChange from "on-change";
import axios from "axios";

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
  const btnDisabledHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...`;
  elements.btnShort.innerHTML = btnDisabledHTML;
  elements.btnLong.innerHTML = btnDisabledHTML;
}

const renderWorkedBtn = (elements) => {
  elements.btnShort.innerHTML = 'Short table';
  elements.btnShort.disabled = false;
  elements.btnLong.innerHTML = 'Long table';
  elements.btnLong.disabled = false;
}

const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

const processingData = (data, state) => {
  const lastIndex = state.uiState.activePage * 50;
  const firstIndex = lastIndex - 50;
  state.uiState.tableData = data.slice(firstIndex, lastIndex);
};

const renderPagination = (state, watchedState) => {
  let { activePage } = watchedState.uiState;
  const data = state.data;
  const activePageInit = state.uiState.activePage;
  const { lastPage } = state.uiState;
  const activeClass = 'class="page-item active" aria-current="page"';
  const disabledClass = 'class="page-item disabled"';
  const commonClass = 'class="page-item"';
  let firstPage;
  let secondPage;
  let thirdPage;
  let firstButtonAttr;
  let secondButtonAttr;
  let thirdButtonAttr;
  let firstEllipsis;
  let secondEllipsis;
  let previousClass;
  let nextClass;
  switch (activePage) {
    case 1:
      firstPage = 1;
      firstButtonAttr = `id="1" ${activeClass}`;
      secondPage = 2;
      secondButtonAttr = `id="2" ${commonClass}`;
      thirdPage = 3;
      thirdButtonAttr = `id="3" ${commonClass}`;
      previousClass = disabledClass;
      nextClass = commonClass;
      firstEllipsis = '';
      secondEllipsis = '<li>...</li>';
      break;
    
    case lastPage:
      firstPage = lastPage - 2;
      firstButtonAttr = `id="${firstPage}" ${commonClass}`;
      secondPage = lastPage - 1;
      secondButtonAttr = `id="${secondPage}" ${commonClass}`;
      thirdPage = lastPage;
      thirdButtonAttr =  `id="${lastPage}" ${activeClass}`;
      previousClass = commonClass;
      nextClass = disabledClass;
      firstEllipsis = '<li>...</li>';
      secondEllipsis = '';
      break;
    
    default:
      firstPage = activePageInit - 1;
      firstButtonAttr = `id="${firstPage}" ${commonClass}`;
      secondPage = activePageInit;
      secondButtonAttr = `id="${activePage}" ${activeClass}`;
      thirdPage = activePageInit + 1;
      thirdButtonAttr = `id="${thirdPage}" ${commonClass}`;
      previousClass = commonClass;
      nextClass = commonClass;
      firstEllipsis = '<li> ... </li>';
      secondEllipsis = '<li> ... </li>';
  }
  const pagination = document.createElement('nav');
  pagination.ariaLabel = 'table navigation';
  pagination.innerHTML = `<ul class="pagination">
  <li id="previous" ${previousClass}>
    <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
  </li>
  ${firstEllipsis}
  <li ${firstButtonAttr}><a class="page-link" href="#">${firstPage}</a></li>
  <li ${secondButtonAttr}><a class="page-link" href="#">${secondPage}</a></li>
  <li ${thirdButtonAttr}><a class="page-link" href="#">${thirdPage}</a></li>
  ${secondEllipsis}
  <li id="next" ${nextClass}>
    <a class="page-link" href="#">Next</a>
  </li>
</ul>`;
watchedState.uiState.pagination = true;
pagination.addEventListener('click', (e) => {
  const el = e.target.parentElement;
  if (el.id) {
    switch (el.id) {
      case 'next':
        watchedState.uiState.activePage = activePage + 1;
        break;
      
      case 'previous':
        watchedState.uiState.activePage = activePage - 1;
        break;
      
      default:
        watchedState.uiState.activePage = Number(el.id);
    }
  }
  processingData(data, watchedState);
});

return pagination;
};

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
        const newPagination = renderPagination(state, watchedState);
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
      watchedState.uiState.processState = 'filling';
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
      watchedState.uiState.processState = 'filling';
    } catch (error) {
      watchedState.uiState.processState = 'error';
    }
    console.log(watchedState.uiState.lastPage);
    if (watchedState.uiState.lastPage) {
      watchedState.uiState.activePage = 1;
    }
  });
};

app();
