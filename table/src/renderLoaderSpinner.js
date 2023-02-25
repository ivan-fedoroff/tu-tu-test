export default (elements) => {
    elements.tBody.innerHTML = `<div class="d-flex align-items-center">
    <strong>Loading...</strong>
    <div class="spinner-border text-light ms-auto" role="status" aria-hidden="true"></div>
  </div>`;
    elements.btnShort.disabled = true;
    elements.btnLong.disabled = true;
  };
