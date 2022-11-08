import { getDays } from "./Utils";
import { h } from 'react-hyperscript-helpers';
import { Link } from 'react-router-dom'

// Fundings Source Report

export const FUNDING_SORT_NAME_INDEX = {
  'type': 0,
  'projectKey': 1,
  'summary': 2,
  'status': 3,
  'protocol': 4, // Not implemented
  'pis': 5, // Not implemented
  'source': 6,
  'name': 7,
  'awardNumber': 8
};

export const CATEGORY_SORT_NAME_INDEX = {
  "projectKey": 0,
  "summary": 1,
  "status": 2
};

export const SAMPLE_COLLECTION_SORT_NAME_INDEX = {
  "projectKey": 0,
  "consentKey": 1,
  "sampleCollectionId": 2,
  "status": 3
};

export const RESTRICTION_SORT_NAME_INDEX = {
  "consentGroupKey": 0,
  "vaultExportDate": 1
};

export const styles = {
  fundingReport: { 
    issueTypeWidth: '96px',
    projectKeyWidth: '109px',
    titleWidth: '280px',
    statusWidth: '98px',
    pisWidth: '80px',
    protocolWidth: '94px',
    fundingNameWidth: '124px',
    generalWidth: '136px'
  },
  reviewCategories: { 
    projectKeyWidth: '120px',
    summaryWidth: '600px',
    statusWidth: '180px',
    reviewCategoryWidth: '180'
  },
  consentCollection: { 
    consentKeyWidth: '140px',
    collectionsWidth: '750px'
  }
};

// QA Event Report Constants

export const NO_IRB = 'noIrb';
export const IRB = 'irb';
export const COMPLIANCE = 'compliance'

export const QA_REPORT_COLUMNS = [{
  dataField: 'id',
  text: 'Id',
  hidden: true,
  editable: false,
  csvExport : false
}, {
  dataField: 'projectKey',
  text: 'Project',
  sort: true,
  editable: false,
  formatter: (cell, row, rowIndex, colIndex) =>
    h(Link,{
      to: '/statusEvent/projectReport?projectKey=' + row.projectKey
    }, [row.projectKey])
}, {
  dataField: 'type',
  text: 'Type',
  sort: true,
  editable: false
}, {
  dataField: 'status',
  text: 'Status',
  sort: true,
  editable: false
}, {
  dataField: 'age',
  text: 'Days since approval',
  sort: true,
  editable: false,
  formatter: (cell, row, rowIndex, colIndex) =>
    formatAge(row.age),
  csvFormatter: (cell, row, rowIndex, colIndex) =>
    formatAge(row.age)
}, {
  dataField: 'actor',
  text: 'Assignees',
  sort: true,
  editable: false
}];

export const SIZE_PER_PAGE_LIST = [
  { text: '50', value: 50 },
  { text: '100', value: 100 },
  { text: '500', value: 500 }];

export const defaultSorted = [{
  dataField: 'date',
  order: 'desc',
  editable: false
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
  editable: false,
  csvExport : false
}, {
  dataField: PROJECT_DATA_FIELD.SUMMARY,
  text: 'Status',
  sort: true,
  editable: false,
  headerStyle: (column, colIndex) => {
    return {
      width: '484px',
    };
  }
}, {
  dataField: PROJECT_DATA_FIELD.AUTHOR,
  text: 'Author',
  sort: true,
  editable: false,
  headerStyle: (column, colIndex) => {
    return {
      width: '139px',
    };
  }
}, {
  dataField: PROJECT_DATA_FIELD.CREATED,
  text: 'Status Date',
  sort: true,
  editable: false,
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
  editable: false,
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
  const result = getDays(row);
  return result
};

export const COMPLIANCE_REPORT_COLUMNS = [
  {
    dataField: 'projectKey',
    text: 'Project',
    sort: true,
    editable: false
  },
  {
    dataField: 'firstNameOfInvestigator',
    text: 'First name of investigator',
    sort: true,
    editable: false
  },
  {
    dataField: 'lastNameOfInvestigator',
    text: 'Last name of investigator',
    sort: true,
    editable: false
  },
  {
    dataField: 'degree',
    text: 'Degree(s) of investigator',
    sort: true,
    editable: false
  },
  {
    dataField: 'typeOfInitialReview',
    text: 'Type of initial review',
    sort: true,
    editable: false
  },
  {
    dataField: 'biomedical',
    text: 'Biomedical or Non-Biomedical study',
    sort: true,
    editable: false
  },
  {
    dataField: 'submittedDate',
    text: 'Date submitted',
    sort: true,
    editable: false
  },
  {
    dataField: 'approveDate',
    text: 'Date approved',
    sort: true,
    editable: false
  },
  {
    dataField: 'daysFromSubmissionToApproval',
    text: 'Time in days from submission to approval',
    sort: true,
    editable: false
  },
  {
    dataField: 'funding',
    text: 'Funding source(s)',
    sort: true,
    editable: false
  },
  {
    dataField: 'numberofOtherEvents',
    text: 'Number of "Other Events" reported for each IRB project',
    sort: true,
    editable: false
  },
  {
    dataField: 'eventCreatedDates',
    text: 'Dates that Other Events were entered',
    sort: true,
    editable: false
  },
  {
    dataField: 'financialConflict',
    text: 'Financial conflict',
    sort: true,
    editable: false
  },
  {
    dataField: 'financialConflictDescription',
    text: 'Financial Conflict Description',
    sort: true,
    editable: false
  }
]
