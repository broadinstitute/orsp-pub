import React, { Component, Fragment } from 'react';
import { div, h, hh, label, button } from 'react-hyperscript-helpers';
import TextEditor from './TextEditor';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { Btn } from './Btn';
import './Btn.css';
import { exportData } from '../util/Utils';
import { TableComponent } from './TableComponent';
import { formatDataPrintableFormat } from '../util/TableUtil';
import { Editor } from '@tinymce/tinymce-react';
import { AlertMessage } from '../components/AlertMessage';
import { isEmpty } from '../util/Utils';
import { Review } from '../util/ajax';
import '../components/Btn.css';
import './Wizard.css';
import LoadingWrapper from './LoadingWrapper';

const defaultSorted = [{
  dataField: 'date',
  order: 'desc'
}];

const Comments = hh(class Comments extends Component {

  constructor(props) {
    super(props);
    this.state = {
      columns: (_this) => [{
        dataField: 'id',
        text: 'Id',
        hidden: true,
        editable: false,
        csvExport : false
      }, {
        dataField: 'author',
        text: 'Author',
        sort: true,
        editable: false,
        headerStyle: (column, colIndex) => {
          return { width: '150px' };
        },
      }, {
        dataField: 'date',
        text: 'Date',
        sort: true,
        editable: false,
        headerStyle: (column, colIndex) => {
          return { width: '180px' };
        },
      }, {
        dataField: 'comment',
        text: 'Comment',
        sort: true,
        editable: false,
        formatter: (cell, row, rowIndex, colIndex) =>
          div({dangerouslySetInnerHTML: { __html: cell } },[]),
        csvFormatter: (cell, row, rowIndex, colIndex) =>
          cell.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' '),
      }, {
        dataField: '',
        text: 'Actions',
        sort: false,
        editable: false,
        headerStyle: (column, colIndex) => {
          return { width: '95px' };
        },
        formatter: (cell, row, rowIndex, formatExtraData) => {
          return (
            div({}, [
              Btn({
                btnclass: 'btnPrimary',
                style: {marginRight: '4px', padding: '4px 9px', backgroundColor: 'rgba(0, 0, 0, 0)'},
                title: 'Edit',
                action: {
                  labelClass: "glyphicon glyphicon-pencil icon",
                  handler: () => _this.editComment(row)
                }
              }),
              Btn({
                btnclass: 'btnPrimary',
                style: {marginRight: '4px', padding: '4px 9px', backgroundColor: 'rgba(0, 0, 0, 0)'},
                title: 'Remove',
                action: {
                  labelClass: "glyphicon glyphicon-remove icon",
                  handler: () => _this.removeComment(row)
                }
              })
            ])
          )
        }
      }],
      editMode: false,
      comment: {},
      showAlert: false,
      errorMsg: '',
      errorType: '',
      newComment: ''
    }
  }

  handleEditorChange = (comment, editor) => {
    this.setState(prev => {
      prev.newComment =  comment
      return prev;
    });
  };

  editComment = (row) => {
    this.setState({
      newComment: row.comment,
      comment: row,
      editMode: true
    }, () => {
      let element = document.getElementById('comment');
      element.scrollIntoView();
    })
  }

  updateComment = () => {
    this.props.showSpinner();
    this.setState(prev => {
      prev.comment.comment = this.state.newComment;
      prev.comment.author = JSON.parse(localStorage.getItem("CurrentUser")).displayName;
    }, () => {
      this.callCommentUpdate();
    });
  };

  callCommentUpdate = () => {
    Review.updateComment(this.state.comment).then(
      response => {
        this.props.hideSpinner();
        this.setState({
          showAlert: true,
          comment: '',
          errorMsg: 'Comment updated succesfully',
          errorType: 'success',
          editMode: false
        }, () => {
          this.props.updateContent();
          setTimeout(() => {
            this.setState({
              showAlert: false
            })
          }, 4000);
        });
      }
    ).catch(error =>
      this.setState(prev => {
        prev.showAlert = true;
        prev.errorMsg = 'Error trying to update comment, please try again later.';
        prev.errorType = 'danger';
        prev.editMode = false;
      },()=> {
        this.props.hideSpinner();
        setTimeout(() => {
          this.setState({
            showAlert: false
          })
        }, 4000);
      })
    )
  };

  removeComment = (row) => {
    this.props.showSpinner();
    Review.deleteComment(row.id).then(
      (response) => {
        this.props.hideSpinner();
        this.setState(prev => {
          prev.showAlert = true;
          prev.comment = '';
          prev.errorMsg = 'Comment deleted succesfully';
          prev.errorType = 'success';
          prev.editMode = false;
          return prev;
        }, () => {
          this.props.updateContent();
          setTimeout(() => {
            this.setState({
              showAlert: false
            })
          }, 4000);
        });
      }
    ).catch(error =>
      this.setState(prev => {
        prev.showAlert = true;
        prev.errorMsg = 'Error trying to delete comment, please try again later.';
        prev.errorType = 'danger';
        prev.editMode = false;
      },()=> {
        this.props.hideSpinner()
        setTimeout(() => {
          this.setState({
            showAlert: false
          })
        }, 4000);
      })
    )
  }

  returnToAddComment = () => {
    this.setState({
      editMode: false,
      showAlert: false
    })
  }

  closeAlertHandler = () => {
    this.setState(prev => {
      prev.showAlert = false;
      return prev;
    })
  };

  printComments = () => {
    let cols = this.state.columns.filter(el => el.dataField !== 'id');
    let commentsArray = formatDataPrintableFormat(this.props.comments, cols);
    const titleText = (component.issueType === "project" ? ("Project ID: "+ this.props.projectKey)
      : ("Sample Data Cohort ID:"+ component.consentKey));
    const columnsWidths = [100, '*', 200];
    exportData('print', null, commentsArray, titleText, 'ORSP Comments', columnsWidths);
  };

  render() {
    return (
      h(Fragment, [
        div({
          id: 'comment'
        }),
        h(TextEditor, {
          isRendered: !this.state.editMode,
          id: this.props.id,
          loadComments: this.props.updateContent
        }),
        div({
          isRendered: this.state.editMode,
          className: "well"
        },[
          label({},["Edit comment"]),
          h(Editor, {
            init: {
              width: '100%',
              menubar: false,
              statusbar: false,
              plugins: "paste",
              paste_data_images: false
            },
            value: this.state.newComment,
            onEditorChange: this.handleEditorChange
          }, []),
          button({
            className: "btn btn-primary",
            style: {marginTop:"15px"},
            isRendered: true,
            onClick: this.updateComment,
            disabled: isEmpty(this.state.comment)
          }, ["Save"]),
          button({
            className: "btn buttonSecondary",
            style: {marginTop:"15px", marginLeft: "5px"},
            ref: el => {
              if(el) {
                  el.style.setProperty('background', 'none', 'important');
                  el.style.setProperty('color', '#000000', 'important');
              }
            },
            isRendered: true,
            onClick: this.returnToAddComment
          }, ["Cancel"]),
        ]),
        div({
          style: {marginTop:"15px"}
          },[
          AlertMessage({
            msg: this.state.errorMsg,
            show: this.state.showAlert,
            type: this.state.errorType,
            closeable: false,
            closeAlertHandler: this.closeAlertHandler
          })
        ]),
        TableComponent({
          remoteProp: false,
          data: this.props.comments,
          columns: this.state.columns(this),
          keyField: 'id',
          search: true,
          fileName: 'ORSP',
          showPrintButton: false,
          printComments: this.printComments,
          defaultSorted: defaultSorted,
          pagination: true,
          showExportButtons: true,
          hideXlsxColumns: [],
          showSearchBar: true,
          showSaveAndCancel: this.state.showSaveAndCancel,
          saveHandler: this.saveHandler,
          cancelHandler: this.cancelHandler
        })
      ])
    )
  }
});

export default LoadingWrapper(Comments)
