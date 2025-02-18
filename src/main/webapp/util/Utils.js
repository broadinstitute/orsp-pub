import _ from 'lodash';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment';
import get from 'lodash/get';
import { Storage } from './Storage';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const validateEmail = (email) => {
  let valid = false;
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(email)) {
    valid = true;
  }
  return valid;
};

export const projectStatus = (project) => {
  const LEGACY = 'Legacy';
  const issueStatus = get(project, 'approvalStatus', '');
  return issueStatus !== LEGACY ? issueStatus : get(project, 'status', '');
};

export const areAllTheseThingsTruthy = (values) => {
  { _.every(values, true); }
}

export const areSomeTheseThingsTruthy = (values) => {
  { _.some(values, true); }
}

export const isEmpty = (value) => {
  if (typeof value === 'object' && value !== null  && value !== undefined) {
    return !Object.keys(value).length
  } else {
    return value === '' || value === null || value === undefined;
  }
}

export const createObjectCopy = (obj) => {
  let copy = {};
  if (!isEmpty(obj)) {
    copy = JSON.parse(JSON.stringify(obj));
  }
  return copy;
}

export const compareNotEmptyObjects = (obj1, obj2) => {
  return !isEmpty(obj1) && !isEmpty(obj2) ? JSON.stringify(obj1) === JSON.stringify(obj2) : false;
}

export const scrollToTop = () => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

export const handleRedirectToProject = (serverURL, projectKey) => {
  return [serverURL, "project", "main?projectKey=" + projectKey + "&tab=review"].join("/");
}

export const buildUrlToConsentGroup = (serverURL, consentKey, projectKey) => {
  return [serverURL, "newConsentGroup", "main?consentKey="+ consentKey + "&projectKey=" + projectKey + "&tab=review"].join("/");
}

export const dateParser = (milliseconds) => {
  return moment.duration(milliseconds, 'milliseconds')._data;
}

export const getDays = (milliseconds) => {
  return Math.floor(moment.duration(milliseconds, 'milliseconds').asDays());
}

// columns headers should be included in the first row in data array.
// Eg of data : [['header1', 'header2', 'header3'],
//               ['row1value1', 'row1value2', 'row1value3'],
//               ['row2value1', 'row2value2', 'row2value3']]
export const exportData = (action, fileName= '', data, titleText= '', headerText = '', columnsWidths, pageSize = 'A4', pageOrientation = 'portrait') => {
  let documentTemplate = {
    pageSize: pageSize,
    pageOrientation: pageOrientation,

    footer: function(currentPage, pageCount) {
      return {
        text: "Page " + currentPage.toString() + ' of ' + pageCount,
        alignment: 'center'
      }
    },
    content: [
      {
        text: new Date().toLocaleDateString(),
        alignment: 'left'
      },
      {text: [ headerText ], style: 'header'},
      {text: [ titleText ], fontSize: 14},
      {
        style: 'tableExample',
        table: {
          widths: columnsWidths,
          body: data
        }
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 5, 0, 0]
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 5]
      },
      tableExample: {
        widths: [0, 20, 0, 15]
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black'
      }
    }
  };
  if (action === 'download') {
    pdfMake.createPdf(documentTemplate).download(fileName);
  } else {
    pdfMake.createPdf(documentTemplate).print();
  }
}

export const downloadSelectedFile = (file) => {
  const fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  const blob = new Blob([file], { 'content-type': 'multipart/form-data' });
  return window.URL.createObjectURL(blob);
};

export const handleUnauthorized = (location) => {
  Storage.clearStorage();
  Storage.setLocationFrom(location);
  window.location.reload();
};

export const getDateString = (date, format) => {
  if(!date) return null;
  let inpDate = new Date(date);
  if (format === 'mmddyyyy')
    return (inpDate.getMonth() + 1).toString().padStart(2, '0') + '/' + inpDate.getDate().toString().padStart(2, '0') + '/' + inpDate.getFullYear();
  if (format === 'ddmmyyyy')
    return inpDate.getDate().toString().padStart(2, '0') + '/' + (inpDate.getMonth() + 1).toString().padStart(2, '0') + '/' + inpDate.getFullYear();
  if (format === 'yyyymmdd')
    return inpDate.getFullYear() + '/' + (inpDate.getMonth() + 1).toString().padStart(2, '0') + '/' + inpDate.getDate().toString().padStart(2, '0');
}

