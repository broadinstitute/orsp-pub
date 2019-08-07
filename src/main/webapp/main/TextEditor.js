import React from 'react';
import { Component } from 'react';
import { div, hh, h, label, button } from 'react-hyperscript-helpers';
import '../components/Wizard.css';
import { Editor } from "@tinymce/tinymce-react";
import { Review } from "../util/ajax";
import { spinnerService } from "../util/spinner-service";
import { AlertMessage } from "../components/AlertMessage";
import '../components/Btn.css';
import { isEmpty } from "../util/Utils";

export const TextEditor = hh(class TextEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comment : '',
      showError: false
    };
    this.handleEditorChange = this.handleEditorChange.bind(this);
  }

  handleEditorChange = (comment, editor) => {
    this.setState(prev => {
      prev.comment =  comment;
      return prev;
    });
  };

  addComment = () => {
    spinnerService.showMain();
    Review.addComments(this.props.id, this.state.comment).then(
      response => {
        spinnerService.hideMain();
        this.setState(prev => {
          prev.comment = '';
          return prev;
        });
        this.props.loadComments();
      }
    ).catch(error =>
      this.setState(prev => {
        prev.showError = true;
      },()=> spinnerService.hideMain())
    )
  };

  closeAlertHandler = () => {
    this.setState(prev => {
      prev.showError = false;
      return prev;
    })
  };

  render() {
    return (
      div({className: "well"},[
        label({},["Add comment"]),
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
          onClick: this.addComment,
          disabled: isEmpty(this.state.comment)
        }, ["Add"]),
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
      ])
    );
  }
});
