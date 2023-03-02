export default (row) => {
    const table = document.createElement("table");
    table.classList.add('table', 'table-dark');
    const tableBody = document.createElement("tbody");
    tableBody.innerHTML = row;
    table.append(tableBody);
    return table;
}