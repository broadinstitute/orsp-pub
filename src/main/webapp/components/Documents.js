import { Component } from 'react';
import { input, hh, h, div, p, hr, small, button } from 'react-hyperscript-helpers';
import { Table } from './Table';
import { Panel } from './Panel';
import { AddDocumentDialog } from './AddDocumentDialog'

const headers =
  [
    { name: 'Document Type', value: 'fileType' },
    { name: 'File Name', value: 'fileName' },
    { name: 'Author', value: 'creator' },
    { name: 'Status', value: 'status' },
    { name: 'Created', value: 'creationDate' }
  ];

export const Documents = hh(class Documents extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showAddKeyDocuments : false
    }
  }

  addDocument = (e) => {
  };

  addKeyDocuments = () => {
    this.setState({
      showAddKeyDocuments: !this.state.showAddKeyDocuments
    });
  };

  closeModal = () => {
    this.setState({showAddKeyDocuments: !this.state.showAddKeyDocuments});
  };

  render() {
    return div({}, [
        AddDocumentDialog({
          closeModal: this.closeModal,
          show: this.state.showAddKeyDocuments,
          title: ' Confirmation',
          options: this.props.options,
          attachDocumentsUrl: this.props.attachDocumentsUrl,
          projectKey: this.props.projectKey,
          user: this.props.user
      }, []),

      Panel({ title: "Key Documents" }, [
        button({ className: "btn buttonSecondary", onClick: this.addKeyDocuments }, ["Add Document"]),
        Table({
          headers: headers,
          data: this.props.keyDocuments,
          sizePerPage: 10,
          paginationSize: 10,
          handleDialogConfirm: this.props.handleDialogConfirm,
          downloadDocumentUrl: this.props.downloadDocumentUrl,
          isAdmin: this.props.user.isAdmin
        })
      ]),

      Panel({ title: "Additional Documents" }, [
        button({ className: "btn buttonSecondary", onClick: this.handleClose }, ["Add Document"]),
        Table({
          headers: headers,
          data: this.props.additionalDocuments,
          sizePerPage: 10,
          paginationSize: 10,
          handleDialogConfirm: this.props.handleDialogConfirm,
          downloadDocumentUrl: this.props.downloadDocumentUrl,
          isAdmin: this.props.user.isAdmin
        })
      ])
    ]);
  }
});
