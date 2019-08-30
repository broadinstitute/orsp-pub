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
  sort: true
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

export const COLUMNS_TO_HIDE_FROM_EXCEL = ['attachments', 'reporter', 'requestDate', 'reviewCategory', 'summary', 'issueStatus'];
