import { dateParser } from "./Utils";

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
  sort: true
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
  formatter: (cell, row, rowIndex, colIndex) => {
    const result = dateParser(row.age);
    return  (result.years > 0 ? result.years + ' years, ' : '') +
      (result.months > 0 ? result.months + ' months ' : '') +
      (result.months > 0 || result.years > 0 ? ' and ': '') + result.days + ' days'
  }
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
