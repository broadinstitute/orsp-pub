import React from 'react';
import { Component } from 'react';
import { div, hh, h, label } from 'react-hyperscript-helpers';
import '../components/Wizard.css';
import { Editor } from "@tinymce/tinymce-react";
import { Btn } from "../components/Btn";
import { Review } from "../util/ajax";
import { spinnerService } from "../util/spinner-service";
import { Spinner } from "../components/Spinner";
import { AlertMessage } from "../components/AlertMessage";

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
    spinnerService.showAll();
    Review.addComments(this.props.id, this.state.comment).then(
      response => {
        spinnerService.hideAll();
        this.setState(prev => {
          prev.comment = '';
          return prev;
        });
        this.props.insertNewComment({
          id: response.data.id,
          author: response.data.author,
          date: response.data.date,
          comment: response.data.comment
        });
      }
    ).catch(error =>
      this.setState(prev => {
        prev.showError = true;
      })
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
        Btn({
          isRendered: true,
          action: {
            label: "Add",
            handler: this.addComment,
            disabled: false
          }
        }),
        AlertMessage({
          msg: 'Error trying to save comments, please try again later.',
          show: this.state.showError,
          type: 'danger',
          closeable: true,
          closeAlertHandler: this.closeAlertHandler
        }),
        h(Spinner, {
          name: "mainSpinner", group: "orsp", loadingImage: component.loadingImage
        })
      ])
    );
  }
});
