import { dateParser } from "./Utils";
import { h } from 'react-hyperscript-helpers';
import { Link } from 'react-router-dom'

export const QA_REPORT_SPINNER = "qaReportSpinner";
export const NO_IRB = 'noIrb';
export const IRB = 'irb';

export const columns = [{
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
    formatAge(row),
  csvFormatter: (cell, row, rowIndex, colIndex) =>
    formatAge(row)
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

let formatAge = (row) => {
  const result = dateParser(row.age);
  return  (result.years > 0 ? result.years + ' years, ' : '') +
    (result.months > 0 ? result.months + ' months ' : '') +
    (result.months > 0 || result.years > 0 ? ' and ': '') + result.days + ' days'
};
