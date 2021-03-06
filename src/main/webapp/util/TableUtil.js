import { getDays, downloadSelectedFile, isEmpty } from './Utils';
import { format } from 'date-fns';
import { UrlConstants } from './UrlConstants';
import { h } from 'react-hyperscript-helpers';
import { Link } from 'react-router-dom';

export const EXPORT_FILE = {
  XLSX: { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
          extension: 'xlsx' }
};

export const TABLE_ACTIONS = {
  SEARCH : "search",
  FILTER: "filter",
  PAGINATION: "pagination",
  SORT: "sort"
};

export const DEFAULT_SORTED = [{
  dataField: 'date',
  order: 'desc'
}];

export const formatNullCell = (cell)  => {
  return cell === null ? '' : cell
};

// method used to transform data format into a single array to be used for table printing
export const formatDataPrintableFormat = (data, columns) => {
  let dataArray = [];
  if (!isEmpty(data) && !isEmpty(columns)) {
    dataArray.push(columns.map(el => el.text));
    data.forEach(it => {
      dataArray.push(columns.map(
        column => {
          return parseDataElements(it, column.dataField);
        }
      ))
    });
  }
  return dataArray;
};

export const formatExcelData = (data, columns, hide) => {
  let headers = {};
  let rows= [];
  columns.filter(el => el.dataField !== 'id').forEach(el => headers[el.dataField] = el.text);
  rows.push(headers);
  if (!isEmpty(data) && !isEmpty(columns)) {
    data.forEach(el => {
      let newEl = {};
      Object.keys(el).filter(elem => (elem !== 'id' || (hide && !hide.includes(elem)) )).forEach(key => {
        newEl[key] = parseDataElements(el, key);
      });
      rows.push(newEl);
    });
  }
  return rows;
};

function parseDataElements(el, key) {
  let result = '';
  if (typeof el[key] === 'string') {
    result = el[key].replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')
  } else if (Array.isArray(el[key])) {
    result = el[key].join(', ')
  } else {
    result = el[key];
  }
  if (key === 'age') {
    const dateObj = getDays(el[key]);
    result = dateObj;
  }
  if (key === 'status') {
    result = el.type === 'Consent Group' ? '' : el.status;
  }
  return result;
}

export const formatUrlDocument = (file) => {
  return {
    href: `${UrlConstants.downloadDocumentUrl}?uuid=${file.uuid}`,
    target: '_blank',
    title: file.fileName
  }
};

export const parseDate = (date) => {
  let parsedDate = '';
  if (!isEmpty(date)) {
    const simpleDate = new Date(date);
    parsedDate = format(simpleDate, 'MM/DD/YY h:mm A');
  }
  return parsedDate;
};

export const downloadUrlDocument = (cell, row) => {
  let urlObject = {};
  if (isEmpty(row.uuid)) {
    urlObject = downloadSelectedFile(row.file);
  }
  return h(Link, {
    to: isEmpty(row.uuid) ? urlObject :`${UrlConstants.downloadDocumentUrl}?uuid=${row.uuid}`,
    target: '_blank',
    title: row.fileName,
    download: row.fileName,
  }, [row.fileName]);
};

export const createLinkToProject = (cell, row) => {
  const url = "/project/main?projectKey=" + row.projectKey + "&tab=review";
  return h(Link,{
    to: url,
    target: '_blank'
  }, [row.projectKey + ": " + row.summary]);
};
