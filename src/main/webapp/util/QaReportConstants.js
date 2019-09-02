export const QA_REPORT_SPINNER = "qaReportSpinner";
export const NO_IRB = 'noIrb';
export const IRB = 'irb';
import { div, a } from 'react-hyperscript-helpers';

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
  formatter: (cell, row, rowIndex, colIndex) =>{
    const result = datesDiff(row.age);
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

export const QA_EVENT_SORT_NAME_INDEX = {
  'projectKey': 0,
  'status': 1,
  'age': 2,
  'actor': 3,
  'type' : 4
};

export const datesDiff = (milliseconds) => {
  let secs = Math.floor(milliseconds/1000);
  let mins = Math.floor(secs/60);
  let hours = Math.floor(mins/60);
  let days = Math.floor(hours/24);
  let months = Math.floor(days/31);
  let years = Math.floor(months/12);
  months=Math.floor(months%12);
  days = Math.floor(days%31);
  hours = Math.floor(hours%24);
  mins = Math.floor(mins%60);
  secs = Math.floor(secs%60);
  return { days: days, months: months, years: years, hours: hours, mins: mins, secs: secs } ;
}


export const COLUMNS_TO_HIDE_FROM_EXCEL = ['attachments', 'reporter', 'requestDate', 'reviewCategory', 'summary', 'issueStatus'];
