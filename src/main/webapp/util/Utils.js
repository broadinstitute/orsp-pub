import _ from 'lodash';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

export const validateEmail = (email) => {
  let valid = false;
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(email)) {
    valid = true;
  }
  return valid;
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
