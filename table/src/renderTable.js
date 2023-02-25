export default (data) => {
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