export default (state) => {
    const { data } = state;
    if (data.length > 50) {
      const lastIndex = state.uiState.activePage * 50;
      const firstIndex = lastIndex - 50;
      state.uiState.tableData = data.slice(firstIndex, lastIndex)
    } else {
      state.uiState.tableData = [];
      state.uiState.tableData = data;
    }
  };