import { isEmpty } from "./Utils";

export const TABLE_ACTIONS = {
  SEARCH : "search",
  FILTER: "filter",
  PAGINATION: "pagination",
  SORT: "sort"
};

export const formatNullCell = (cell)  => {
  return cell === null ? '' : cell
};

// method used to transform data format into a single array to be used for table printing and/or excel file creation
export const formatData = (data, columns) => {
  let dataArray = [];
  if (!isEmpty(data) && !isEmpty(columns)) {
    dataArray.push(columns.map(el => el.text));
    data.forEach(funding => {
      dataArray.push(columns.map(
        column => {
          if (isEmpty(funding[column.dataField])) {
            return funding[column.dataField];
          } else if (typeof (funding[column.dataField]) !== "object") {
            return funding[column.dataField].replace();
          } else if (typeof (funding[column.dataField]) === "object") {
            return funding[column.dataField].join(', ');
          }
        }
      ))
    });
  }
  return dataArray;
};

export const formatExcelData = (data, columns) => {
  let dataArray = [];
  let values = [];
  let columnValues = [];
  if (!isEmpty(data) && !isEmpty(columns)) {
    columnValues = columns.map(el => el.text);
    data.forEach(funding => {
      values.push(columns.map(
        column => {
          if (isEmpty(funding[column.dataField])) {
            return {value: '', style: { font: { sz: "10" } }};
          } else if (typeof (funding[column.dataField]) !== "object") {
            return {value: funding[column.dataField].replace(), style: { font: { sz: "10" } }} ;
          } else if (typeof (funding[column.dataField]) === "object") {
            return {value: funding[column.dataField].join(', '), style: { font: { sz: "10" } } };
          }
        }
      ))
    });
  }
  dataArray.push({ columns: columnValues, data:values });
  return dataArray;
};