export function compareString(base, current) {
  base = base ? base : '';
  current = current ? current : '';
  base = base.replace(/\s+$/, '');
  base = base.replace(/<[^>]*>/g, '');
  base = base.replace(/&nbsp;/g, ' ')
  current = current.replace(/&nbsp;/g, ' ')
  current = current.replace(/\s+$/, '');
  current = current.replace(/<[^>]*>/g, '');
  const out = diff(base === '' ? [] : base.split(/\s+/), current === '' ? [] : current.split(/\s+/));
  let str = '';
  let oSpace = base.match(/\s+/g);
  if (oSpace == null) {
    oSpace = [''];
  } else {
    oSpace.push('');
  }
  let nSpace = current.match(/\s+/g);
  if (nSpace == null) {
    nSpace = [''];
  } else {
    nSpace.push('');
  }
  if (out.current.length === 0) {
    for (let i = 0; i < out.base.length; i++) {
      str += '<del>' + out.base[i] + oSpace[i] + '</del>';
    }
  } else {
    if (out.current[0].text == null) {
      for (current = 0; current < out.base.length && out.base[current].text == null; current++) {
        str += '<del>' + out.base[current] + oSpace[current] + '</del>';
      }
    }
    for (let i = 0; i < out.current.length; i++) {
      if (out.current[i].text == null) {
        str += '<ins>' + out.current[i] + nSpace[i] + '</ins>';
      } else {
        let pre = '';
        for (
          current = out.current[i].row + 1;
          current < out.base.length && out.base[current].text == null;
          current++
        ) {
          pre += '<del>' + out.base[current] + oSpace[current] + '</del>';
        }
        str += '' + out.current[i].text + nSpace[i] + pre;
      }
    }
  }
  return str;
}

function diff(base, current) {
  const newStringObject = new Object();
  const oldStringObject = new Object();
  for (let i = 0; i < current.length; i++) {
    if (newStringObject[current[i]] == null) {
      newStringObject[current[i]] = { rows: new Array(), base: null };
    }
    newStringObject[current[i]].rows.push(i);
  }
  for (let i = 0; i < base.length; i++) {
    if (oldStringObject[base[i]] == null) {
      oldStringObject[base[i]] = { rows: new Array(), current: null };
    }
    oldStringObject[base[i]].rows.push(i);
  }
  for (const i in newStringObject) {
    if (
      newStringObject[i].rows.length === 1 &&
      typeof oldStringObject[i] !== 'undefined' &&
      oldStringObject[i].rows.length === 1
    ) {
      current[newStringObject[i].rows[0]] = { text: current[newStringObject[i].rows[0]], row: oldStringObject[i].rows[0] };
      base[oldStringObject[i].rows[0]] = { text: base[oldStringObject[i].rows[0]], row: newStringObject[i].rows[0] };
    }
  }
  for (let i = 0; i < current.length - 1; i++) {
    if (
      current[i].text != null &&
      current[i + 1].text == null &&
      current[i].row + 1 < base.length &&
      base[current[i].row + 1].text == null &&
      current[i + 1] === base[current[i].row + 1]
    ) {
      current[i + 1] = { text: current[i + 1], row: current[i].row + 1 };
      base[current[i].row + 1] = { text: base[current[i].row + 1], row: i + 1 };
    }
  }
  for (let i = current.length - 1; i > 0; i--) {
    if (current[i].text != null && current[i - 1].text == null && current[i].row > 0 &&
    base[current[i].row - 1].text == null && current[i - 1] === base[current[i].row - 1]) {
       current[i - 1] = { text: current[i - 1], row: current[i].row - 1};
       base[current[i].row - 1] = { text: base[current[i].row - 1], row: i - 1 };
    }
  }
  return { base, current };
}
