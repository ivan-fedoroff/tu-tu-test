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

const app = async () => {
  const state = {
    data: [],
    uiState: {
      processState: null,
      tableData: []
    }
  };

  const elements = {
    btnShort: document.querySelector("#short-table"),
    btnLong: document.querySelector("#long-table"),
    tBody: document.querySelector("#table-body")
  };

  const watchedState = onChange(state, async (path, value) => {
    if (path === "uiState.tableData") {
      elements.tBody.innerHTML = await renderTable(value);

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

  elements.btnShort.addEventListener("click", async () => {
    watchedState.uiState.processState = 'loading';
    try {
      const response = await axios.get(
        "http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&adress=%7BaddressObject%7D&description=%7Blorem%7C32%7D"
      );
      watchedState.data = await response.data;
      watchedState.uiState.tableData = await watchedState.data;
      watchedState.uiState.processState = 'filling'
    } catch (error) {
      watchedState.uiState.processState = 'error';
    }
    
  });
};

app();
