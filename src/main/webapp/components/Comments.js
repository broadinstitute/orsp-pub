import React, { Component, Fragment } from 'react';
import { div, h, hh } from 'react-hyperscript-helpers';
import TextEditor from './TextEditor';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './Btn.css';
import { exportData } from '../util/Utils';
import { TableComponent } from './TableComponent';
import { formatDataPrintableFormat } from '../util/TableUtil';
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
        editable: false
      }, {
        dataField: 'date',
        text: 'Date',
        sort: true,
        editable: false
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
          return { width: '120px' };
        },
        formatter: (cell, row, rowIndex, formatExtraData) => {
          return (
            div({}, [
              Btn({
                style: {'margin-right': '5px'},
                action: {
                  labelClass: "glyphicon glyphicon-pencil",
                  handler: () => _this.editComment(row, rowIndex)
                }
              }),
              Btn({
                action: {
                  labelClass: "glyphicon glyphicon-remove",
                  handler: () => _this.removeComment(row, rowIndex)
                }
              })
            ])
          )
        }
      }],
      editMode: false,
      comment: 'test',
      showError: false
    }
  }

  handleEditorChange = (comment, editor) => {
    this.setState(prev => {
      prev.comment =  comment;
      return prev;
    });
  };

  editComment = (row, index) => {
    this.setState({
      editMode: true
    }, () => {
      let element = document.getElementById('editComment');
      element.scrollIntoView();
    })
    console.log(row, index);
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
      h(Fragment, {}, [
        h(TextEditor, {
          isRendered: !this.state.editMode,
          id: this.props.id,
          loadComments: this.props.updateContent
        }),
        div({
          id: 'editComment',
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
            value: this.state.comment,
            onEditorChange: this.handleEditorChange
          }, []),
          button({
            className: "btn btn-primary",
            style: {marginTop:"15px"},
            isRendered: true,
            onClick: this.updateComment,
            disabled: isEmpty(this.state.comment)
          }, ["Save"]),
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
