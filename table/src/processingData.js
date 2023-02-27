export default (state) => {
    const { workData } = state;
    if (workData.length > 50) {
      const lastIndex = state.uiState.activePage * 50;
      const firstIndex = lastIndex - 50;
      state.uiState.tableData = workData.slice(firstIndex, lastIndex)
    } else {
      state.uiState.tableData = [];
      state.uiState.tableData = workData;
    }
  };