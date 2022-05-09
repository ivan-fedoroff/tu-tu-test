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

const app = async () => {
  const state = {
    data: [],
    uiState: {
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
  });

  elements.btnShort.addEventListener("click", async () => {
    const response = await axios.get(
      "http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&adress=%7BaddressObject%7D&description=%7Blorem%7C32%7D"
    );
    watchedState.data = await response.data;
    watchedState.uiState.tableData = await watchedState.data;
  });
};

app();
