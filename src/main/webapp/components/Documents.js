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
    { name: 'Version', value: 'docVersion' },
    { name: 'Status', value: 'status' },
    { name: 'Created', value: 'creationDate' }
  ];

const addDocumentBtn = { 
  position: 'absolute', right: '15px', zIndex: '1'
}

export const Documents = hh(class Documents extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showAddKeyDocuments : false,
      showAddAdditionalDocuments: false
    }
  }

  addKeyDocuments = () => {
    this.setState({
      showAddKeyDocuments: !this.state.showAddKeyDocuments
    });
  };

  addAdditionalDocuments = () => {
    this.setState({
      showAddAdditionalDocuments: !this.state.showAddAdditionalDocuments
    });
  };

  closeModal = () => {
    this.setState({showAddKeyDocuments: !this.state.showAddKeyDocuments});
  };

  closeAdditionalModal = () => {
    this.setState({showAddAdditionalDocuments: !this.state.showAddAdditionalDocuments});
  };

  render() {
    return div({}, [
      AddDocumentDialog({
        closeModal: this.closeModal,
        show: this.state.showAddKeyDocuments,
        title: 'Key ',
        options: this.props.keyOptions,
        attachDocumentsUrl: this.props.attachDocumentsUrl,
        projectKey: this.props.projectKey,
        user: this.props.user,
        handleLoadDocuments: this.props.handleLoadDocuments
      }),
      AddDocumentDialog({
        closeModal: this.closeAdditionalModal,
        show: this.state.showAddAdditionalDocuments,
        title: 'Additional ',
        options: this.props.additionalOptions,
        attachDocumentsUrl: this.props.attachDocumentsUrl,
        projectKey: this.props.projectKey,
        user: this.props.user,
        handleLoadDocuments: this.props.handleLoadDocuments
      }),
      Panel({ title: "Key Documents" }, [
        button({ className: "btn buttonSecondary", style: addDocumentBtn, onClick: this.addKeyDocuments }, ["Add Document"]),
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
        button({ className: "btn buttonSecondary", style: addDocumentBtn, onClick: this.addAdditionalDocuments }, ["Add Document"]),
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
