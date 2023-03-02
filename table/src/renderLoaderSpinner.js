export default (elements) => {
    elements.stockContainer.innerHTML = `<div class="d-flex align-items-left">
    <div class="col"><strong>Loading...</strong></div>
    <div class="col"><div class="spinner-border text-warning" role="status"><span class="visually-hidden">Loading...</span></div></div>
  </div>`;
    elements.btnShort.disabled = true;
    elements.btnLong.disabled = true;
  };
