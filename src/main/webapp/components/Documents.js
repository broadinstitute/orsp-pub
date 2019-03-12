import { Component, Fragment } from 'react';
import { input, hh, h, h3, div, p, hr, small, button, ul, li } from 'react-hyperscript-helpers';
import { Table } from './Table';
import { Panel } from './Panel';
import { AddDocumentDialog } from './AddDocumentDialog'
import { KeyDocumentsEnum } from "../util/KeyDocuments";

const headers =
  [
    { name: 'Document Type', value: 'fileType' },
    { name: 'File Name', value: 'fileName' },
    { name: 'Author', value: 'creator' },
    { name: 'Version', value: 'docVersion' },
    { name: 'Status', value: 'status' },
    { name: 'Created', value: 'creationDate' }
  ];

const associatedProjectsHeaders = [
  { name: '', value: 'projectKey' },
  { name: 'Type', value: 'type' },
  { name: 'Summary', value: 'summary' }
];

const addDocumentBtn = {
  position: 'absolute', right: '15px', zIndex: '1'
};

export const Documents = hh(class Documents extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showAddKeyDocuments: false,
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

  newRestriction = () => {
    window.location.href =  this.props.newRestrictionUrl;
  };

  editRestriction = () => {
    window.location.href =  this.props.serverURL + "/dataUse/edit/" + this.props.restrictionId;
  };

  showRestriction = () => {
    window.location.href =  this.props.serverURL + "/dataUse/show/" + this.props.restrictionId;
  };

  closeModal = () => {
    this.setState({ showAddKeyDocuments: !this.state.showAddKeyDocuments });
  };

  closeAdditionalModal = () => {
    this.setState({ showAddAdditionalDocuments: !this.state.showAddAdditionalDocuments });
  };

  findDul = () => {
    let dulPresent = false;
    if (this.props.keyDocuments.length !== 0) {
      this.props.keyDocuments.forEach(docs => {
        if (docs.fileType === KeyDocumentsEnum.DATA_USE_LETTER) {
          dulPresent = true;
        }
      });
    }
    return dulPresent;
  };

  render() {
    const {restriction = []} = this.props;

    return div({}, [
      AddDocumentDialog({
        closeModal: this.closeModal,
        show: this.state.showAddKeyDocuments,
        title: 'Key ',
        options: this.props.keyOptions,
        attachDocumentsUrl: this.props.attachDocumentsUrl,
        projectKey: this.props.projectKey,
        user: this.props.user,
        handleLoadDocuments: this.props.handleLoadDocuments,
        serverURL: this.props.serverURL,
        emailUrl: this.props.emailUrl,
        userName: this.props.userName
      }),
      AddDocumentDialog({
        closeModal: this.closeAdditionalModal,
        show: this.state.showAddAdditionalDocuments,
        title: 'Additional ',
        options: this.props.additionalOptions,
        attachDocumentsUrl: this.props.attachDocumentsUrl,
        projectKey: this.props.projectKey,
        user: this.props.user,
        handleLoadDocuments: this.props.handleLoadDocuments,
        serverURL: this.props.serverURL,
      }),
      Panel({title: "Key Documents"}, [
        button({
          className: "btn buttonSecondary",
          style: addDocumentBtn,
          onClick: this.addKeyDocuments
        }, ["Add Document"]),
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
      Panel({title: "Additional Documents"}, [
        button({
          className: "btn buttonSecondary",
          style: addDocumentBtn,
          onClick: this.addAdditionalDocuments
        }, ["Add Document"]),
        Table({
          headers: headers,
          data: this.props.additionalDocuments,
          sizePerPage: 10,
          paginationSize: 10,
          handleDialogConfirm: this.props.handleDialogConfirm,
          downloadDocumentUrl: this.props.downloadDocumentUrl,
          isAdmin: this.props.user.isAdmin
        })
      ]),
      div({
        isRendered: this.props.restriction !== undefined
      }, [
        Panel({
          title: "Data Use Restrictions",
          isRendered: this.props.user.isAdmin && this.findDul()
        }, [
          h3({
            style: {'marginTop': '10px'},
            isRendered: this.props.restrictionId !== null
          }, ["Summary"]),
          div({
            isRendered: restriction.length > 1
          }, [
            restriction.map((elem, index) => {
              return h(Fragment, {key: index}, [
                div({style: {'marginBottom': '10px'}}, [
                  div({style: {'marginTop': '10px'}, className: index === 0 ? 'first' : 'indented'}, [elem])
                ]),
              ]);
            }),
          ]),
          div({}, [
            button({
                className: "btn buttonSecondary",
                style: {'marginRight': '15px'},
                onClick: this.newRestriction,
                isRendered: this.props.restrictionId === null && this.findDul(),
              },
              ["Create Restriction"]),
            button({
                className: "btn buttonSecondary",
                style: {'marginRight': '15px'},
                onClick: this.editRestriction,
                isRendered: this.props.restrictionId !== null,
              },
              ["Edit Restrictions"]),
            button({
                className: "btn buttonSecondary",
                onClick: this.showRestriction,
                isRendered: this.props.restrictionId !== null,
              },
              ["View Restrictions"])
          ]),
        ]),
        div({isRendered: this.props.isConsentGroup === true && this.props.associatedProjects.length > 0}, [
          Panel({title: "Associated Projects"}, [
            Table({
              headers: associatedProjectsHeaders,
              data: this.props.associatedProjects,
              sizePerPage: 10,
              paginationSize: 10,
              unlinkProject: this.props.handleUnlinkProject,
              handleRedirectToProject: this.props.handleRedirectToProject,
              isAdmin: this.props.user.isAdmin
            })
          ])
        ])
      ])
    ])
  }
});
