import processingData from "./processingData.js";

export default (value, state) => {
    if (value === 1) {
        const id = state.uiState.sortedColumnId;
        state.workData.sort((a, b) => {
          let valueA = a.adress?.[id] ?? a[id];
          let valueB = b.adress?.[id] ?? b[id];
          if (!isNaN(valueA)) {
            valueA = Number(valueA);
            valueB = Number(valueB);
          }
          if (valueA > valueB) {
            return 1;
          }
          if (valueA < valueB) {
            return -1;
          }
  
          return 0;
        });
        processingData(state);
    }
    if (value > 1) {
        state.workData.reverse();
        processingData(state);
    }
};