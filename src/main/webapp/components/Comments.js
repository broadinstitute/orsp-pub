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
          return { width: '90px' };
        },
        formatter: (cell, row, rowIndex, formatExtraData) => {
          return (
            div({}, [
              Btn({
                style: {marginRight: '4px', padding: '4px 9px'},
                action: {
                  labelClass: "glyphicon glyphicon-pencil",
                  handler: () => _this.editComment(row)
                }
              }),
              Btn({
                action: {
                  labelClass: "glyphicon glyphicon-remove",
                  handler: () => _this.removeComment(row)
                }
              })
            ])
          )
        },
        events: {
          onClick: (e) => {
            console.log('clicked ', e);
          }
        }
      }],
      editMode: false,
      comment: {},
      showError: false
    }
  }

  handleEditorChange = (comment, editor) => {
    this.setState(prev => {
      prev.comment =  comment;
      return prev;
    });
  };

  editComment = (row) => {
    this.setState({
      comment: row,
      editMode: true
    }, () => {
      let element = document.getElementById('comment');
      element.scrollIntoView();
    })
  }

  updateComment = () => {
    console.log('update clicked ', this.state.comment)
    // this.props.showSpinner();
    // Review.addComments(this.props.id, this.state.comment).then(
    //   response => {
    //     this.props.hideSpinner();
    //     this.setState(prev => {
    //       prev.comment = '';
    //       return prev;
    //     });
    //     this.props.loadComments();
    //   }
    // ).catch(error =>
    //   this.setState(prev => {
    //     prev.showError = true;
    //   },()=> this.props.hideSpinner())
    // )
  };

  removeComment = (row, index) => {
    console.log('remove clicked ', this.state.comment)
  }

  returnToAddComment = () => {
    this.setState({
      editMode: false
    })
  }

  closeAlertHandler = () => {
    this.setState(prev => {
      prev.showError = false;
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
      h(Fragment, {
        id: 'comment',
      }, [
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
            value: this.state.comment.comment,
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
          div({
            style: {marginTop:"15px"}
            },[
            AlertMessage({
              msg: 'Error trying to save comments, please try again later.',
              show: this.state.showError,
              type: 'danger',
              closeable: true,
              closeAlertHandler: this.closeAlertHandler
            })
          ])
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
