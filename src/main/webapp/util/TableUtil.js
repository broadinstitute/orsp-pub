import { createObjectCopy, isEmpty } from "./Utils";

export const TABLE_ACTIONS = {
  SEARCH : "search",
  FILTER: "filter",
  PAGINATION: "pagination",
  SORT: "sort"
};

export const formatNullCell = (cell)  => {
  return cell === null ? '' : cell
};

// method used to transform data format into a single array to be used for table printing
export const formatData = (data, columns) => {
  let dataArray = [];
  if (!isEmpty(data) && !isEmpty(columns)) {
    dataArray.push(columns.map(el => el.text));
    data.forEach(it => {
      dataArray.push(columns.map(
        column => {
          if (isEmpty(it[column.dataField])) {
            return it[column.dataField];
          } else if (typeof (it[column.dataField]) === "string") {
            return it[column.dataField].replace(/<[^>]*>?/gm, '');
          } else if (typeof (it[column.dataField]) === "object") {
            return it[column.dataField].join(', ');
          }
        }
      ))
    });
  }
  return dataArray;
};

export const formatExcelData = (data, columns) => {
  let headers = {};
  let array= [];
  columns.forEach(el => {
    headers[el.dataField] = el.text
  });
  if (!isEmpty(data) && !isEmpty(columns)) {
    array = createObjectCopy(data);
    array.unshift(headers);
  } else {
    array.push(headers);
  }
  return array;
};
