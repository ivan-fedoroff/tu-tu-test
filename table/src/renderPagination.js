export default (state) => {
    let { activePage } = state.uiState;
    const data = state.data;
    const { lastPage } = state.uiState;
    const activeClass = 'class="page-item active"';
    const disabledClass = 'class="page-item disabled"';
    const commonClass = 'class="page-item"';
    let firstPage;
    let secondPage;
    let thirdPage;
    let firstButtonClass;
    let secondButtonClass;
    let thirdButtonClass;
    let previousClass;
    let nextClass;
    switch (activePage) {
      case 1:
        firstPage = 1;
        firstButtonClass = activeClass;
        secondPage = 2;
        secondButtonClass = commonClass;
        thirdPage = 3;
        thirdButtonClass = commonClass;
        previousClass = disabledClass;
        nextClass = commonClass;
        break;
      
      case lastPage:
        firstPage = lastPage - 2;
        firstButtonClass = commonClass;
        secondPage = lastPage - 1;
        secondButtonClass = commonClass;
        thirdPage = lastPage;
        thirdButtonClass =  activeClass;
        previousClass = commonClass;
        nextClass = disabledClass;
        break;
      
      default:
        firstPage = activePage - 1;
        firstButtonClass = commonClass;
        secondPage = activePage;
        secondButtonClass = activeClass;
        thirdPage = activePage + 1;
        thirdButtonClass = commonClass;
        previousClass = commonClass;
        nextClass = commonClass;
    }
    const pagination = document.createElement('nav');
    pagination.ariaLabel = 'table navigation';
    pagination.innerHTML = `<ul class="pagination">
    <li id="first" ${previousClass}>
      <a class="page-link" href="#">First Page</a>
    </li>
    <li id="previous" ${previousClass}>
      <a class="page-link" href="#">Previous</a>
    </li>
    <li id="${firstPage}" ${firstButtonClass}><a class="page-link" href="#">${firstPage}</a></li>
    <li id="${secondPage}" ${secondButtonClass}><a class="page-link" href="#">${secondPage}</a></li>
    <li id="${thirdPage}" ${thirdButtonClass}><a class="page-link" href="#">${thirdPage}</a></li>
    <li id="next" ${nextClass}>
      <a class="page-link" href="#">Next</a>
    </li>
    <li id="last" ${nextClass}>
      <a class="page-link" href="#">Last Page</a>
    </li>
  </ul>`;
    state.uiState.pagination = true;
    return pagination;
  };