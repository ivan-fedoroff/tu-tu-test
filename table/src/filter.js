import processingData from "./processingData.js";

const getNestedValues = (array) => {
    const values = array.reduce((nestedValues, item) => {
        let el
          if (item.constructor.name === 'Object') {
            el = getNestedValues(Object.values(item));
          } else {
            el = item
          }
          nestedValues.push(el);
          return nestedValues.flat();
      }, []);
    return values;
  };

export default (state) => {
    const { data } = state;
    const { filtertext } = state.uiState;
    const filteredData = data.filter(item => {
        const values = getNestedValues(Object.values(item));
        return values.some((value) => {
            return value.toString().includes(filtertext)
        });
    })
    state.workData = filteredData;
    processingData(state);
};