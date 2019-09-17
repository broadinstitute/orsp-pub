import { dateParser } from "./Utils";
import { h } from 'react-hyperscript-helpers';
import { Link } from 'react-router-dom'

// QA Event Report Constants

export const NO_IRB = 'noIrb';
export const IRB = 'irb';

export const QA_REPORT_COLUMNS = [{
  dataField: 'id',
  text: 'Id',
  hidden: true,
  csvExport : false
}, {
  dataField: 'projectKey',
  text: 'Project',
  sort: true,
  formatter: (cell, row, rowIndex, colIndex) =>
    h(Link,{
      to: {
        pathname:'/statusEvent/projectReport',
        state: {projectKey:row.projectKey}
      }}, [row.projectKey])
}, {
  dataField: 'type',
  text: 'Type',
  sort: true
}, {
  dataField: 'status',
  text: 'Status',
  sort: true
}, {
  dataField: 'age',
  text: 'Age',
  sort: true,
  formatter: (cell, row, rowIndex, colIndex) =>
    formatAge(row.age),
  csvFormatter: (cell, row, rowIndex, colIndex) =>
    formatAge(row.age)
}, {
  dataField: 'actor',
  text: 'Assignees',
  sort: true
}];

export const SIZE_PER_PAGE_LIST = [
  { text: '50', value: 50 },
  { text: '100', value: 100 },
  { text: '500', value: 500 }];

export const defaultSorted = [{
  dataField: 'date',
  order: 'desc'
}];

export const COLUMNS_TO_HIDE_FROM_EXCEL = ['attachments', 'reporter', 'requestDate', 'reviewCategory', 'summary', 'issueStatus'];

// Project Report Constants

const PROJECT_DATA_FIELD = {
  ID: 'event.id',
  SUMMARY: 'event.summary',
  AUTHOR: 'event.author',
  CREATED: 'event.created',
  DURATION: 'duration'
};

export const PROJECT_COLUMNS = [{
  dataField: PROJECT_DATA_FIELD.ID,
  text: 'Id',
  hidden: true,
  csvExport : false
}, {
  dataField: PROJECT_DATA_FIELD.SUMMARY,
  text: 'Status',
  sort: true,
  headerStyle: (column, colIndex) => {
    return {
      width: '484px',
    };
  }
}, {
  dataField: PROJECT_DATA_FIELD.AUTHOR,
  text: 'Author',
  sort: true,
  headerStyle: (column, colIndex) => {
    return {
      width: '139px',
    };
  }
}, {
  dataField: PROJECT_DATA_FIELD.CREATED,
  text: 'Status Date',
  sort: true,
  headerStyle: (column, colIndex) => {
    return {
      width: '241px',
    };
  },
  formatter: (cell, row, rowIndex, colIndex) =>
    new Date(cell).toLocaleString()

}, {
  dataField: PROJECT_DATA_FIELD.DURATION,
  text: 'Duration',
  sort: true,
  headerStyle: (column, colIndex) => {
    return {
      width: '235px',
    };
  },
  formatter: (cell, row, rowIndex, colIndex) =>
    formatAge(cell)
}];

export const SIZE_PER_PAGE_LIST_PROJECT = [
  { text: '15', value: 15 },
  { text: '30', value: 30 },
  { text: '50', value: 50 }];

// Common Utilities

let formatAge = (row) => {
  const result = dateParser(row);
  return  (result.years > 0 ? result.years + ' years, ' : '') +
    (result.months > 0 ? result.months + ' months ' : '') +
    (result.months > 0 || result.years > 0 ? ' and ': '') + result.days + ' days'
};
