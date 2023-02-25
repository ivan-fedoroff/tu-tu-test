import processingData from "./processingData.js";

export default (state) => (e) => {
    const el = e.target.parentElement;
    switch (el.id) {
      case 'first':
        state.uiState.activePage = 1;
        break;
  
      case 'next':
        state.uiState.activePage = state.uiState.activePage + 1;
        break;
  
      case 'previous':
        state.uiState.activePage = state.uiState.activePage - 1;
        break;
  
      case 'last':
        state.uiState.activePage = state.uiState.lastPage;
        break;
  
      default:
        state.uiState.activePage = Number(el.id);
    }
    processingData(state);
  };