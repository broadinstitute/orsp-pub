import { Component } from 'react';
import { input, hh, h, div, p, hr, small, button } from 'react-hyperscript-helpers';
import { Table } from './Table';
import { Panel } from './Panel';

 const headers =
  [
    { name: 'Document Type', value: 'fileType' },
    { name: 'File Name', value: 'fileName' },
    { name: 'Author', value: 'creator' },
    { name: 'Version', value: 'version' },
    { name: 'Status', value: 'status' },
    { name: 'Created', value: 'creationDate' }
  ];

 export const Documents = hh(class Documents extends Component {

   constructor(props) {
    super(props);
  }

   addDocument = (e) => {
  };

   render() {
    return div({}, [
      Panel({ title: "Key Documents" }, [
        Table({
          headers: headers,
          data: this.props.keyDocuments,
          sizePerPage: 10,
          paginationSize: 10,
          handleDialogConfirm: this.props.handleDialogConfirm,
          downloadDocumentUrl: this.props.downloadDocumentUrl,
          isAdmin: this.props.isAdmin
        })
      ]),

       Panel({ title: "Additional Documents" }, [
        Table({
          headers: headers,
          data: this.props.additionalDocuments,
          sizePerPage: 10,
          paginationSize: 10,
          handleDialogConfirm: this.props.handleDialogConfirm,
          downloadDocumentUrl: this.props.downloadDocumentUrl,
          isAdmin: this.props.isAdmin
        })
      ])
    ]);
  }
});
